// handlers/privateMessageHandler.mjs

import { handleAmbilPasien, handleRudal } from "../utils/campur.js";
import {
  sendWelcomeMenu,
  sendMainMenu,
  sendServiceMenu,
  sendEnglishMenu,
  sendEnglishMainMenu,
} from "../utils/menuHandler.js";

// Menu options configuration
const menuOptions = {
  pembayaran: "Anda memilih menu Pembayaran. Fitur ini sedang dikembangkan.",
  "ubah paket": "Anda memilih menu Ubah Paket. Fitur ini sedang dikembangkan.",
  "langganan baru":
    "Anda memilih menu Langganan Baru. Fitur ini sedang dikembangkan.",
  "bantuan hifi":
    "Anda memilih menu Bantuan HiFi. Fitur ini sedang dikembangkan.",
  payment: "You selected Payment menu. This feature is under development.",
  "change package":
    "You selected Change Package menu. This feature is under development.",
  "new subscription":
    "You selected New Subscription menu. This feature is under development.",
  "hifi help":
    "You selected HiFi Help menu. This feature is under development.",
};

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
  //====

  //const text = message.body.toLowerCase().trim();

  // Handle initial greetings
  if (text === "hi" || text === "hello" || text === "halo") {
    await sendWelcomeMenu(message, client);
    return;
  }

  // Handle menu selections
  if (text === "pilih menu" || text === "menu") {
    await sendMainMenu(message, client);
    return;
  }

  // Handle language change
  if (text === "english") {
    await sendEnglishMenu(message, client);
    return;
  }

  // Handle specific menu options
  if (text === "select menu") {
    await sendEnglishMainMenu(message, client);
    return;
  }

  // Handle service selections
  if (text === "hifi" || text === "hifi_air") {
    await sendServiceMenu(message, client);
    return;
  }

  // Handle main menu options
  if (menuOptions[text]) {
    await message.reply(menuOptions[text]);
    return;
  }

  //
}
