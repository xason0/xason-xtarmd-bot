global.crypto = require("crypto");

const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: false,
    auth: state,
    browser: ["Samsung", "Linux", "9.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  if (!sock.authState.creds.registered) {
    const phoneNumber = "+447405817307";
    try {
      const code = await sock.requestPairingCode(phoneNumber);
      console.log("\n\n====== PAIRING CODE ======");
      console.log(code);
      console.log("==========================\n\n");
    } catch (err) {
      console.error("Failed to generate pairing code:", err);
    }
  }

  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") console.log("Bot connected!");
    else if (connection === "close") {
      console.log("Disconnected. Trying again...");
      startBot();
    }
  });
}

startBot();

