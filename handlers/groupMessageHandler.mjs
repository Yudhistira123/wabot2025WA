// handlers/groupMessageHandler.mjs
import { handleJadwalSholat, handleQuranCommand } from "../utils/sholat.js";
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
    await handleQuranCommand(oriText, chat);
  } else if (text.toLowerCase().startsWith("rn:")) {
    const indikator = text.toLowerCase().replace("rn:", "").trim();
    console.log(`🔍 Mencari data rudal untuk: ${indikator}`);
    if (indikator == "all") {
      let url = `https://drharryhuiz.my.id/rn01/getMainDataRudal.php`;
      //   console.log("Fetching data from URL:", url);
      const response = await axios.get(url);
      // let kode = response.data.kode_prefix;
      // let judul = response.data.n_judul;
      let msg = "";
      let index = 1;
      response.data.data.forEach((item) => {
        msg += index + ". (" + item.kode_prefix + ") " + item.n_judul + "\n";
        index++;
      });
      await chat.sendMessage(msg);
    } else if (indikator.includes("td")) {
      let url = `https://drharryhuiz.my.id/rn01/getTDRudalByKode.php?c_kode=${indikator}`;
      console.log("Fetching data from URL:", url);
      const response = await axios.get(url);
      // let kode = response.data.kode_prefix;
      // let judul = response.data.n_judul;
      let msg = "";
      let index = 1;
      response.data.data.forEach((item) => {
        msg +=
          "(" +
          item.c_kode +
          ")\n" +
          item.n_desc.trim().replace(/\n/g, " ") +
          "*\n\n";
        index++;
      });
      await chat.sendMessage(msg);
    } else {
      let url = `https://drharryhuiz.my.id/rn01/getDataRudalByKode.php?c_kode=${indikator}`;
      //   console.log("Fetching data from URL:", url);
      const response = await axios.get(url);
      // let kode = response.data.kode_prefix;
      // let judul = response.data.n_judul;
      let msg = "";
      let index = 1;
      response.data.data.forEach((item) => {
        msg +=
          index +
          ". (" +
          item.c_kode +
          "):" +
          item.c_revisi +
          ":" +
          item.d_appedm +
          "\n*" +
          item.n_judul.trim().replace(/\n/g, " ") +
          "*\n\n";
        index++;
      });
      await chat.sendMessage(msg);
    }
  }
}
