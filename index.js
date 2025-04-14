module.exports = async (sock, jid) => {
    await sock.sendMessage(jid, {
        image: { url: "https://chat.openai.com/mnt/data/A_digital_illustration_features_the_name_\"Xason_Xt.png" },
        caption: `✅ Connected as *Xason XtarMD*\n\nWelcome to your personal WhatsApp bot!\nBuilt with pride by *Manasseh Amoako*.\n\n⚙️ Powered by Node.js + Baileys`
    });
};
