// ============================================================
//  CODE TO CREATE THE AIRTABLE TABLE
// ============================================================
//  You do NOT need to run this. The table is already made.
//  Base id:  appw2YRB8ziLp5Hhs   (the "Main" base)
//  Table:    Betul Survey   (answers are stored in English)
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
  description: "Feedback for the visa information directory idea. Answers stored in English.",
  fields: [
    { name: "Name", type: "singleLineText" },
    { name: "Age", type: "singleSelect", options: choices(["18-24", "25-34", "35-44", "45+"]) },
    { name: "Target countries", type: "multipleSelects", options: choices([
      "Germany", "USA", "Canada", "Australia", "UK", "Other European countries", "Not decided yet"]) },
    { name: "Reason to go", type: "multipleSelects", options: choices([
      "Residence", "Work", "Study", "Citizenship / Passport", "Tourism"]) },
    { name: "Looked for visa info before", type: "singleSelect", options: choices([
      "Yes, many times", "Yes, once or twice", "No, but I will", "No, never"]) },
    { name: "Hardest part", type: "singleSelect", options: choices([
      "Rules are hard to understand", "I don't know which visa to apply for", "Info is scattered and outdated", "Language problem", "No trusted source"]) },
    { name: "Would the site help", type: "singleSelect", options: choices([
      "Yes, a lot", "Yes, a little", "Not sure", "No"]) },
    { name: "Trust online info", type: "singleSelect", options: choices(["Yes", "Maybe", "No"]) },
    { name: "Use it if free", type: "singleSelect", options: choices(["Yes", "Maybe", "No"]) },
    { name: "Would pay for help", type: "singleSelect", options: choices(["Yes", "Maybe", "No"]) },
    { name: "When planning to go", type: "singleSelect", options: choices([
      "Within 6 months", "Within a year", "In 1-2 years", "Just researching"]) },
    { name: "Would tell a friend", type: "singleSelect", options: choices(["Yes", "Maybe", "No"]) },
    { name: "What builds trust", type: "multipleSelects", options: choices([
      "Links to official sources", "Up-to-date information", "User reviews", "Expert approval", "Success stories"]) },
    { name: "Overall opinion", type: "singleSelect", options: choices([
      "Great idea", "Good idea", "Okay idea", "Not a good idea"]) },
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
