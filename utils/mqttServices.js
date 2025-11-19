import mqtt from "mqtt";

const mqttBroker = "mqtt://154.19.37.27:1883";
//const mqttTopics = ["R1.JC.05", "R1.JC.06", "test/php"];
const mqttTopics = ["test/php"]; //

let mqttClient; // keep global ref so we can publish outside init

export function initMQTT(client) {
  //mqttClient = mqtt.connect(mqttBroker);
  mqttClient = mqtt.connect(mqttBroker, {
    username: "yudhi",  // ganti dengan username MQTT kamu
    password: "yudhi123",  // ganti dengan password MQTT kamu
  });
  mqttClient.on("connect", () => {
    console.log("✅ Connected to MQTT brokerYudhi");
    mqttClient.subscribe(mqttTopics, (err) => {
      if (!err) {
        console.log(`📡 Subscribed to topics: ${mqttTopics.join(", ")}`);
      } else {
        console.error("❌ MQTT subscribe error:", err);
      }
    });
  });

  mqttClient.on("message", (topic, message) => {
    console.log(`📩 MQTT message from [${topic}]: ${message.toString()}`);
    sendMessages(client, topic, message);
  });
}

export function publishMessage(topic, msg) {
  if (mqttClient && mqttClient.connected) {
    mqttClient.publish(topic, msg);
    if (topic === "parola/display") {
      mqttClient.publish("home/tts", msg);
    }

    console.log(`📤 MQTT published to [${topic}]: ${msg}`);
  } else {
    console.error("❌ MQTT not connected, cannot publish");
  }
}

export async function sendMessages(client, topic, message) {
  // const text = `Lampu ${topic} : ${message.toString()}`;
  // //const jids = ["628122132341@c.us", "6285183819833@c.us"]; // your WA targets
  // const jids = [
  //   "628122132341@c.us",
  //   // "6285183819833@c.us",
  //   // "6285220757725@c.us",
  //   // "628122233610@c.us",
  //   // "6285975386345@c.us",
  //   // "628121462983@c.us",
  // ];
  // for (const jid of jids) {
  //   try {
  //     await client.sendMessage(jid, { text }); // <-- FIX: must be { text: "..." }

  //     // await client.sendMessage(
  //     //   number,
  //     //   ` Lampu ${topic} : ${message.toString()}`
  //     // );
  //     console.log(`✅ Sent to ${jid}: ${text}`);
  //     //   console.log(`✅ Message sent to ${number}`);
  //   } catch (err) {
  //     console.error(`❌ Failed to send to :`, err);
  //   }
  // }

  // Assuming `message` is Buffer from MQTT
  const payload = JSON.parse(message.toString());

  const [date, time] = payload.tanggal.split("T");

  let text =
    `📌 *Update Alat*\n` +
    `📅 ${date} ⏰ ${time}\n\n` + // show date and time separately
    "```" + // start monospace block
    `👤 Nama    : ${payload.name}\n` +
    `📞 No HP   : ${payload.no_hp}\n` +
    `🔧 Alat    : ${payload.nama_alat}\n` +
    `⚙️ Status  : ${payload.status}\n` +
    `🗓️ Tanggal : ${date} ⏰ ${time}` +
    "```"; // end monospace block

  console.log("Generated message:", text);

  let formattedNumber = payload.no_hp;
  if (formattedNumber.startsWith("0")) {
    formattedNumber = "62" + formattedNumber.slice(1);
  }

  //text = "hello world";
  //const jids = ["628122132341@c.us"];
  // Build jids array dynamically
  const jids = [`${formattedNumber}@c.us`];

  for (const jid of jids) {
    try {
      await client.sendMessage(jid, text);
      console.log(`✅ Sent to ${jid}`);
    } catch (err) {
      console.error(`❌ Failed to send to ${jid}:`, err);
    }
  }
}
