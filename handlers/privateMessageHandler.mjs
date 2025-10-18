// handlers/privateMessageHandler.mjs
import axios from "axios";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;

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
    //console.log('Fetching data for noPasien:', noPasien);
    try {
      const noPasien = text.split(" ")[1].trim();
      // 🔹 Call your webservice
      let url = `https://drharryhuiz.my.id/find_ImagePasienWG.php?kode=${noPasien}`;
      console.log("Fetching data from URL:", url);
      const response = await axios.get(url);
      let base64String = response.data.gambar;
      let nama = response.data.nama;
      let dlahir = response.data.dlahir;
      let jekel = response.data.jekel;
      let alamat = response.data.alamat;
      let tlp = response.data.tlp;
      let alergi = response.data.alergi;

      let reply = `🧾 Data pasien ${noPasien}
👤 Nama: ${nama}
🚻 JK: ${jekel}
🏠 Alamat: ${alamat}
📞 Tlp: ${tlp}
🎂 Tgl Lahir: ${dlahir}
⚠️ Alergi: ${alergi}`;

      console.log("Data fetched successfully for noPasien:", reply);

      // 🔹 Clean base64 if it has prefix
      base64String = base64String.replace(/^data:image\/\w+;base64,/, "");
      const media = new MessageMedia("image/jpeg", base64String);
      await chat.sendMessage(media, undefined, {
        caption: reply,
      });
    } catch (error) {
      console.error("Error calling API:", error.message);
      await chat.sendMessage("❌ Failed to fetch data from API");
    }
  } else {
    console.log("🤖 Pesan tidak cocok dengan perintah bawaan.");
  }
}
