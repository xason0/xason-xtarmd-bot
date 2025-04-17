module.exports = async (sock, jid) => {
    await sock.sendMessage(jid, {
        image: {
            url: 'https://chat.openai.com/mnt/data/A_digital_illustration.jpg'
        },
        caption: `✅ Connected as *Xason XtarMD*\n\nWelcome to your personal WhatsApp bot!`
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];

        if (!msg.key.fromMe && msg.pushName) {
            await sock.sendContact(
                msg.key.remoteJid,
                [msg.key.participant || msg.key.remoteJid]
            );
            console.log("Auto-saved contact:", msg.pushName);
        }
    });
};

if (require.main === module) {
    console.log("index.js ran directly");
}
