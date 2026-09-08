// Small local server so you can test the whole site on your computer.
// It serves the pages AND runs the same /api code that Vercel will run.
//
// Run it with:   node dev-server.js
// Then open:     http://localhost:3000

const http = require("http");
const fs = require("fs");
const path = require("path");

// Load settings from the .env file (token, password, etc.)
try {
  const env = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
  env.split("\n").forEach(function (line) {
    const m = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)\s*$/);
    if (m) {
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  });
} catch (e) {
  console.log("No .env file found. Copy .env.example to .env and fill it in.");
}

const submit = require("./api/submit.js");
const responses = require("./api/responses.js");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer(function (req, res) {
  const u = new URL(req.url, "http://localhost");

  if (u.pathname === "/api/submit") return submit(req, res);
  if (u.pathname === "/api/responses") return responses(req, res);

  let p = u.pathname === "/" ? "/index.html" : u.pathname;
  const file = path.join(__dirname, decodeURIComponent(p));
  if (!file.startsWith(__dirname)) {
    res.statusCode = 403;
    return res.end("Forbidden");
  }
  fs.readFile(file, function (err, data) {
    if (err) {
      res.statusCode = 404;
      return res.end("Not found");
    }
    res.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
    res.end(data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log("");
  console.log("  Betul site is running.");
  console.log("  Survey:     http://localhost:" + PORT + "/");
  console.log("  Dashboard:  http://localhost:" + PORT + "/dashboard.html");
  console.log("");
  console.log("  Press Control + C to stop.");
});
