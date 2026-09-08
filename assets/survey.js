// ============================================================
//  BETUL SURVEY  -  bilingual (TR / EN)
//  The visitor can switch language. The VALUE saved to Airtable
//  is always the ENGLISH string (o.v), so the data and the
//  dashboard are all in English no matter which language was shown.
//  "field" must match the Airtable column name exactly.
// ============================================================

// Helper for a multiple-choice option: O(turkishLabel, englishLabel).
// The stored value is the English label.
function O(tr, en) { return { v: en, tr: tr, en: en }; }

const QUESTIONS = [
  {
    field: "Name", type: "text", required: true,
    text: { tr: "Adınız nedir?", en: "What is your name?" },
    hint: { tr: "Betul kimin yanıt verdiğini bilsin diye.", en: "So Betul knows who gave this feedback." },
    placeholder: { tr: "Adınız", en: "Your name" }
  },
  {
    field: "Age", type: "radio", required: true, two: true,
    text: { tr: "Yaş aralığınız nedir?", en: "What is your age range?" },
    options: [O("18-24", "18-24"), O("25-34", "25-34"), O("35-44", "35-44"), O("45+", "45+")]
  },
  {
    field: "Target countries", type: "check", required: true, two: true,
    text: { tr: "Hangi ülkeye gitmek istiyorsunuz?", en: "Which country do you want to go to?" },
    hint: { tr: "Birden fazla seçebilirsiniz.", en: "You can pick more than one." },
    options: [
      O("Almanya", "Germany"), O("Amerika (ABD)", "USA"), O("Kanada", "Canada"),
      O("Avustralya", "Australia"), O("İngiltere", "UK"),
      O("Diğer Avrupa ülkeleri", "Other European countries"), O("Henüz karar vermedim", "Not decided yet")
    ]
  },
  {
    field: "Reason to go", type: "check", required: true, two: true,
    text: { tr: "Neden yurt dışına gitmek istiyorsunuz?", en: "Why do you want to go abroad?" },
    hint: { tr: "Birden fazla seçebilirsiniz.", en: "You can pick more than one." },
    options: [
      O("Oturum / İkamet", "Residence"), O("İş / Çalışma", "Work"), O("Eğitim / Okumak", "Study"),
      O("Vatandaşlık / Pasaport", "Citizenship / Passport"), O("Turizm", "Tourism")
    ]
  },
  {
    field: "Looked for visa info before", type: "radio", required: true,
    text: { tr: "Daha önce vize bilgisi aradınız mı?", en: "Have you looked for visa information before?" },
    options: [
      O("Evet, çok kez", "Yes, many times"), O("Evet, bir iki kez", "Yes, once or twice"),
      O("Hayır ama arayacağım", "No, but I will"), O("Hayır, hiç", "No, never")
    ]
  },
  {
    field: "Hardest part", type: "radio", required: true,
    text: { tr: "Vize bilgisi bulmanın en zor kısmı nedir?", en: "What is the hardest part of finding visa information?" },
    options: [
      O("Kuralları anlamak zor", "Rules are hard to understand"),
      O("Hangi vizeye başvuracağımı bilmiyorum", "I don't know which visa to apply for"),
      O("Bilgiler dağınık ve güncel değil", "Info is scattered and outdated"),
      O("Dil sorunu", "Language problem"), O("Güvenilir kaynak yok", "No trusted source")
    ]
  },
  {
    field: "Would the site help", type: "radio", required: true,
    text: { tr: "Net vize bilgisi veren bir site işinize yarar mı?", en: "Would a website with clear visa information help you?" },
    options: [O("Evet, çok", "Yes, a lot"), O("Evet, biraz", "Yes, a little"), O("Emin değilim", "Not sure"), O("Hayır", "No")]
  },
  {
    field: "Trust online info", type: "radio", required: true, two: true,
    text: { tr: "İnternetteki vize bilgisine güvenir misiniz?", en: "Would you trust visa information online?" },
    options: [O("Evet", "Yes"), O("Belki", "Maybe"), O("Hayır", "No")]
  },
  {
    field: "Use it if free", type: "radio", required: true, two: true,
    text: { tr: "Ücretsiz olsa bu siteyi kullanır mısınız?", en: "Would you use this website if it is free?" },
    options: [O("Evet", "Yes"), O("Belki", "Maybe"), O("Hayır", "No")]
  },
  {
    field: "Would pay for help", type: "radio", required: true, two: true,
    text: { tr: "Uzman danışmanlık için ödeme yapar mısınız?", en: "Would you pay for expert help (consulting)?" },
    options: [O("Evet", "Yes"), O("Belki", "Maybe"), O("Hayır", "No")]
  },
  {
    field: "When planning to go", type: "radio", required: true, two: true,
    text: { tr: "Ne zaman gitmeyi planlıyorsunuz?", en: "When do you plan to go?" },
    options: [
      O("6 ay içinde", "Within 6 months"), O("1 yıl içinde", "Within a year"),
      O("1-2 yıl içinde", "In 1-2 years"), O("Sadece araştırıyorum", "Just researching")
    ]
  },
  {
    field: "Would tell a friend", type: "radio", required: true, two: true,
    text: { tr: "Bu siteyi bir arkadaşınıza önerir misiniz?", en: "Would you tell a friend about this website?" },
    options: [O("Evet", "Yes"), O("Belki", "Maybe"), O("Hayır", "No")]
  },
  {
    field: "What builds trust", type: "check", required: false, two: true,
    text: { tr: "Siteye güvenmenizi ne sağlar?", en: "What would make you trust the site?" },
    hint: { tr: "Birden fazla seçebilirsiniz.", en: "You can pick more than one." },
    options: [
      O("Resmi kaynak bağlantıları", "Links to official sources"), O("Güncel bilgiler", "Up-to-date information"),
      O("Kullanıcı yorumları", "User reviews"), O("Uzman onayı", "Expert approval"), O("Başarı hikayeleri", "Success stories")
    ]
  },
  {
    field: "Overall opinion", type: "radio", required: true, two: true,
    text: { tr: "Genel olarak bu fikir hakkında ne düşünüyorsunuz?", en: "Overall, what do you think of this idea?" },
    options: [O("Harika fikir", "Great idea"), O("İyi fikir", "Good idea"), O("İdare eder", "Okay idea"), O("İyi değil", "Not a good idea")]
  },
  {
    field: "Contact", type: "text", required: false,
    text: { tr: "Telefon veya e-posta (zorunlu değil)", en: "Phone or email (optional)" },
    hint: { tr: "Sadece Betul'un sizinle iletişime geçmesini isterseniz.", en: "Only if you are happy for Betul to contact you." },
    placeholder: { tr: "Telefon veya e-posta", en: "Phone or email" }
  }
];

// ---------- Static UI strings ----------
const I18N = {
  tr: {
    "nav.login": "Panel girişi",
    "hero.kicker": "Yurt dışına açılın",
    "hero.h1a": "Doğru vizeyi bulmak ", "hero.h1grad": "artık kolay.",
    "hero.lead1": "Yurt dışında yaşamak, çalışmak veya okumak mı istiyorsunuz? Size uygun vizeleri tek bir yerde bulun.",
    "hero.lead2": "Bu siteyi yapmadan önce sizin fikrinizi almak istiyoruz.",
    "hero.cta": "Ankete başla", "hero.meta": "2 dakika sürer · Tamamen ücretsiz",
    "pass.label": "Biniş kartı · Boarding pass", "pass.from": "Türkiye", "pass.to": "Yeni hayat",
    "pass.k1": "Yolcu", "pass.v1": "Siz", "pass.k2": "Vize", "pass.v2": "Doğru olan", "pass.k3": "Tarih", "pass.v3": "Yakında",
    "flag.de": "Almanya", "flag.us": "ABD", "flag.ca": "Kanada", "flag.au": "Avustralya", "flag.uk": "İngiltere",
    "idea.kicker": "Fikir", "idea.h2": "Fikir çok basit",
    "idea.p": "Almanya, ABD, Kanada, Avustralya, İngiltere ve daha fazlası. Her ülkenin hangi vizeleri sunduğunu, kimin başvurabileceğini ve nasıl başvurulacağını tek bir yerde göstereceğiz.",
    "idea.n1": "ARAŞTIR", "idea.h31": "Ülkeyi seçin", "idea.p1": "Size uygun vizeleri saniyeler içinde görün.",
    "idea.n2": "KARŞILAŞTIR", "idea.h32": "Seçenekleri görün", "idea.p2b": "Oturum, iş, eğitim, vatandaşlık. Hepsi net.",
    "idea.n3": "BAŞVUR", "idea.h33": "Adımları öğrenin", "idea.p3": "Doğru yolu ve resmi kaynakları öğrenin.",
    "idea.p4": "Peki bu iyi bir fikir mi? Aşağıdaki kısa anket bize yol gösterecek.",
    "form.kicker": "Kısa anket", "form.h2": "Fikrinizi paylaşın", "form.p": "Tüm sorular çoktan seçmeli. Dürüst cevaplarınız çok değerli.",
    "form.submit": "Yanıtlarımı gönder", "form.sending": "Gönderiliyor...", "form.note": "Yanıtlarınız gizlidir. Sadece Betul görebilir.",
    "err.missing": "Lütfen şu soruyu yanıtlayın: ", "err.generic": "Bir şeyler ters gitti. Lütfen tekrar deneyin.",
    "thanks.stamp": "ONAYLANDI", "thanks.h2": "Teşekkür ederiz!",
    "thanks.p1": "Yanıtlarınızı aldık. Fikriniz bu projeyi doğru şekilde kurmamıza yardım ediyor.",
    "thanks.p2": "Fikir hakkında konuşmak ister misiniz? Betul'a WhatsApp'tan yazabilirsiniz.", "thanks.wa": "WhatsApp'tan yaz",
    "contact.h2": "Sorunuz mu var?", "contact.p": "Bu proje hakkında bize ulaşın.", "contact.wa": "Betul'a WhatsApp'tan yaz",
    "footer.tag": "Betul · Yurt dışı yolculuğunuz için doğru vize bilgisi",
    "footer.built": '<a href="https://tfhsoftware.com/" target="_blank" rel="noopener">TFH Software</a> tarafından yapıldı'
  },
  en: {
    "nav.login": "Owner login",
    "hero.kicker": "Go abroad",
    "hero.h1a": "Finding the right visa is ", "hero.h1grad": "easy now.",
    "hero.lead1": "Do you want to live, work, or study abroad? Find the visas that fit you, all in one place.",
    "hero.lead2": "Before we build this site, we want your opinion.",
    "hero.cta": "Start the survey", "hero.meta": "Takes 2 minutes · Completely free",
    "pass.label": "Boarding pass", "pass.from": "Türkiye", "pass.to": "New life",
    "pass.k1": "Passenger", "pass.v1": "You", "pass.k2": "Visa", "pass.v2": "The right one", "pass.k3": "Date", "pass.v3": "Soon",
    "flag.de": "Germany", "flag.us": "USA", "flag.ca": "Canada", "flag.au": "Australia", "flag.uk": "UK",
    "idea.kicker": "The idea", "idea.h2": "The idea is simple",
    "idea.p": "Germany, USA, Canada, Australia, the UK, and more. We will show which visas each country offers, who can apply, and how to apply, all in one place.",
    "idea.n1": "EXPLORE", "idea.h31": "Pick a country", "idea.p1": "See the visas that fit you in seconds.",
    "idea.n2": "COMPARE", "idea.h32": "See the options", "idea.p2b": "Residence, work, study, citizenship. All clear.",
    "idea.n3": "APPLY", "idea.h33": "Learn the steps", "idea.p3": "Learn the right path and official sources.",
    "idea.p4": "So is this a good idea? The short survey below will guide us.",
    "form.kicker": "Short survey", "form.h2": "Share your opinion", "form.p": "All questions are multiple choice. Your honest answers matter a lot.",
    "form.submit": "Send my answers", "form.sending": "Sending...", "form.note": "Your answers are private. Only Betul can see them.",
    "err.missing": "Please answer: ", "err.generic": "Something went wrong. Please try again.",
    "thanks.stamp": "APPROVED", "thanks.h2": "Thank you!",
    "thanks.p1": "We got your answers. Your feedback helps us build the right thing.",
    "thanks.p2": "Want to talk about the idea? Message Betul on WhatsApp.", "thanks.wa": "Chat on WhatsApp",
    "contact.h2": "Have a question?", "contact.p": "Reach out about this project.", "contact.wa": "Message Betul on WhatsApp",
    "footer.tag": "Betul · The right visa information for your journey abroad",
    "footer.built": 'Built by <a href="https://tfhsoftware.com/" target="_blank" rel="noopener">TFH Software</a>'
  }
};

let LANG = localStorage.getItem("betul_lang") || "tr";

const cfg = window.BETUL_CONFIG || {};
const box = document.getElementById("questions");
const built = []; // refs so we can re-label on language change

QUESTIONS.forEach(function (q, i) {
  const card = document.createElement("div");
  card.className = "q";
  card.style.animationDelay = (i * 0.04) + "s";

  const head = document.createElement("div");
  head.className = "q-head";
  const num = document.createElement("span");
  num.className = "q-num";
  num.textContent = (i + 1);
  const qtext = document.createElement("span");
  qtext.className = "qtext";
  head.appendChild(num);
  head.appendChild(qtext);
  card.appendChild(head);

  let hintEl = null;
  if (q.hint) {
    hintEl = document.createElement("p");
    hintEl.className = "qhint";
    card.appendChild(hintEl);
  }

  const ref = { q: q, qtext: qtext, hint: hintEl, input: null, optionEls: [] };

  if (q.type === "text") {
    const input = document.createElement("input");
    input.className = "text-input";
    input.type = "text";
    input.name = q.field;
    if (q.required) input.required = true;
    input.addEventListener("input", updateProgress);
    ref.input = input;
    card.appendChild(input);
  } else {
    const opts = document.createElement("div");
    opts.className = "options" + (q.two ? " two" : "");
    q.options.forEach(function (o) {
      const wrap = document.createElement("label");
      wrap.className = "opt " + (q.type === "check" ? "check" : "radio");
      const input = document.createElement("input");
      input.type = q.type === "check" ? "checkbox" : "radio";
      input.name = q.field;
      input.value = o.v; // canonical Turkish value

      const boxEl = document.createElement("span");
      boxEl.className = "box";
      const txt = document.createElement("span");
      txt.className = "txt";

      wrap.appendChild(input);
      wrap.appendChild(boxEl);
      wrap.appendChild(txt);
      opts.appendChild(wrap);
      ref.optionEls.push({ o: o, txt: txt });

      input.addEventListener("change", function () {
        if (q.type === "radio") {
          opts.querySelectorAll(".opt").forEach(function (el) { el.classList.remove("checked"); });
        }
        wrap.classList.toggle("checked", input.checked);
        updateProgress();
      });
    });
    card.appendChild(opts);
  }

  built.push(ref);
  box.appendChild(card);
});

// ---------- Apply a language ----------
function setLang(lang) {
  LANG = (lang === "en") ? "en" : "tr";
  localStorage.setItem("betul_lang", LANG);
  document.documentElement.lang = LANG;
  const dict = I18N[LANG];

  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    const key = el.getAttribute("data-i18n");
    if (dict[key] != null) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
    const key = el.getAttribute("data-i18n-html");
    if (dict[key] != null) el.innerHTML = dict[key];
  });

  // Question labels
  built.forEach(function (ref) {
    ref.qtext.textContent = ref.q.text[LANG] + (ref.q.required ? " *" : "");
    if (ref.hint) ref.hint.textContent = ref.q.hint[LANG];
    if (ref.input) ref.input.placeholder = ref.q.placeholder[LANG];
    ref.optionEls.forEach(function (oe) { oe.txt.textContent = oe.o[LANG]; });
  });

  // Toggle button active state
  document.querySelectorAll("[data-setlang]").forEach(function (b) {
    b.classList.toggle("active", b.getAttribute("data-setlang") === LANG);
  });
}

document.querySelectorAll("[data-setlang]").forEach(function (b) {
  b.addEventListener("click", function () { setLang(b.getAttribute("data-setlang")); });
});

// ---------- Progress bar ----------
const fillp = document.getElementById("fillp");
function updateProgress() {
  const fields = collectAnswers();
  let done = 0;
  QUESTIONS.forEach(function (q) { if (fields[q.field]) done++; });
  if (fillp) fillp.style.width = Math.round((done / QUESTIONS.length) * 100) + "%";
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
    errorLine.textContent = I18N[LANG]["err.missing"] + missing.q.text[LANG];
    const cards = document.querySelectorAll("#questions .q");
    if (cards[missing.i]) cards[missing.i].scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = I18N[LANG]["form.sending"];

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
      errorLine.textContent = I18N[LANG]["err.generic"];
      submitBtn.disabled = false;
      submitBtn.textContent = I18N[LANG]["form.submit"];
    });
});

// ---------- Nav: collapse into a floating capsule on scroll ----------
const navEl = document.querySelector(".nav");
if (navEl) {
  const onScroll = function () { navEl.classList.toggle("capsule", window.scrollY > 24); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ---------- Init ----------
setLang(LANG);
