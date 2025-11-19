import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js"; // Yudhistira Sulaeman
const { Client, LocalAuth } = pkg;
import { initMQTT } from "./utils/mqttServices.js";
import messageHandler from "./handlers/messageHandler.mjs";

// const client = new Client({
//   authStrategy: new LocalAuth(),
//   puppeteer: {
//     headless: true,
//     executablePath: "/usr/bin/google-chrome", // ✅ confirmed path
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-dev-shm-usage",
//       "--disable-accelerated-2d-canvas",
//       "--no-first-run",
//       "--no-zygote",
//       "--single-process",
//       "--disable-gpu",
//     ],
//   },
//   puppeteerTimeout: 60000, // ⏱️ increase timeout to 60s
// });

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    executablePath: "/usr/bin/chromium-browser",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", // uses /tmp instead of /dev/shm
      "--disable-gpu",
      "--disable-software-rasterizer", // prevents GPU crashes
      "--disable-extensions",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--remote-debugging-port=9222", // gives Puppeteer stable connection
    ],
  },
  puppeteerTimeout: 120000, // 2 minutes
});

initMQTT(client);

client.on("qr", (qr) => {
  console.log("📱 Scan QR code berikut untuk loginx:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ Client is ready!");
});

// Gunakan handler terpisah
//client.on("message", messageHandler);
client.on("message", (message) => messageHandler(client, message));

client.initialize();
