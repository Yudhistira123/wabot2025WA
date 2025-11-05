import { List, Buttons } from "whatsapp-web.js";

export async function sendWelcomeMenu(message, client) {
  await sendWelcomeMenu(message, client);
}

export async function sendMainMenu(message, client) {
  await sendMainMenu(message, client);
}

export async function sendServiceMenu(message, client) {
  await sendServiceMenu(message, client);
}

export async function sendEnglishMenu(message, client) {
  await sendEnglishMenu(message, client);
}

export async function sendEnglishMainMenu(message, client) {
  await sendEnglishMainMenu(message, client);
}

import { Buttons } from "whatsapp-web.js";

export async function send(message, client) {
  const buttons = new Buttons(
    "Kami berkomitmen untuk melindungi data privasi Pelanggan. Silakan periksa kebijakan privasi serta syarat dan ketentuan berlangganan di: https://hifi.ioh.co.id/privacypolicy\n\nKlik tombol berikut untuk memilih yang kamu butuhkan.\n________________________________\n*Type **English** jika ingin mengganti bahasa ke Inggris*",
    [{ body: "Pilih Menu" }],
    "Indosat Hifi Assistant 💡",
    "Pilih opsi di bawah:"
  );

  await client.sendMessage(message.from, buttons);
}

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

// Alternative method using buttons only
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
