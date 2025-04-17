global.crypto = require("crypto");

const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

console.log("✅ Crypto module loaded!");

let qrImageURL; // To store the QR image URL

// === CONTACT SAVE HELPER ===
function saveContactToFile(name, number) {
  const filePath = path.join(__dirname, "contacts.json");
  let contacts = [];

  if (fs.existsSync(filePath)) {
    contacts = JSON.parse(fs.readFileSync(filePath));
  }

  if (!contacts.some(contact => contact.number === number)) {
    contacts.push({ name, number });
    fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
    console.log(`✅ Contact saved: ${name} (${number})`);
  }
}

async function startBot() {
  const authFolder = './auth';
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    printQRInTerminal: true,
    browser: ["Xason XtarMD", "Linux", "3.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  // === MESSAGE EVENT: Auto Save Contacts ===
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe || !msg.pushName) return;

    const number = msg.key.remoteJid;
    const name = msg.pushName;

    if (
      number.endsWith("@s.whatsapp.net") &&
      process.env.AUTO_SAVE_CONTACTS === "yes"
    ) {
      saveContactToFile(name, number.replace("@s.whatsapp.net", ""));
    }
  });

  // === CONNECTION EVENT ===
  sock.ev.on("connection.update", async (update) => {
    const { connection, pairingCode, qr } = update;

    if (pairingCode) {
      console.log(`\n===== Pairing Code Mode =====`);
      console.log(`Pairing Code: ${pairingCode}`);
    }

    if (qr) {
      qrImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`;
    }

    if (connection === "open") {
      console.log("✅ Bot connected successfully!");
    }

    if (connection === "close") {
      console.log("❌ Disconnected. Reconnecting...");
      startBot();
    }
  });
}

startBot();

module.exports = {
  getQR: () => qrImageURL
};
