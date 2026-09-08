// Saves one survey answer into Airtable.
// The secret token stays here on the server. It never reaches the browser.

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method not allowed");
    return;
  }

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE = process.env.AIRTABLE_BASE || "appw2YRB8ziLp5Hhs";
  const TABLE = process.env.AIRTABLE_TABLE || "Betul Survey";

  if (!TOKEN) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Server not set up yet. Missing AIRTABLE_TOKEN." }));
    return;
  }

  try {
    const body = await readBody(req);
    const fields = (body && body.fields) || {};
    fields["Submitted"] = new Date().toISOString();

    const url = "https://api.airtable.com/v0/" + BASE + "/" + encodeURIComponent(TABLE);
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fields: fields, typecast: true })
    });

    const text = await r.text();
    res.statusCode = r.status;
    res.setHeader("Content-Type", "application/json");
    res.end(text);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: String(e) }));
  }
};

// Reads the JSON body in a way that works both on Vercel and in local dev.
async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}
