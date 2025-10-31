// handlers/groupMessageHandler.mjs
import { handleJadwalSholat, handleQuranCommand } from "../utils/sholat.js";
import { handleHasilLari } from "../utils/stravaService.js";
import { publishMessage } from "../utils/mqttServices.js";
import { handleLocationMessage } from "../utils/attendance.js";
import { handleVoiceMessage } from "../utils/handleVoiceMessage.js";

export default async function groupMessageHandler(client, message) {
  console.log("📢 Pesan dari grup.");
  let chat = await message.getChat();
  const text = message.body.toLowerCase();
  console.log(`👥 Grup: ${chat.name}`);
  const oriText = message.body;

  if (
    (message.hasMedia && message.type === "audio") ||
    message.type === "ptt"
  ) {
    await handleVoiceMessage(chat, message);
    return; // exit after handling voice
  }

  if (text.startsWith("jadwal sholat")) {
    await handleJadwalSholat(chat, text);
  } else if (text.toLowerCase() === "hasil club lari") {
    await handleHasilLari(chat, text);
  } else if (
    text.toLowerCase().startsWith("led:") ||
    text.toLowerCase().startsWith("pju:")
  ) {
    let parts = oriText.split(":");
    let msg = parts[1]; // keep original case
    let topic = parts[2]; // keep original case
    let isi = parts[3]; // keep original case
    console.log(`Parsed - msg: ${msg}, topic: ${topic}, isi: ${isi}`);
    if (isi === undefined) {
      isi = "0";
    }

    if (topic === undefined) {
      topic = "parola/display";
    }

    if (msg === "5") {
      msg = topic + ":" + isi;
      topic = "PJU/R1.JC.05";
    } else if (msg === "6") {
      msg = topic + ":" + isi;
      topic = "PJU/R1.JC.06";
    }
    console.log(`🔆 MQTT Topic: ${topic}, Message: ${msg}`);
    publishMessage(topic, msg);
  } else if (message.type === "location") {
    let reply = await handleLocationMessage(message, client);
    await chat.sendMessage(reply);
  } else if (text.toLowerCase().startsWith("qs:")) {
    await handleQuranCommand(oriText, chat);
  } else if (text.toLowerCase().startsWith("sg4")) {
    // Change to your admin number
    const adminNumber = "628122132341";
    for (const participant of chat.participants) {
      const contact = await client.getContactById(participant.id._serialized);
      const name = contact.pushname || contact.number;
      const avatarUrl = await contact.getProfilePicUrl();
      await sendAvatar(client, participant, adminNumber, name, avatarUrl);
      //   await message.reply("✅ All avatars are being sent to admin.");
    }
  }
}
