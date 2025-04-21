const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
  default: France_King,
  useMultiFileAuthState,
  delay,
  makeCacheableSignalKeyStore,
  Browsers
} = require("maher-zubair-baileys");

function removeFile(FilePath) {
  if (!fs.existsSync(FilePath)) return false;
  fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/pairing-code', async (req, res) => {
  const id = makeid();
  let num = req.query.number;

  async function FLASH_MD_PAIR_CODE() {
    const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
    try {
      let PairingInstance = France_King({
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        printQRInTerminal: false,
        logger: pino({ level: "fatal" }).child({ level: "fatal" }),
        browser: ["Chrome (Linux)", "", ""]
      });

      if (!PairingInstance.authState.creds.registered) {
        await delay(1500);
        num = num.replace(/[^0-9]/g, '');
        const code = await PairingInstance.requestPairingCode(num);
        if (!res.headersSent) {
          return res.json({ code });
        }
      }

      PairingInstance.ev.on('creds.update', saveCreds);
      PairingInstance.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect } = s;
        if (connection == "open") {
          await delay(5000);
          let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
          await delay(800);
          let b64data = Buffer.from(data).toString('base64');
          let session = await PairingInstance.sendMessage(PairingInstance.user.id, { text: '' + b64data });

          let message = `
*XASON-XTARMD SESSION CONNECTED*`;

          await PairingInstance.sendMessage(PairingInstance.user.id, { text: message }, { quoted: session });
          await delay(100);
          await PairingInstance.ws.close();
          return await removeFile('./temp/' + id);
        } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
          await delay(10000);
          FLASH_MD_PAIR_CODE();
        }
      });
    } catch (err) {
      console.log("Service restarted due to error.");
      await removeFile('./temp/' + id);
      if (!res.headersSent) {
        return res.json({ code: "Service is Currently Unavailable" });
      }
    }
  }

  return await FLASH_MD_PAIR_CODE();
});

module.exports = router;
