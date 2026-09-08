// ============================================================
//  CODE TO CREATE THE AIRTABLE TABLE
// ============================================================
//  You do NOT need to run this. The table is already made.
//  Base id:  appw2YRB8ziLp5Hhs   (the "Main" base)
//  Table:    Betul Survey
//
//  Keep this only if you ever want to build the same table again.
//    1) Put your token and base id in the two lines below.
//    2) In a terminal:   node create-airtable-table.js
// ============================================================

const TOKEN = process.env.AIRTABLE_TOKEN || "paste_your_token_here";
const BASE = process.env.AIRTABLE_BASE || "appw2YRB8ziLp5Hhs";

function choices(list) {
  return { choices: list.map(function (name) { return { name: name }; }) };
}

const table = {
  name: "Betul Survey",
  description: "Feedback for the visa information directory idea (Turkish audience going abroad)",
  fields: [
    { name: "Name", type: "singleLineText" },
    { name: "Age", type: "singleSelect", options: choices(["18-24", "25-34", "35-44", "45+"]) },
    { name: "Target countries", type: "multipleSelects", options: choices([
      "Almanya", "Amerika (ABD)", "Kanada", "Avustralya", "İngiltere", "Diğer Avrupa ülkeleri", "Henüz karar vermedim"]) },
    { name: "Reason to go", type: "multipleSelects", options: choices([
      "Oturum / İkamet", "İş / Çalışma", "Eğitim / Okumak", "Vatandaşlık / Pasaport", "Turizm"]) },
    { name: "Looked for visa info before", type: "singleSelect", options: choices([
      "Evet, çok kez", "Evet, bir iki kez", "Hayır ama arayacağım", "Hayır, hiç"]) },
    { name: "Hardest part", type: "singleSelect", options: choices([
      "Kuralları anlamak zor", "Hangi vizeye başvuracağımı bilmiyorum", "Bilgiler dağınık ve güncel değil", "Dil sorunu", "Güvenilir kaynak yok"]) },
    { name: "Would the site help", type: "singleSelect", options: choices([
      "Evet, çok", "Evet, biraz", "Emin değilim", "Hayır"]) },
    { name: "Trust online info", type: "singleSelect", options: choices(["Evet", "Belki", "Hayır"]) },
    { name: "Use it if free", type: "singleSelect", options: choices(["Evet", "Belki", "Hayır"]) },
    { name: "Would pay for help", type: "singleSelect", options: choices(["Evet", "Belki", "Hayır"]) },
    { name: "When planning to go", type: "singleSelect", options: choices([
      "6 ay içinde", "1 yıl içinde", "1-2 yıl içinde", "Sadece araştırıyorum"]) },
    { name: "Would tell a friend", type: "singleSelect", options: choices(["Evet", "Belki", "Hayır"]) },
    { name: "What builds trust", type: "multipleSelects", options: choices([
      "Resmi kaynak bağlantıları", "Güncel bilgiler", "Kullanıcı yorumları", "Uzman onayı", "Başarı hikayeleri"]) },
    { name: "Overall opinion", type: "singleSelect", options: choices([
      "Harika fikir", "İyi fikir", "İdare eder", "İyi değil"]) },
    { name: "Contact", type: "singleLineText" },
    { name: "Submitted", type: "dateTime", options: {
      dateFormat: { name: "friendly" }, timeFormat: { name: "12hour" }, timeZone: "Europe/Istanbul" } }
  ]
};

async function main() {
  const url = "https://api.airtable.com/v0/meta/bases/" + BASE + "/tables";
  const r = await fetch(url, {
    method: "POST",
    headers: { "Authorization": "Bearer " + TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(table)
  });
  const data = await r.json();
  if (!r.ok) { console.error("Failed:", JSON.stringify(data, null, 2)); process.exit(1); }
  console.log("Table created. Id:", data.id);
}

main();
