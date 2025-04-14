global.crypto = require("crypto");

const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");
const crypto = require("crypto");

console.log("✅ Crypto module loaded");

let qrImageURL; // store the QR code image URL

async function startBot() {
  const authFolder = './auth';
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    printQRInTerminal: true,
    browser: ["Xason XtarmD", "Linux", "3.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, pairingCode, qr } = update;

    if (pairingCode) {
      console.log("\n===== Pairing Code Mode =====");
    }

    if (qr) {
      qrImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`;
    }

    if (connection === "open") {
      console.log("✅ Bot connected successfully!");
    }
  });
}

startBot();

module.exports = {
  getQR: () => qrImageURL
};
