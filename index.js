const express = require("express");
const app = express();
app.use(express.json());

// Starting whitelist
let whitelist = ["xzsheleper_2", "Amongman12", "IVXXJEOF", "khoidztv1234", "SpyderFaut22"];

// Get whitelist
app.get("/whitelist", (req, res) => {
    res.json(whitelist);
});

// Add to whitelist
app.post("/whitelist/add", (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });
    if (!whitelist.includes(name)) whitelist.push(name);
    res.json(whitelist);
});

// Remove from whitelist
app.post("/whitelist/remove", (req, res) => {
    const { name } = req.body;
    whitelist = whitelist.filter(n => n !== name);
    res.json(whitelist);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Whitelist API running on port ${PORT}`));