// handlers/groupMessageHandler.mjs
import { handleJadwalSholat } from "../utils/sholat.js";
import { handleHasilLari } from "../utils/stravaService.js";
import { publishMessage } from "../utils/mqttServices.js";
import { handleLocationMessage } from "../utils/attendance.js";

export default async function groupMessageHandler(client, message) {
  console.log("📢 Pesan dari grup.");
  let chat = await message.getChat();

  const text = message.body.toLowerCase();

  console.log(`👥 Grup: ${chat.name}`);
  const oriText = message.body;

  if (text.startsWith("jadwal sholat")) {
    await handleJadwalSholat(chat, text);
  } else if (text.toLowerCase() === "hasil club lari") {
    await handleHasilLari(chat, text);
  } else if (text.toLowerCase().startsWith("led:")) {
    let parts = oriText.split(":");
    let msg = parts[1]; // keep original case
    let topic = parts[2]; // keep original case
    if (topic === undefined) {
      topic = "parola/display";
    }
    publishMessage(topic, msg);
  } else if (message.type === "location") {
    let reply = await handleLocationMessage(message, client);
    await chat.sendMessage(reply);
  } else if (text.toLowerCase().startsWith("qs:")) {
    const suratAyat = text.toLowerCase().replace("qs:", "").trim();
    const parts = suratAyat.split("/");
    const surat = parseInt(parts[0]); // nomor surat
    const ayatPart = parts[1]; // bisa "5" atau "5-8"

    let startAyat, endAyat, banyakAyat;

    if (ayatPart.includes("-")) {
      // Range ayat, contoh "5-8" xxx
      const range = ayatPart.split("-");
      startAyat = parseInt(range[0]);
      endAyat = parseInt(range[1]);
      banyakAyat = endAyat - startAyat + 1;
      // 🚨 Batasi maksimal 5 ayat
      if (banyakAyat > 6) {
        banyakAyat = 5;
      }
      console.log({ startAyat, endAyat, banyakAyat });
    } else {
      // Hanya 1 ayat, contoh "5"
      startAyat = parseInt(ayatPart);
      // endAyat = startAyat;
      banyakAyat = 1;
      // endAyat = 1;
    }
    await sendAyatLoop(surat, startAyat, banyakAyat, sock, from, chat);
  } else if (text.toLowerCase().startsWith("qsall")) {
    // const data = await getNoSurat();
    // if (!data) {
    //   console.log("⚠️ Data tidak bisa diambil.");
    //   return;
    // }
    // let reply = "";
    // data.data.slice(0, data.data.length).forEach((surat, i) => {
    //   reply += `${i + 1}. ${surat.name_id}/${surat.revelation_id} (${
    //     surat.number_of_verses
    //   } ayat)\n`;
    // });
    // await sock.sendMessage(from, { text: reply });
  }
}
