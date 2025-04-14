global.crypto = require("crypto");
const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys");

const P = require("pino");
const crypto = require("crypto"); // <-- Make sure this is at the top

console.log("✅ Crypto module loaded");

async function startBot() {
  const authFolder = './auth';
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    printQRInTerminal: true,
    browser: ["Xason XtarmD", "Linux", "3.0"]
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, pairingCode } = update;

    if (pairingCode) {
      console.log("\n===== Pairing Code Mode =====");
      console.log(`🔑 Code: ${pairingCode}`);
      console.log("================================\n");
    }

    if (connection === "open") {
      console.log("✅ Successfully connected to WhatsApp!");
    }

    if (connection || pairingCode) {
      console.log("Debug update object:", update);
    }
  });

  sock.ev.on("creds.update", saveCreds);

  console.log("🚀 Launching Xason XtarmD Bot...");
}

startBot();
