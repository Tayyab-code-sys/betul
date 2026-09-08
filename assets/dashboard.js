// ============================================================
//  BETUL DASHBOARD  -  "Control Tower"
//  Password gate + read from our server + Chart.js visuals.
//  Field names and answer values are English.
// ============================================================

// Single choice questions shown as DONUT charts (sentiment).
const DONUT_FIELDS = [
  "Overall opinion",
  "Would the site help",
  "Use it if free",
  "Would pay for help",
  "Trust online info",
  "Would tell a friend"
];

// Questions shown as horizontal BAR charts.
const BAR_MULTI_FIELDS = ["Target countries", "Reason to go", "What builds trust"];
const BAR_SINGLE_FIELDS = ["Age", "Looked for visa info before", "When planning to go", "Hardest part"];

const TABLE_FIELDS = [
  "Name", "Age", "Overall opinion", "Would the site help", "Use it if free",
  "Would pay for help", "Trust online info", "Would tell a friend", "When planning to go",
  "Target countries", "Reason to go", "Looked for visa info before", "Hardest part",
  "What builds trust", "Contact", "Submitted"
];

// ---------- Colors ----------
const PALETTE = ["#34d1bf", "#f4b62c", "#5b8def", "#ff7a5c", "#b98cff", "#6ee7a8", "#f78fb3", "#9aa6c8"];
const SENTIMENT = {
  "Great idea": "#34d1bf", "Good idea": "#6ee7a8", "Okay idea": "#f4b62c", "Not a good idea": "#ff7a5c",
  "Yes, a lot": "#34d1bf", "Yes, a little": "#6ee7a8", "Not sure": "#f4b62c",
  "Yes": "#34d1bf", "Maybe": "#f4b62c", "No": "#ff7a5c",
  "Yes, many times": "#34d1bf", "Yes, once or twice": "#6ee7a8", "No, but I will": "#f4b62c", "No, never": "#ff7a5c"
};
function colorFor(value, i) { return SENTIMENT[value] || PALETTE[i % PALETTE.length]; }

// ---------- Auth ----------
const loginScreen = document.getElementById("login-screen");
const dashScreen = document.getElementById("dash-screen");
const pwInput = document.getElementById("pw-input");
const pwBtn = document.getElementById("pw-btn");
const loginError = document.getElementById("login-error");

let currentPassword = sessionStorage.getItem("betul_pw") || "";
let charts = [];

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
      if (res.status === 401) { loginError.textContent = "Wrong password. Please try again."; throw new Error("bad password"); }
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

// ---------- Chart.js base setup ----------
if (window.Chart) {
  Chart.defaults.font.family = "'Manrope', system-ui, sans-serif";
  Chart.defaults.color = "#8b98b8";
}

// Draws the total in the middle of a doughnut.
const centerTextPlugin = {
  id: "centerText",
  afterDraw: function (chart) {
    if (chart.config.type !== "doughnut") return;
    const total = chart.data.datasets[0].data.reduce(function (a, b) { return a + b; }, 0);
    const ctx = chart.ctx;
    const x = (chart.chartArea.left + chart.chartArea.right) / 2;
    const y = (chart.chartArea.top + chart.chartArea.bottom) / 2;
    ctx.save();
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#eef2fb";
    ctx.font = "700 26px 'JetBrains Mono', monospace";
    ctx.fillText(String(total), x, y - 6);
    ctx.fillStyle = "#5f6d8c";
    ctx.font = "500 10px 'JetBrains Mono', monospace";
    ctx.fillText("TOTAL", x, y + 14);
    ctx.restore();
  }
};

// Draws the value at the end of each horizontal bar.
const barValuePlugin = {
  id: "barValue",
  afterDatasetsDraw: function (chart) {
    if (chart.config.type !== "bar") return;
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(0);
    ctx.save();
    ctx.fillStyle = "#eef2fb";
    ctx.font = "700 12px 'JetBrains Mono', monospace";
    ctx.textBaseline = "middle";
    meta.data.forEach(function (bar, i) {
      const val = chart.data.datasets[0].data[i];
      if (val == null) return;
      ctx.textAlign = "left";
      ctx.fillText(String(val), bar.x + 8, bar.y);
    });
    ctx.restore();
  }
};

if (window.Chart) { Chart.register(centerTextPlugin, barValuePlugin); }

// ---------- Render ----------
function render(records) {
  const rows = records.map(function (r) { return r.fields || {}; });
  charts.forEach(function (c) { c.destroy(); });
  charts = [];

  setClock();
  drawStats(rows);
  drawDonuts(rows);
  drawBars(rows);
  drawTable(rows);
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
  let c = 0; rows.forEach(function (f) { if (values.indexOf(f[field]) !== -1) c++; }); return c;
}

function drawStats(rows) {
  const total = rows.length;
  const likeIt = countWhere(rows, "Overall opinion", ["Great idea", "Good idea"]);
  const wouldUse = countWhere(rows, "Use it if free", ["Yes"]);
  const wouldPay = countWhere(rows, "Would pay for help", ["Yes"]);

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
    el.innerHTML = '<div class="stat-num">' + formatNum(s.num) + '</div>' +
      '<div class="stat-label">' + s.label + '</div><div class="stat-foot">' + s.foot + '</div>';
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
  rows.forEach(function (f) { const v = f[field]; if (v == null || v === "") return; counts[v] = (counts[v] || 0) + 1; });
  return counts;
}
function tallyMulti(rows, field) {
  const counts = {};
  rows.forEach(function (f) { const v = f[field]; if (!Array.isArray(v)) return; v.forEach(function (it) { counts[it] = (counts[it] || 0) + 1; }); });
  return counts;
}

function makeCard(parent, field, subtitle, heightPx) {
  const card = document.createElement("div");
  card.className = "chart-card";
  card.innerHTML = "<h3>" + escapeHtml(field) + "</h3>" +
    '<div class="chart-total">' + subtitle + "</div>" +
    '<div class="cwrap" style="height:' + heightPx + 'px"><canvas></canvas></div>';
  parent.appendChild(card);
  return card.querySelector("canvas");
}

function emptyNote(parent, msg) {
  const p = document.createElement("p");
  p.className = "empty-note";
  p.textContent = msg;
  parent.appendChild(p);
}

function drawDonuts(rows) {
  const wrap = document.getElementById("donuts");
  wrap.innerHTML = "";
  const total = rows.length;

  if (!total) { emptyNote(wrap, "No answers yet. Share the survey link to start collecting feedback."); return; }

  DONUT_FIELDS.forEach(function (field) {
    const counts = tallySingle(rows, field);
    const labels = Object.keys(counts);
    if (!labels.length) return;
    labels.sort(function (a, b) { return counts[b] - counts[a]; });
    const data = labels.map(function (l) { return counts[l]; });
    const colors = labels.map(function (l, i) { return colorFor(l, i); });

    const canvas = makeCard(wrap, field, total + " answers", 250);
    charts.push(new Chart(canvas.getContext("2d"), {
      type: "doughnut",
      data: { labels: labels, datasets: [{ data: data, backgroundColor: colors, borderColor: "#111b2e", borderWidth: 3, hoverOffset: 8 }] },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "64%",
        plugins: {
          legend: { position: "bottom", labels: { color: "#8b98b8", usePointStyle: true, pointStyle: "circle", boxWidth: 8, boxHeight: 8, padding: 12, font: { size: 12 } } },
          tooltip: { callbacks: { label: function (c) { return " " + c.label + ": " + c.parsed + " (" + pct(c.parsed, total) + "%)"; } } }
        },
        animation: { animateScale: true, duration: 700 }
      }
    }));
  });
}

function drawBars(rows) {
  const wrap = document.getElementById("charts");
  wrap.innerHTML = "";
  const total = rows.length;
  if (!total) return;

  const specs = [];
  BAR_MULTI_FIELDS.forEach(function (f) { specs.push({ field: f, multi: true }); });
  BAR_SINGLE_FIELDS.forEach(function (f) { specs.push({ field: f, multi: false }); });

  specs.forEach(function (spec) {
    const counts = spec.multi ? tallyMulti(rows, spec.field) : tallySingle(rows, spec.field);
    const labels = Object.keys(counts);
    if (!labels.length) return;
    labels.sort(function (a, b) { return counts[b] - counts[a]; });
    const data = labels.map(function (l) { return counts[l]; });
    const colors = labels.map(function (l, i) { return spec.multi ? PALETTE[i % PALETTE.length] : colorFor(l, i); });

    const height = Math.max(150, labels.length * 42 + 30);
    const canvas = makeCard(wrap, spec.field, spec.multi ? "picks from " + total + " people" : total + " answers", height);
    const maxVal = Math.max.apply(null, data);

    charts.push(new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: { labels: labels, datasets: [{ data: data, backgroundColor: colors, borderRadius: 7, borderSkipped: false, barThickness: "flex", maxBarThickness: 30 }] },
      options: {
        indexAxis: "y", responsive: true, maintainAspectRatio: false,
        layout: { padding: { right: 26 } },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return " " + c.parsed.x + " (" + pct(c.parsed.x, total) + "%)"; } } }
        },
        scales: {
          x: { beginAtZero: true, suggestedMax: maxVal + 1, ticks: { precision: 0, color: "#5f6d8c", font: { family: "'JetBrains Mono', monospace", size: 11 } }, grid: { color: "rgba(255,255,255,0.05)" }, border: { display: false } },
          y: { ticks: { color: "#eef2fb", font: { size: 12.5 }, crossAlign: "far" }, grid: { display: false }, border: { display: false } }
        },
        animation: { duration: 800 }
      }
    }));
  });
}

function opinionClass(v) {
  if (v === "Great idea") return "great";
  if (v === "Good idea") return "good";
  if (v === "Okay idea") return "okay";
  if (v === "Not a good idea") return "bad";
  return "okay";
}

function drawTable(rows) {
  const table = document.getElementById("resp-table");
  let head = "<thead><tr>";
  TABLE_FIELDS.forEach(function (f) { head += "<th>" + escapeHtml(f) + "</th>"; });
  head += "</tr></thead>";

  let body = "<tbody>";
  if (!rows.length) {
    body += '<tr><td colspan="' + TABLE_FIELDS.length + '" class="muted">No answers yet.</td></tr>';
  }
  rows.forEach(function (f) {
    body += "<tr>";
    TABLE_FIELDS.forEach(function (field) {
      let v = f[field];
      if (field === "Name") { body += '<td class="name">' + escapeHtml(v || "—") + "</td>"; return; }
      if (field === "Overall opinion" && v) { body += '<td><span class="pill ' + opinionClass(v) + '">' + escapeHtml(v) + "</span></td>"; return; }
      if (Array.isArray(v)) {
        const chips = v.map(function (it) { return '<span class="chip">' + escapeHtml(it) + "</span>"; }).join("");
        body += "<td>" + (chips || '<span class="muted">—</span>') + "</td>"; return;
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
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
