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
    await handleQuranCommand(chat, text);
  }
}
