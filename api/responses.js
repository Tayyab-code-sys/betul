// Sends all survey answers to the dashboard.
// It first checks the dashboard password, so only the owner can read the data.

module.exports = async function (req, res) {
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE = process.env.AIRTABLE_BASE || "appw2YRB8ziLp5Hhs";
  const TABLE = process.env.AIRTABLE_TABLE || "Betul Survey";
  const PW = process.env.DASH_PASSWORD || "betul2026";

  const given = req.headers["x-dash-password"] || "";
  if (given !== PW) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Wrong password" }));
    return;
  }

  if (!TOKEN) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Server not set up yet. Missing AIRTABLE_TOKEN." }));
    return;
  }

  try {
    let records = [];
    let offset = null;
    do {
      let url = "https://api.airtable.com/v0/" + BASE + "/" + encodeURIComponent(TABLE) + "?pageSize=100";
      if (offset) url += "&offset=" + encodeURIComponent(offset);
      const r = await fetch(url, { headers: { "Authorization": "Bearer " + TOKEN } });
      if (!r.ok) {
        const t = await r.text();
        res.statusCode = r.status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: t }));
        return;
      }
      const data = await r.json();
      records = records.concat(data.records || []);
      offset = data.offset;
    } while (offset);

    // Newest first, by the Submitted time.
    records.sort(function (a, b) {
      const av = (a.fields && a.fields.Submitted) || "";
      const bv = (b.fields && b.fields.Submitted) || "";
      return av < bv ? 1 : av > bv ? -1 : 0;
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ records: records }));
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: String(e) }));
  }
};
