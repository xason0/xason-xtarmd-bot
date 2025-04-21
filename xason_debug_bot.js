
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');
const path = require('path');

let qrImageURL = ''; // To store QR image URL

console.log("✅ Crypto module loaded!");

async function startBot() {
    const authFolder = './auth';
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);

    const sock = makeWASocket({
        logger: P({ level: 'debug' }),
        auth: state,
        printQRInTerminal: true,
        browser: ["Xason XtarmD", "Linux", "3.0"]
    });

    sock.ev.on("creds.update", saveCreds);

    // Auto-Save Contacts
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe || !msg.pushName) return;
        const name = msg.pushName;
        const number = msg.key.remoteJid;
        if (number.endsWith("@s.whatsapp.net") && process.env.AUTO_SAVE_CONTACTS === "yes") {
            const contact = number.replace("@s.whatsapp.net", "");
            const filePath = path.join(__dirname, "contacts.json");
            let contacts = [];
            if (fs.existsSync(filePath)) {
                contacts = JSON.parse(fs.readFileSync(filePath));
            }
            if (!contacts.some(c => c.number === contact)) {
                contacts.push({ name, number: contact });
                fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
                console.log(`✅ Contact saved: ${contact}`);
            }
        }
    });

    // Debug: Log QR or Pairing Code updates
    sock.ev.on("connection.update", async (update) => {
        const { connection, pairingCode, qr } = update;

        if (pairingCode) {
            console.log(`
==========================`);
            console.log(`🟢 Pairing Code Mode`);
            console.log(`Pairing Code: ${pairingCode}`);
            console.log(`==========================
`);
        }

        if (qr) {
            qrImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qr}`;
            console.log(`
Scan the QR Code to link device
`);
        }

        if (connection === 'open') {
            console.log('✅ Bot connected successfully!');
        }

        if (connection === 'close') {
            console.log('❌ Disconnected. Reconnecting...');
            startBot();
        }
    });
}

startBot();

module.exports = {
    getQR: () => qrImageURL
};
