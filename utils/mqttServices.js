import mqtt from "mqtt";

const mqttBroker = "mqtt://103.27.206.14:1883";
const mqttTopics = ["R1.JC.05", "R1.JC.06", "test/php"];

let mqttClient; // keep global ref so we can publish outside init

export function initMQTT(client) {
  mqttClient = mqtt.connect(mqttBroker);
  mqttClient.on("connect", () => {
    console.log("✅ Connected to MQTT broker");
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

  let text = `📌 Update Alat
Nama: ${payload.name}
No HP: ${payload.no_hp}
Alat: ${payload.nama_alat}
Status: ${payload.status}
Tanggal: ${payload.tanggal}`;
  console.log("Generated message:", text);

  text = "hello world";
  const jids = ["628122132341@c.us"];

  for (const jid of jids) {
    try {
      await client.sendMessage(jid, text);
      console.log(`✅ Sent to ${jid}`);
    } catch (err) {
      console.error(`❌ Failed to send to ${jid}:`, err);
    }
  }
}
