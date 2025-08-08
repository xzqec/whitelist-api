const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const DATA_FILE = path.join(__dirname, "data.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme123"; // set this on Render

// load whitelist from file or create default
let whitelist = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    whitelist = JSON.parse(raw);
    if (!Array.isArray(whitelist)) whitelist = [];
  } else {
    whitelist = ["xzsheleper_2", "Amongman12", "IVXXJEOF", "khoidztv1234", "SpyderFaut22"];
    fs.writeFileSync(DATA_FILE, JSON.stringify(whitelist, null, 2));
  }
} catch (err) {
  console.error("Failed to read/write data file:", err);
  whitelist = ["xzsheleper_2", "Amongman12", "IVXXJEOF", "khoidztv1234", "SpyderFaut22"];
}

// helper to persist
function save() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(whitelist, null, 2));
  } catch (err) {
    console.error("Failed to save whitelist:", err);
  }
}

// API: get whitelist (no auth needed for reading)
app.get("/whitelist", (req, res) => {
  res.json(whitelist);
});

// Protected: add name
app.post("/whitelist/add", (req, res) => {
  const { password, name } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: "Unauthorized" });
  if (!name || typeof name !== "string") return res.status(400).json({ error: "Invalid name" });
  if (!whitelist.includes(name)) {
    whitelist.push(name);
    save();
  }
  res.json({ success: true, whitelist });
});

// Protected: remove name
app.post("/whitelist/remove", (req, res) => {
  const { password, name } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: "Unauthorized" });
  whitelist = whitelist.filter(n => n !== name);
  save();
  res.json({ success: true, whitelist });
});

// Protected: change admin password (optional)
app.post("/password/change", (req, res) => {
  const { password, newPassword } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: "Unauthorized" });
  // Note: this only changes password in this running instance.
  // For persistence across restarts, set ADMIN_PASSWORD env var in Render.
  process.env.ADMIN_PASSWORD = newPassword;
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Whitelist dashboard running on port ${PORT}`));