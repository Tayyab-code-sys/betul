// ============================================================
//  BETUL SURVEY  (Turkish questions, English Airtable columns)
//  type "radio" = tek seçim, "check" = çok seçim, "text" = yazı
//  "field" must match the Airtable column name exactly.
// ============================================================
const QUESTIONS = [
  {
    field: "Name", type: "text", required: true,
    text: "Adınız nedir?",
    hint: "Betul kimin yanıt verdiğini bilsin diye.",
    placeholder: "Adınız"
  },
  {
    field: "Age", type: "radio", required: true, two: true,
    text: "Yaş aralığınız nedir?",
    options: ["18-24", "25-34", "35-44", "45+"]
  },
  {
    field: "Target countries", type: "check", required: true, two: true,
    text: "Hangi ülkeye gitmek istiyorsunuz?",
    hint: "Birden fazla seçebilirsiniz.",
    options: ["Almanya", "Amerika (ABD)", "Kanada", "Avustralya", "İngiltere", "Diğer Avrupa ülkeleri", "Henüz karar vermedim"]
  },
  {
    field: "Reason to go", type: "check", required: true, two: true,
    text: "Neden yurt dışına gitmek istiyorsunuz?",
    hint: "Birden fazla seçebilirsiniz.",
    options: ["Oturum / İkamet", "İş / Çalışma", "Eğitim / Okumak", "Vatandaşlık / Pasaport", "Turizm"]
  },
  {
    field: "Looked for visa info before", type: "radio", required: true,
    text: "Daha önce vize bilgisi aradınız mı?",
    options: ["Evet, çok kez", "Evet, bir iki kez", "Hayır ama arayacağım", "Hayır, hiç"]
  },
  {
    field: "Hardest part", type: "radio", required: true,
    text: "Vize bilgisi bulmanın en zor kısmı nedir?",
    options: ["Kuralları anlamak zor", "Hangi vizeye başvuracağımı bilmiyorum", "Bilgiler dağınık ve güncel değil", "Dil sorunu", "Güvenilir kaynak yok"]
  },
  {
    field: "Would the site help", type: "radio", required: true,
    text: "Net vize bilgisi veren bir site işinize yarar mı?",
    options: ["Evet, çok", "Evet, biraz", "Emin değilim", "Hayır"]
  },
  {
    field: "Trust online info", type: "radio", required: true, two: true,
    text: "İnternetteki vize bilgisine güvenir misiniz?",
    options: ["Evet", "Belki", "Hayır"]
  },
  {
    field: "Use it if free", type: "radio", required: true, two: true,
    text: "Ücretsiz olsa bu siteyi kullanır mısınız?",
    options: ["Evet", "Belki", "Hayır"]
  },
  {
    field: "Would pay for help", type: "radio", required: true, two: true,
    text: "Uzman danışmanlık için ödeme yapar mısınız?",
    options: ["Evet", "Belki", "Hayır"]
  },
  {
    field: "When planning to go", type: "radio", required: true, two: true,
    text: "Ne zaman gitmeyi planlıyorsunuz?",
    options: ["6 ay içinde", "1 yıl içinde", "1-2 yıl içinde", "Sadece araştırıyorum"]
  },
  {
    field: "Would tell a friend", type: "radio", required: true, two: true,
    text: "Bu siteyi bir arkadaşınıza önerir misiniz?",
    options: ["Evet", "Belki", "Hayır"]
  },
  {
    field: "What builds trust", type: "check", required: false, two: true,
    text: "Siteye güvenmenizi ne sağlar?",
    hint: "Birden fazla seçebilirsiniz.",
    options: ["Resmi kaynak bağlantıları", "Güncel bilgiler", "Kullanıcı yorumları", "Uzman onayı", "Başarı hikayeleri"]
  },
  {
    field: "Overall opinion", type: "radio", required: true, two: true,
    text: "Genel olarak bu fikir hakkında ne düşünüyorsunuz?",
    options: ["Harika fikir", "İyi fikir", "İdare eder", "İyi değil"]
  },
  {
    field: "Contact", type: "text", required: false,
    text: "Telefon veya e-posta (zorunlu değil)",
    hint: "Sadece Betul'un sizinle iletişime geçmesini isterseniz.",
    placeholder: "Telefon veya e-posta"
  }
];

const cfg = window.BETUL_CONFIG || {};
const box = document.getElementById("questions");

QUESTIONS.forEach(function (q, i) {
  const card = document.createElement("div");
  card.className = "q";
  card.style.animationDelay = (i * 0.04) + "s";

  const head = document.createElement("div");
  head.className = "q-head";
  head.innerHTML = '<span class="q-num">' + (i + 1) + "</span>" +
    '<span class="qtext">' + q.text + (q.required ? " *" : "") + "</span>";
  card.appendChild(head);

  if (q.hint) {
    const hint = document.createElement("p");
    hint.className = "qhint";
    hint.textContent = q.hint;
    card.appendChild(hint);
  }

  if (q.type === "text") {
    const input = document.createElement("input");
    input.className = "text-input";
    input.type = "text";
    input.name = q.field;
    input.placeholder = q.placeholder || "";
    if (q.required) input.required = true;
    input.addEventListener("input", updateProgress);
    card.appendChild(input);
  } else {
    const opts = document.createElement("div");
    opts.className = "options" + (q.two ? " two" : "");
    q.options.forEach(function (optText) {
      const wrap = document.createElement("label");
      wrap.className = "opt " + (q.type === "check" ? "check" : "radio");
      const input = document.createElement("input");
      input.type = q.type === "check" ? "checkbox" : "radio";
      input.name = q.field;
      input.value = optText;

      const boxEl = document.createElement("span");
      boxEl.className = "box";
      const txt = document.createElement("span");
      txt.className = "txt";
      txt.textContent = optText;

      wrap.appendChild(input);
      wrap.appendChild(boxEl);
      wrap.appendChild(txt);
      opts.appendChild(wrap);

      input.addEventListener("change", function () {
        if (q.type === "radio") {
          opts.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("checked"); });
        }
        wrap.classList.toggle("checked", input.checked);
        updateProgress();
      });
    });
    card.appendChild(opts);
  }

  box.appendChild(card);
});

// ---------- Progress bar ----------
const fillp = document.getElementById("fillp");
function updateProgress() {
  const fields = collectAnswers();
  let done = 0;
  QUESTIONS.forEach(function (q) { if (fields[q.field]) done++; });
  const p = Math.round((done / QUESTIONS.length) * 100);
  if (fillp) fillp.style.width = p + "%";
}

// ---------- WhatsApp links ----------
const waNumber = (cfg.whatsapp || "").replace(/[^0-9]/g, "");
const waLink = "https://wa.me/" + waNumber;
["wa-thanks", "wa-contact"].forEach(function (id) {
  const el = document.getElementById(id);
  if (el) el.href = waLink;
});

// ---------- Read answers ----------
function collectAnswers() {
  const form = document.getElementById("survey-form");
  const fields = {};
  QUESTIONS.forEach(function (q) {
    if (q.type === "text") {
      const el = form.querySelector('[name="' + CSS.escape(q.field) + '"]');
      const val = el ? el.value.trim() : "";
      if (val) fields[q.field] = val;
    } else if (q.type === "check") {
      const checked = form.querySelectorAll('[name="' + CSS.escape(q.field) + '"]:checked');
      const vals = Array.prototype.map.call(checked, function (c) { return c.value; });
      if (vals.length) fields[q.field] = vals;
    } else {
      const el = form.querySelector('[name="' + CSS.escape(q.field) + '"]:checked');
      if (el) fields[q.field] = el.value;
    }
  });
  return fields;
}

function firstMissing(fields) {
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    if (q.required && !fields[q.field]) return { q: q, i: i };
  }
  return null;
}

// ---------- Submit ----------
const form = document.getElementById("survey-form");
const errorLine = document.getElementById("error-line");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  errorLine.textContent = "";

  const fields = collectAnswers();
  const missing = firstMissing(fields);
  if (missing) {
    errorLine.textContent = "Lütfen şu soruyu yanıtlayın: " + missing.q.text;
    const cards = document.querySelectorAll("#questions .q");
    if (cards[missing.i]) cards[missing.i].scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Gönderiliyor...";

  fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: fields })
  })
    .then(function (res) {
      if (!res.ok) return res.text().then(function (t) { throw new Error(t); });
      return res.json();
    })
    .then(function () {
      form.style.display = "none";
      const thanks = document.getElementById("thanks");
      thanks.style.display = "block";
      thanks.scrollIntoView({ behavior: "smooth", block: "center" });
    })
    .catch(function (err) {
      console.error(err);
      errorLine.textContent = "Bir şeyler ters gitti. Lütfen tekrar deneyin.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Yanıtlarımı gönder";
    });
});
