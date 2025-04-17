const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ Xason XtarmD Bot is running!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Start the bot
 const bot = require('./login');

app.get("/qr", (req, res) => {
    const qr = bot.getQR && bot.getQR();
    if (!qr) {
        return res.send('<h3>QR Not Ready. Please refresh in a few seconds.</h3>');
    }
    res.send(`
  <div style="text-align:center">
    <h2>Scan to Connect WhatsApp</h2>
    <img src="${qr}" />
  </div>
`);
});
