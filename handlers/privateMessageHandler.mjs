// handlers/privateMessageHandler.mjs

import { handleAmbilPasien, handleRudal } from "../utils/campur.js";
import {
  sendWelcomeMenu,
  sendMainMenu,
  sendServiceMenu,
  sendEnglishMenu,
  sendEnglishMainMenu,
  sendEnglishServiceMenu,
  sendSimpleResponse,
} from "./menuHandler.js";

// Menu options configuration with better matching
const menuOptions = {
  // Indonesian numeric options
  1: "pembayaran",
  2: "ubah paket",
  3: "langganan baru",
  4: "bantuan hifi",

  // Indonesian text options
  pembayaran:
    "Anda memilih menu Pembayaran. 🏦\nFitur ini sedang dikembangkan. Silakan hubungi customer service untuk pembayaran.",
  "ubah paket":
    "Anda memilih menu Ubah Paket. 🔄\nFitur ini sedang dikembangkan. Silakan hubungi customer service untuk mengubah paket.",
  "langganan baru":
    "Anda memilih menu Langganan Baru. 🆕\nFitur ini sedang dikembangkan. Silakan hubungi customer service untuk langganan baru.",
  "bantuan hifi":
    "Anda memilih menu Bantuan HiFi. ❓\nFitur ini sedang dikembangkan. Silakan hubungi customer service untuk bantuan.",

  // Service selections
  hifi: "service_menu",
  "hifi air": "service_menu",

  // English numeric options
  payment:
    "You selected Payment menu. 🏦\nThis feature is under development. Please contact customer service for payments.",
  "change package":
    "You selected Change Package menu. 🔄\nThis feature is under development. Please contact customer service to change package.",
  "new subscription":
    "You selected New Subscription menu. 🆕\nThis feature is under development. Please contact customer service for new subscription.",
  "hifi help":
    "You selected HiFi Help menu. ❓\nThis feature is under development. Please contact customer service for help.",

  // English service selections
  hifi_en: "english_service_menu",
  "hifi air_en": "english_service_menu",
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

  // Handle initial greetings
  if (
    text === "hi" ||
    text === "hello" ||
    text === "halo" ||
    text === "hai" ||
    text === "hey"
  ) {
    await sendWelcomeMenu(message, client);
    return;
  }

  // Handle menu selections
  if (text === "pilih menu" || text === "menu") {
    await sendMainMenu(message, client);
    return;
  }

  // Handle language change
  if (text === "english" || text === "inggris") {
    await sendEnglishMenu(message, client);
    return;
  }

  // Handle Indonesian language switch
  if (text === "indonesian" || text === "indonesia" || text === "indonesia") {
    await sendWelcomeMenu(message, client);
    return;
  }

  // Handle specific menu options
  if (text === "select menu") {
    await sendEnglishMainMenu(message, client);
    return;
  }

  // Handle numeric inputs for quick selection
  if (menuOptions[text] && ["1", "2", "3", "4"].includes(text)) {
    const actualOption = menuOptions[text];
    await sendSimpleResponse(message, client, menuOptions[actualOption]);
    return;
  }

  // Handle service selections
  if (text === "hifi" || text === "hifi air") {
    await sendServiceMenu(message, client);
    return;
  }

  // Handle English service selections
  if (text === "hifi_en" || text === "hifi air_en") {
    await sendEnglishServiceMenu(message, client);
    return;
  }

  // Handle main menu options
  if (menuOptions[text]) {
    if (menuOptions[text] === "service_menu") {
      await sendServiceMenu(message, client);
    } else if (menuOptions[text] === "english_service_menu") {
      await sendEnglishServiceMenu(message, client);
    } else {
      await sendSimpleResponse(message, client, menuOptions[text]);
    }
    return;
  }

  // If no command matched, show welcome with suggestion
  if (!menuOptions[text] && text.length > 1) {
    const helpMessage = `Indosat Hifi Assistant 💡

Saya tidak mengerti permintaan "${message.body}".

Silakan ketik:
• *Menu* - untuk melihat menu utama
• *English* - untuk bahasa Inggris
• *HiFi* - untuk layanan HiFi

Atau hubungi customer service untuk bantuan lebih lanjut.`;

    await sendSimpleResponse(message, client, helpMessage);
    return;
  }

  // For very short or unrecognized messages, show welcome
  if (text.length <= 1) {
    await sendWelcomeMenu(message, client);
  }

  //
}
