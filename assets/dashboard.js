// ============================================================
//  BETUL DASHBOARD  -  password gate + read from our server
//  Field names are English; answer values are Turkish.
// ============================================================

const CHART_FIELDS = [
  "Overall opinion",
  "Would the site help",
  "Use it if free",
  "Would pay for help",
  "Trust online info",
  "Would tell a friend",
  "Looked for visa info before",
  "Hardest part",
  "When planning to go",
  "Age"
];

const MULTI_CHART_FIELDS = ["Target countries", "Reason to go", "What builds trust"];

const TABLE_FIELDS = [
  "Name",
  "Age",
  "Overall opinion",
  "Would the site help",
  "Use it if free",
  "Would pay for help",
  "Trust online info",
  "Would tell a friend",
  "When planning to go",
  "Target countries",
  "Reason to go",
  "Looked for visa info before",
  "Hardest part",
  "What builds trust",
  "Contact",
  "Submitted"
];

const loginScreen = document.getElementById("login-screen");
const dashScreen = document.getElementById("dash-screen");
const pwInput = document.getElementById("pw-input");
const pwBtn = document.getElementById("pw-btn");
const loginError = document.getElementById("login-error");

let currentPassword = sessionStorage.getItem("betul_pw") || "";

if (currentPassword) showDashboard();

pwBtn.addEventListener("click", tryLogin);
pwInput.addEventListener("keydown", function (e) { if (e.key === "Enter") tryLogin(); });

function tryLogin() {
  currentPassword = pwInput.value;
  loginError.textContent = "Checking…";
  showDashboard();
}

document.getElementById("logout-btn").addEventListener("click", function () {
  sessionStorage.removeItem("betul_pw");
  location.reload();
});

function showDashboard() { loadRecords(); }

function loadRecords() {
  const dashError = document.getElementById("dash-error");
  dashError.textContent = "";

  fetch("/api/responses", { headers: { "x-dash-password": currentPassword } })
    .then(function (res) {
      if (res.status === 401) {
        loginError.textContent = "Wrong password. Please try again.";
        throw new Error("bad password");
      }
      if (!res.ok) return res.text().then(function (t) { throw new Error(t); });
      return res.json();
    })
    .then(function (data) {
      sessionStorage.setItem("betul_pw", currentPassword);
      loginError.textContent = "";
      loginScreen.style.display = "none";
      dashScreen.style.display = "block";
      document.getElementById("dash-loading").style.display = "none";
      document.getElementById("dash-content").style.display = "block";
      render(data.records || []);
    })
    .catch(function (err) {
      console.error(err);
      if (err.message !== "bad password") {
        document.getElementById("dash-loading").style.display = "none";
        dashError.textContent = "Could not load answers. Please try again.";
      }
    });
}

function render(records) {
  const rows = records.map(function (r) { return r.fields || {}; });
  setClock();
  drawStats(rows);
  drawCharts(rows);
  drawTable(rows);
  requestAnimationFrame(function () { requestAnimationFrame(animateBars); });
}

function setClock() {
  const el = document.getElementById("mast-clock");
  if (!el) return;
  const d = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  el.textContent = months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

function pct(n, total) { return total ? Math.round((n / total) * 100) : 0; }

function countWhere(rows, field, values) {
  let c = 0;
  rows.forEach(function (f) { if (values.indexOf(f[field]) !== -1) c++; });
  return c;
}

function drawStats(rows) {
  const total = rows.length;
  const likeIt = countWhere(rows, "Overall opinion", ["Harika fikir", "İyi fikir"]);
  const wouldUse = countWhere(rows, "Use it if free", ["Evet"]);
  const wouldPay = countWhere(rows, "Would pay for help", ["Evet"]);

  const stats = [
    { num: String(total), label: "Responses", foot: "people answered" },
    { num: pct(likeIt, total) + "%", label: "Like the idea", foot: likeIt + " said great or good" },
    { num: pct(wouldUse, total) + "%", label: "Would use it free", foot: wouldUse + " said yes" },
    { num: pct(wouldPay, total) + "%", label: "Would pay for help", foot: wouldPay + " said yes" }
  ];

  const band = document.getElementById("stat-band");
  band.innerHTML = "";
  stats.forEach(function (s, i) {
    const el = document.createElement("div");
    el.className = "stat";
    el.style.animationDelay = (i * 0.08) + "s";
    el.innerHTML =
      '<div class="stat-num">' + formatNum(s.num) + '</div>' +
      '<div class="stat-label">' + s.label + '</div>' +
      '<div class="stat-foot">' + s.foot + '</div>';
    band.appendChild(el);
  });
}

function formatNum(s) {
  const m = String(s).match(/^(\d+)(\D+)?$/);
  if (m && m[2]) return m[1] + '<span class="suffix">' + m[2] + "</span>";
  return s;
}

function tallySingle(rows, field) {
  const counts = {};
  rows.forEach(function (f) {
    const v = f[field];
    if (v == null || v === "") return;
    counts[v] = (counts[v] || 0) + 1;
  });
  return counts;
}

function tallyMulti(rows, field) {
  const counts = {};
  rows.forEach(function (f) {
    const v = f[field];
    if (!Array.isArray(v)) return;
    v.forEach(function (item) { counts[item] = (counts[item] || 0) + 1; });
  });
  return counts;
}

function drawCharts(rows) {
  const wrap = document.getElementById("charts");
  wrap.innerHTML = "";
  const total = rows.length;

  const specs = [];
  CHART_FIELDS.forEach(function (f) { specs.push({ field: f, multi: false }); });
  MULTI_CHART_FIELDS.forEach(function (f) { specs.push({ field: f, multi: true }); });

  let shown = 0;
  specs.forEach(function (spec) {
    const counts = spec.multi ? tallyMulti(rows, spec.field) : tallySingle(rows, spec.field);
    const keys = Object.keys(counts);
    if (!keys.length) return;

    keys.sort(function (a, b) { return counts[b] - counts[a]; });
    const max = counts[keys[0]];

    const card = document.createElement("div");
    card.className = "chart-card";
    card.style.animationDelay = (shown * 0.05) + "s";
    shown++;

    let html =
      "<h3>" + escapeHtml(spec.field) + "</h3>" +
      '<div class="chart-total">' + (spec.multi ? "picks from " + total + " people" : total + " answers") + "</div>";

    keys.forEach(function (opt, idx) {
      const n = counts[opt];
      const w = max ? (n / max) * 100 : 0;
      html +=
        '<div class="bar-row">' +
          '<div class="bar-top">' +
            '<span class="opt">' + escapeHtml(opt) + "</span>" +
            '<span class="val">' + n + '<span class="pct">' + pct(n, total) + "%</span></span>" +
          "</div>" +
          '<div class="track"><div class="fill' + (idx === 0 ? " lead" : "") + '" data-w="' + w + '"></div></div>' +
        "</div>";
    });

    card.innerHTML = html;
    wrap.appendChild(card);
  });
}

function animateBars() {
  document.querySelectorAll(".fill").forEach(function (el) {
    el.style.width = (el.getAttribute("data-w") || 0) + "%";
  });
}

function opinionClass(v) {
  if (v === "Harika fikir") return "great";
  if (v === "İyi fikir") return "good";
  if (v === "İdare eder") return "okay";
  if (v === "İyi değil") return "bad";
  return "okay";
}

function drawTable(rows) {
  const table = document.getElementById("resp-table");

  let head = "<thead><tr>";
  TABLE_FIELDS.forEach(function (f) { head += "<th>" + escapeHtml(f) + "</th>"; });
  head += "</tr></thead>";

  let body = "<tbody>";
  if (!rows.length) {
    body += '<tr><td colspan="' + TABLE_FIELDS.length + '" class="muted">No answers yet. Share the survey link to get started.</td></tr>';
  }
  rows.forEach(function (f) {
    body += "<tr>";
    TABLE_FIELDS.forEach(function (field) {
      let v = f[field];

      if (field === "Name") { body += '<td class="name">' + escapeHtml(v || "—") + "</td>"; return; }
      if (field === "Overall opinion" && v) { body += '<td><span class="pill ' + opinionClass(v) + '">' + escapeHtml(v) + "</span></td>"; return; }
      if (Array.isArray(v)) {
        const chips = v.map(function (item) { return '<span class="chip">' + escapeHtml(item) + "</span>"; }).join("");
        body += "<td>" + (chips || '<span class="muted">—</span>') + "</td>";
        return;
      }
      if (field === "Submitted" && v) { body += '<td class="muted">' + escapeHtml(new Date(v).toLocaleString()) + "</td>"; return; }
      body += "<td" + (v ? "" : ' class="muted"') + ">" + escapeHtml(v == null || v === "" ? "—" : String(v)) + "</td>";
    });
    body += "</tr>";
  });
  body += "</tbody>";

  table.innerHTML = head + body;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
