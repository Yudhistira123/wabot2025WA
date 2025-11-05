// import { List, Buttons } from "whatsapp-web.js";

import pkg from "whatsapp-web.js";
const { List } = pkg;
//import { List } from "whatsapp-web.js";

// Welcome Menu - Using regular message with instructions
export async function sendWelcomeMenu(message, client) {
  const welcomeMessage = `Indosat Hifi Assistant 💡

Kami berkomitmen untuk melindungi data privasi Pelanggan. Silakan periksa kebijakan privasi serta syarat dan ketentuan berlangganan di: https://hifi.ioh.co.id/privacypolicy

Ketik *Pilih Menu* untuk melanjutkan.
________________________________
*Ketik **English** jika ingin mengganti bahasa ke Inggris*`;

  await client.sendMessage(message.from, welcomeMessage);
}

// Main Menu (Service Selection)
export async function sendMainMenu(message, client) {
  const list = new List(
    "Klik tombol di bawah untuk memilih menu selanjutnya",
    "Pilih Menu",
    [
      {
        title: "Layanan HiFi",
        rows: [
          {
            id: "hifi",
            title: "HiFi",
            description: "Layanan HiFi utama",
          },
          {
            id: "hifi_air",
            title: "HiFi Air",
            description: "Layanan HiFi Air",
          },
        ],
      },
    ],
    "Indosat Hifi Assistant 💡"
  );

  await client.sendMessage(message.from, list);
}

// Service Menu (After selecting HiFi/HiFi Air)
export async function sendServiceMenu(message, client) {
  const list = new List(
    "Pilih jenis layanan yang Anda butuhkan:",
    "Menu Layanan",
    [
      {
        title: "Menu Utama",
        rows: [
          {
            id: "pembayaran",
            title: "Pembayaran",
            description: "Bayar tagihan dan pembayaran",
          },
          {
            id: "ubah_paket",
            title: "Ubah Paket",
            description: "Ubah paket langganan",
          },
          {
            id: "langganan_baru",
            title: "Langganan Baru",
            description: "Buat langganan baru",
          },
          {
            id: "bantuan",
            title: "Bantuan HiFi",
            description: "Bantuan dan dukungan",
          },
        ],
      },
    ],
    "Indosat Hifi Assistant 💡"
  );

  await client.sendMessage(message.from, list);
}

// English Welcome Menu
export async function sendEnglishMenu(message, client) {
  const welcomeMessage = `Indosat Hifi Assistant 💡

We are committed to protecting customer privacy data. Please check the privacy policy and subscription terms at: https://hifi.ioh.co.id/privacypolicy

Type *Select Menu* to continue.
________________________________
*Type **Indonesian** jika ingin mengganti bahasa ke Indonesia*`;

  await client.sendMessage(message.from, welcomeMessage);
}

// English Main Menu
export async function sendEnglishMainMenu(message, client) {
  const list = new List(
    "Click the button below to select the next menu",
    "Select Menu",
    [
      {
        title: "HiFi Services",
        rows: [
          {
            id: "hifi_en",
            title: "HiFi",
            description: "Main HiFi service",
          },
          {
            id: "hifi_air_en",
            title: "HiFi Air",
            description: "HiFi Air service",
          },
        ],
      },
    ],
    "Indosat Hifi Assistant 💡"
  );

  await client.sendMessage(message.from, list);
}

// English Service Menu
export async function sendEnglishServiceMenu(message, client) {
  const list = new List(
    "Select the service you need:",
    "Service Menu",
    [
      {
        title: "Main Menu",
        rows: [
          {
            id: "payment_en",
            title: "Payment",
            description: "Pay bills and payments",
          },
          {
            id: "change_package_en",
            title: "Change Package",
            description: "Change subscription package",
          },
          {
            id: "new_subscription_en",
            title: "New Subscription",
            description: "Create new subscription",
          },
          {
            id: "help_en",
            title: "HiFi Help",
            description: "Help and support",
          },
        ],
      },
    ],
    "Indosat Hifi Assistant 💡"
  );

  await client.sendMessage(message.from, list);
}

// Alternative: Simple text menu for main options
export async function sendTextMenu(message, client) {
  const menuText = `Indosat Hifi Assistant 💡
Menu Layanan:

📌 *Pembayaran* - Bayar tagihan dan pembayaran
📌 *Ubah Paket* - Ubah paket langganan  
📌 *Langganan Baru* - Buat langganan baru
📌 *Bantuan HiFi* - Bantuan dan dukungan

Ketik pilihan Anda (contoh: Pembayaran)`;

  await client.sendMessage(message.from, menuText);
}

// Alternative: English text menu
export async function sendEnglishTextMenu(message, client) {
  const menuText = `Indosat Hifi Assistant 💡
Service Menu:

📌 *Payment* - Pay bills and payments
📌 *Change Package* - Change subscription package  
📌 *New Subscription* - Create new subscription
📌 *HiFi Help* - Help and support

Type your choice (example: Payment)`;

  await client.sendMessage(message.from, menuText);
}
