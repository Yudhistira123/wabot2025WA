import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js"; // Yudhistira Sulaeman
const { Client, LocalAuth } = pkg;

import messageHandler from "./handlers/messageHandler.mjs";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

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
