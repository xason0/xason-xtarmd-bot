const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const qrcode = require('qrcode');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/pair', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Missing phone number' });
  }

  try {
    // Ensure auth directory exists
    const fs = require('fs');
    const path = `./auth/${phoneNumber}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(path);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
    });

    sock.ev.on('creds.update', saveCreds);

    const code = await sock.requestPairingCode(phoneNumber);
    console.log(`Pairing code for ${phoneNumber}: ${code}`);

    return res.json({ pairingCode: code });
  } catch (err) {
    console.error('Error generating pairing code:', err);
    return res.status(500).json({ error: 'Failed to generate pairing code' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
