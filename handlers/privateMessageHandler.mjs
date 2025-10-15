// handlers/privateMessageHandler.mjs
export default async function privateMessageHandler(client, message) {
  console.log("👤 Pesan dari individu diproses.");
  const text = message.body.toLowerCase();

  if (text === "hello") {
    await message.reply("👋 Hai juga! Ini bot WhatsApp otomatis loh");
  } else if (text === "ping") {
    await message.reply("🏓 Pong!");
  } else if (text.includes("time")) {
    const now = new Date().toLocaleString("id-ID");
    await message.reply(`🕒 Sekarang jam: ${now}`);
  } else {
    console.log("🤖 Pesan tidak cocok dengan perintah bawaan.");
  }
}
