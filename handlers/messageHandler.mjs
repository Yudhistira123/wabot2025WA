// handlers/messageHandler.mjs
import groupMessageHandler from "./groupMessageHandler.mjs";
import privateMessageHandler from "./privateMessageHandler.mjs";

export default async function messageHandler(client, message) {
  //   console.log("📩 message type ", message.type);
  console.log(`💬 Pesan dari ${message.from}: ${message.body}`);

  if (message.from.endsWith("@g.us")) {
    await groupMessageHandler(client, message);
  } else {
    await privateMessageHandler(client, message);
  }
}
