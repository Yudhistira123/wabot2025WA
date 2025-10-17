import axios from "axios";
import axiosRetry from "axios-retry";
import { toHijri } from "hijri-converter";

import fs from "fs";
import { exec } from "child_process";
import fetch from "node-fetch";

import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;
//

export function numberToArabic(text) {
  const mapping = {
    0: "٠",
    1: "١",
    2: "٢",
    3: "٣",
    4: "٤",
    5: "٥",
    6: "٦",
    7: "٧",
    8: "٨",
    9: "٩",
  };

  return text.replace(/[0-9]/g, (d) => mapping[d] || d);
}

export async function sendAyatLoop(surat, startAyat, n, chat) {
  let allArabic = "";
  let allTranslation = "";
  let header = "";
  let footer = "";
  let audioFiles = [];
  let firstAyat = null;
  let lastAyat = null;

  for (let i = 0; i < n; i++) {
    const currentAyat = parseInt(startAyat) + i;
    const result = await getSuratAyat(surat, currentAyat);

    if (result && result.data && result.data[0]) {
      const ayatData = result.data[0];

      if (firstAyat === null) firstAyat = ayatData.ayah;
      lastAyat = ayatData.ayah;

      if (!header) {
        header = `📖 *${result.info.surat.nama.id} (${result.info.surat.id})|Juz: ${ayatData.juz}*`;

        footer = `🔤 *${result.info.surat.relevasi}, ${result.info.surat.ayat_max} ayat*`;
      }

      // kumpul teks
      // allArabic += `${ayatData.arab}\n`;
      // allTranslation += `${ayatData.text}\n`;

      allArabic += `${numberToArabic(ayatData.ayah)}. ${ayatData.arab}\n`;
      // translation pakai counter 1,2,3,...
      allTranslation += `${ayatData.ayah}. ${ayatData.text}\n`;

      // download audio tiap ayat
      const res = await fetch(ayatData.audio);
      const buffer = Buffer.from(await res.arrayBuffer());
      const filePath = `/tmp/ayat_${currentAyat}.mp3`;
      fs.writeFileSync(filePath, buffer);
      audioFiles.push(filePath);
    }
  }

  // header/footer sekali saja

  header += `|Ayat ${firstAyat}–${lastAyat}`;

  if (allArabic && allTranslation) {
    const message = `
${header}

🕌 
${allArabic}

🌐
${allTranslation}

${footer}
`;

    // kirim teks
    await chat.sendMessage(message);

    // gabungkan semua audio jadi satu file
    const listFile = "/tmp/audio_list.txt";
    fs.writeFileSync(listFile, audioFiles.map((f) => `file '${f}'`).join("\n"));

    const finalAudio = "/tmp/final_audio.mp3";
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -y -f concat -safe 0 -i ${listFile} -c copy ${finalAudio}`,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // kirim audio final
    const buffer = fs.readFileSync(finalAudio);

    //

    // Convert your audio buffer to base64 if needed
    const base64Audio = buffer.toString("base64");

    // Create a MessageMedia object
    const media = new MessageMedia("audio/mpeg", base64Audio, "voice.mp3");

    // Send the audio with a caption
    await chat.sendMessage(media, {
      caption: header, // e.g. 🏃 *${clubInfo.name}*
    });

    //
    // await sock.sendMessage(from, {
    //   audio: buffer,
    //   mimetype: "audio/mpeg",
    //   caption: header,
    // });
  }
}

// konfigurasi retry
axiosRetry(axios, {
  retries: 3, // maksimal 3x coba ulang
  retryDelay: axiosRetry.exponentialDelay, // jeda antar percobaan meningkat
  retryCondition: (error) => {
    // hanya retry kalau timeout atau response 5xx
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.code === "ECONNABORTED" ||
      (error.response && error.response.status >= 500)
    );
  },
});

// const https = require("https");

// const agent = new https.Agent({ family: 4 }); // IPv4 only

const hijriMonths = [
  "Muharram",
  "Safar",
  "Rabi’ al-Awwal",
  "Rabi’ al-Thani",
  "Jumada al-Ula",
  "Jumada al-Thaniyah",
  "Rajab",
  "Sha’ban",
  "Ramadhan",
  "Shawwal",
  "Dhul Qa’dah",
  "Dhul Hijjah",
];

export async function getSholatByLocation(kodeLokasi) {
  const today = new Date();
  try {
    // const today = new Date().toISOString().split("T")[0];
    const jakarta = new Date(
      today.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    );
    const year = jakarta.getFullYear();
    const month = String(jakarta.getMonth() + 1).padStart(2, "0");
    const day = String(jakarta.getDate()).padStart(2, "0");

    const hariIni = `${year}/${month}/${day}`;
    const url = `https://api.myquran.com/v2/sholat/jadwal/${kodeLokasi}/${hariIni}`;
    // const res = await axios.get(

    // );
    const res = await axios.get(url, { timeout: 15000 });

    //======
    const correctedDate = new Date(jakarta);
    correctedDate.setDate(correctedDate.getDate() - 1 + 1);

    const hijriDate = toHijri(
      correctedDate.getFullYear(),
      correctedDate.getMonth() + 1,
      correctedDate.getDate()
    );
    const hijriString = `${hijriDate.hd} ${hijriMonths[hijriDate.hm - 1]} ${
      hijriDate.hy
    }`;

    let sholatData = res.data;
    let jadwal = sholatData.data.jadwal;
    console.log("Hijri Date:", hijriString);

    //  `🗓️ ${jadwal.tanggal} \n\n` +
    let replyMsg =
      `🕌 *Jadwal Sholat ${sholatData.data.lokasi}*\n` +
      `🗓️ ${jadwal.tanggal} \n` +
      `      ${hijriString}H \n\n` +
      `🌅 Imsak     : ${jadwal.imsak} WIB\n` +
      `🌄 Subuh     : ${jadwal.subuh} WIB\n` +
      `🌤️ Terbit    : ${jadwal.terbit} WIB\n` +
      `🌞 Dhuha     : ${jadwal.dhuha} WIB\n` +
      `☀️ Dzuhur    : ${jadwal.dzuhur} WIB\n` +
      `🌇 Ashar     : ${jadwal.ashar} WIB\n` +
      `🌆 Maghrib   : ${jadwal.maghrib} WIB\n` +
      `🌙 Isya    : ${jadwal.isya} WIB`;
    //======

    // console.log(res.data);
    return replyMsg;
  } catch (err) {
    console.error("❌ Gagal ambil jadwal sholat:", err.message);
    return null;
  }
}

export async function getKodeKota(namaKota) {
  try {
    const url = `https://api.myquran.com/v2/sholat/kota/cari/${namaKota}`;
    console.log("Mencarixx kode kota untuk:", url);
    // const res = await axios.get(
    //   `https://api.myquran.com/v2/sholat/kota/cari/${namaKota}`
    // );
    const res = await axios.get(url, { timeout: 15000 });
    console.log(res.data);
    if (res.data.status && res.data.data.length > 0) {
      return res.data.data.map((k) => k.id);
    } else {
      return [];
    }
  } catch (err) {
    console.error("❌ Gagal mengambil kode kota:", err.message);
    return [];
  }
}

// Ambil doa acak dari MyQuran API
export async function getDoaAcak() {
  try {
    const url = "https://api.myquran.com/v2/doa/acak";
    const res = await axios.get(url, { timeout: 15000 });
    return res.data.data; // ambil bagian data doa
  } catch (err) {
    console.error("❌ Error getDoaAcak:");
    console.error("Message:", err.message || "No message");
    console.error("Code:", err.code || "No code");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Response:", err.response.data);
    }
    console.error("Stack:", err.stack || "No stack");
    return null;
  }
}

// Ambil doa acak dari MyQuran API
export async function getSuratAyat(surat, ayat) {
  try {
    const url = `https://api.myquran.com/v2/quran/ayat/${surat}/${ayat}`;
    const res = await axios.get(url, { timeout: 15000 });
    // console.log(res.data);
    return res.data; // ambil bagian data doa
  } catch (err) {
    console.error("❌ Errorx getSuratAyat:", err.message);
    return null;
  }
}

export async function getNoSurat() {
  try {
    const url = `https://api.myquran.com/v2/quran/surat/semua`;
    const res = await axios.get(url, { timeout: 15000 });
    // console.log(res.data);
    return res.data; // ambil bagian data doa
  } catch (err) {
    console.error("❌ Errorx getSuratAyat:", err.message);
    return null;
  }
}

// Format pesan WhatsApp
export function formatDoa(doa) {
  if (!doa) return "⚠️ Gagal mengambil doa.";

  const header =
    "📖 QS Ghafir (40):60\n" +
    "وَقَالَ رَبُّكُمُ ٱدْعُونِيٓ أَسْتَجِبْ لَكُمْ ۚ\n" +
    "“Dan Tuhanmu berfirman: Berdoalah kepada-Ku, niscaya akan Kuperkenankan bagimu…”\n\n";
  const source = doa.source
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return (
    header +
    `📖 *${doa.judul}*\n\n` +
    `🕌 Arab:\n ${doa.arab}\n\n` +
    // `🕌 Arab:\n${emphasizeArabic(doa.arab)}\n\n` +
    `🇮🇩 Latin:\n ${doa.indo}\n\n` +
    `📩 Sumber:\n ${source}`
  );
}

export function emphasizeArabic(text) {
  const mapping = {
    ا: "ﺍ",
    أ: "ﺃ",
    إ: "ﺇ",
    آ: "ﺁ",
    ب: "ﺏ",
    ت: "ﺕ",
    ث: "ﺙ",
    ج: "ﺝ",
    ح: "ﺡ",
    خ: "ﺥ",
    د: "ﺩ",
    ذ: "ﺫ",
    ر: "ﺭ",
    ز: "ﺯ",
    س: "ﺱ",
    ش: "ﺵ",
    ص: "ﺹ",
    ض: "ﺽ",
    ط: "ﻁ",
    ظ: "ﻅ",
    ع: "ﻉ",
    غ: "ﻍ",
    ف: "ﻑ",
    ق: "ﻕ",
    ك: "ﻙ",
    ل: "ﻟ",
    م: "ﻡ",
    ن: "ﻥ",
    ه: "ﻫ",
    و: "ﻭ",
    ي: "ﻱ",
    ى: "ﻯ",
    ء: "ء", // tetap
    ؤ: "ﺅ",
    ئ: "ﺉ",
  };

  return text
    .split("")
    .map((ch) => mapping[ch] || ch)
    .join("");
}

export async function handleJadwalSholat(chat, text) {
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
}

export async function handleQuranCommand(text, chat) {
  const suratAyat = text.toLowerCase().replace("qs:", "").trim();

  if (suratAyat === "all" || suratAyat === "daftar") {
    const data = await getNoSurat();
    if (!data) {
      console.log("⚠️ Data tidak bisa diambil.");
      return;
    }

    let reply = "";
    data.data.forEach((surat, i) => {
      reply += `${i + 1}. ${surat.name_id}/${surat.revelation_id} (${
        surat.number_of_verses
      } ayat)\n`;
    });

    await chat.sendMessage(reply);
    return;
  }

  // Handle QS <nomor>/<ayat> or <nomor>/<range>
  const parts = suratAyat.split("/");
  const surat = parseInt(parts[0]);
  const ayatPart = parts[1];

  let startAyat, banyakAyat;

  if (ayatPart.includes("-")) {
    // Range ayat, contoh: "5-8"
    const range = ayatPart.split("-");
    startAyat = parseInt(range[0]);
    const endAyat = parseInt(range[1]);
    banyakAyat = endAyat - startAyat + 1;

    // Batasi maksimal 5 ayat
    if (banyakAyat > 6) banyakAyat = 5;
  } else {
    // Satu ayat
    startAyat = parseInt(ayatPart);
    banyakAyat = 1;
  }

  await sendAyatLoop(surat, startAyat, banyakAyat, chat);
}
