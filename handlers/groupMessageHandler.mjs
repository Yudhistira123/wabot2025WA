// handlers/groupMessageHandler.mjs
import { getSholatByLocation, getKodeKota } from "../utils/sholat.js";

export default async function groupMessageHandler(client, message) {
  console.log("📢 Pesan dari grup.");
  const chat = await message.getChat();
  const text = message.body.toLowerCase();

  console.log(`👥 Grup: ${chat.name}`);

  if (text.startsWith("jadwal sholat")) {
    const namaKota = text.replace("jadwal sholat", "").trim();
    if (!namaKota) {
      await chat.sendMessage(
        "⚠️ Tolong sebutkan nama kota. Contoh: *jadwal sholat bandung*"
      );
      return;
    }

    console.log(`🔍 Mencari kode kota untuk: ${namaKota}`);
    const idKotaArray = await getKodeKota(namaKota);

    if (idKotaArray.length === 0) {
      await chat.sendMessage(
        `⚠️ Tidak ditemukan kota dengan nama *${namaKota}*.`
      );
      return;
    }

    for (const idKota of idKotaArray) {
      const replyMsg = await getSholatByLocation(idKota);
      await chat.sendMessage(replyMsg);
    }
  } else {
    console.log(
      "ℹ️ Pesan dari grup tidak diproses karena tidak sesuai perintah."
    );
  }
}
