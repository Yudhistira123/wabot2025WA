import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js"; // Yudhistira Sulaeman
const { Client, LocalAuth } = pkg;
import { initMQTT } from "./utils/mqttServices.js";
import messageHandler from "./handlers/messageHandler.mjs";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  },
});

initMQTT(client);

client.on("qr", (qr) => {
  console.log("📱 Scan QR code berikut untuk login:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ Client is ready!");
});

// Gunakan handler terpisah
//client.on("message", messageHandler);
client.on("message", (message) => messageHandler(client, message));

client.initialize();
