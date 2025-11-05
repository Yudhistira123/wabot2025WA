import { List, Buttons } from "whatsapp-web.js";

// Welcome Menu
export async function sendWelcomeMenu(message, client) {
  const buttons = new Buttons(
    "Kami berkomitmen untuk melindungi data privasi Pelanggan. Silakan periksa kebijakan privasi serta syarat dan ketentuan berlangganan di: https://hifi.ioh.co.id/privacypolicy\n\nKlik tombol berikut untuk memilih yang kamu butuhkan.\n________________________________\n*Type **English** jika ingin mengganti bahasa ke Inggris*",
    [{ body: "Pilih Menu" }],
    "Indosat Hifi Assistant 💡",
    "Pilih opsi di bawah:"
  );

  await client.sendMessage(message.from, buttons);
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
  const buttons = new Buttons(
    "We are committed to protecting customer privacy data. Please check the privacy policy and subscription terms at: https://hifi.ioh.co.id/privacypolicy\n\nClick the button below to select what you need.\n________________________________\n*Type **Indonesian** jika ingin mengganti bahasa ke Indonesia*",
    [{ body: "Select Menu" }],
    "Indosat Hifi Assistant 💡",
    "Choose option below:"
  );

  await client.sendMessage(message.from, buttons);
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

// Alternative method using buttons only (Indonesian)
export async function sendMainButtons(message, client) {
  const buttons = new Buttons(
    "Pilih menu yang Anda butuhkan:",
    [
      { body: "💳 Pembayaran" },
      { body: "🔄 Ubah Paket" },
      { body: "🆕 Langganan Baru" },
      { body: "❓ Bantuan HiFi" },
    ],
    "Indosat Hifi Assistant 💡",
    "Menu Layanan"
  );

  await client.sendMessage(message.from, buttons);
}

// Alternative method using buttons only (English)
export async function sendEnglishButtons(message, client) {
  const buttons = new Buttons(
    "Select the menu you need:",
    [
      { body: "💳 Payment" },
      { body: "🔄 Change Package" },
      { body: "🆕 New Subscription" },
      { body: "❓ HiFi Help" },
    ],
    "Indosat Hifi Assistant 💡",
    "Service Menu"
  );

  await client.sendMessage(message.from, buttons);
}
