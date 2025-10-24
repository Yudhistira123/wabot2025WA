import axios from "axios";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;
import fetch from "node-fetch";
// ====================
// 🔹 Fungsi untuk ambil data pasien
// ====================
export async function handleAmbilPasien(chat, text) {
  try {
    const noPasien = text.split(" ")[1]?.trim();
    if (!noPasien) {
      await chat.sendMessage("⚠️ Format salah. Gunakan: ambil <kode_pasien>");
      return;
    }

    const url = `https://drharryhuiz.my.id/find_ImagePasienWG.php?kode=${noPasien}`;
    console.log("Fetching data from URL:", url);
    const response = await axios.get(url);

    const { gambar, nama, dlahir, jekel, alamat, tlp, alergi } = response.data;
    let reply = `🧾 Data pasien ${noPasien}
👤 Nama: ${nama}
🚻 JK: ${jekel}
🏠 Alamat: ${alamat}
📞 Tlp: ${tlp}
🎂 Tgl Lahir: ${dlahir}
⚠️ Alergi: ${alergi}`;

    let base64String = gambar.replace(/^data:image\/\w+;base64,/, "");
    const media = new MessageMedia("image/jpeg", base64String);
    await chat.sendMessage(media, { caption: reply });
  } catch (error) {
    console.error("Error calling API:", error.message);
    await chat.sendMessage("❌ Gagal mengambil data pasien dari API");
  }
}

// ====================
// 🔹 Fungsi untuk ambil data rudal (rn:)
// ====================
export async function handleRudal(chat, text) {
  const indikator = text.toLowerCase().replace("rn:", "").trim();
  console.log(`🔍 Mencari data rudal untuk: ${indikator}`);

  try {
    let url = "";
    let msg = "";
    let index = 1;

    if (indikator === "all") {
      url = `https://drharryhuiz.my.id/rn01/getMainDataRudal.php`;
      const response = await axios.get(url);

      const header =
        "🏷️ Planning Link: https://rorisjayaabadi.com/030773/planning.php\n\n";
      let msg = header; // start msg with the header
      let index = 1;

      response.data.data.forEach((item) => {
        msg += `${index}. (${item.kode_prefix}) ${item.n_judul}\n`;
        index++;
      });
      await chat.sendMessage(msg || "⚠️ Tidak ada data ditemukan.");
    } else if (indikator.includes("td")) {
      url = `https://drharryhuiz.my.id/rn01/getTDRudalByKode.php?c_kode=${indikator}`;
      const response = await axios.get(url);
      await Promise.all(
        response.data.data.map(async (item) => {
          console.log("Processing item:", item.c_kode);
          msg = `*${item.n_title}*\n\n${item.n_desc
            .trim()
            .replace(/\n/g, " ")}\n\n`;

          const c_kode = item.c_kode.trim();
          const code = c_kode.substring(2, c_kode.length - 4);
          let imageUrl = `https://drharryhuiz.my.id/rn01/images/${code}.jpg`;

          let res = await fetch(imageUrl);
          // If image not found (404 or other)
          if (!res.ok) {
            console.warn(
              `⚠️ Image not found for ${code}, using blankImage.jpg`
            );
            imageUrl = "https://drharryhuiz.my.id/rn01/images/blankImage.jpg";
            res = await fetch(imageUrl);
          }

          const buffer = Buffer.from(await res.arrayBuffer());
          const base64 = Buffer.from(buffer).toString("base64");
          const media = new MessageMedia("image/jpeg", base64);
          await chat.sendMessage(media, {
            caption: `${msg}`,
          });
          index++;
        })
      );
    } else {
      url = `https://drharryhuiz.my.id/rn01/getDataRudalByKode.php?c_kode=${indikator}`;
      const response = await axios.get(url);

      response.data.data.forEach((item) => {
        msg += `${index}. (${item.c_kode}):${item.c_revisi}:${
          item.d_appedm
        }\n*${item.n_judul.trim().replace(/\n/g, " ")}*\n\n`;
        index++;
      });
      await chat.sendMessage(msg || "⚠️ Tidak ada data ditemukan.");
    }
  } catch (error) {
    console.error("Error calling API:", error.message);
    await chat.sendMessage("❌ Gagal mengambil data rudal dari API");
  }
}
