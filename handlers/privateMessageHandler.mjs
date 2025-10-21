// handlers/privateMessageHandler.mjs

import { handleAmbilPasien, handleRudal } from "../utils/campur.js";

export default async function privateMessageHandler(client, message) {
  console.log("👤 Pesan dari individu diproses.");
  const text = message.body.toLowerCase();
  let chat = await message.getChat();

  if (text === "hello") {
    await message.reply("👋 Hai juga! Ini bot WhatsApp otomatis loh");
  } else if (text === "ping") {
    await message.reply("🏓 Pong!");
  } else if (text.includes("time")) {
    const now = new Date().toLocaleString("id-ID");
    await message.reply(`🕒 Sekarang jam: ${now}`);
  } else if (text.startsWith("ambil ")) {
    await handleAmbilPasien(chat, text);
  } else if (text.toLowerCase().startsWith("rn:")) {
    await handleRudal(chat, text);
  }
}
