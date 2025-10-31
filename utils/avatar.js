import axios from "axios";

import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;

// Separate function for API call
async function sendToAPI(namaGrup, name, phone, axiosResponse) {
  try {
    const apiEndpoint = "https://drharryhuiz.my.id/rn01/insertDataMember.php";

    const base64Image = Buffer.from(axiosResponse.data, "binary").toString(
      "base64"
    );

    const requestData = {
      namaGrup: namaGrup,
      name: name,
      phone: phone,
      imageData: base64Image,
    };

    const response = await axios.post(apiEndpoint, requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_TOKEN_HERE", // if needed
      },
    });

    console.log(`✅ API success for ${name}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ API failed for ${name}:`, error.message);
    throw error;
  }
}

export async function sendAvatar(
  client,
  participant,
  toNumber,
  name,
  avatarUrl,
  namaGrup
) {
  try {
    if (!avatarUrl) {
      console.log(`⚠️ ${name} has no avatar.`);
      avatarUrl = "https://drharryhuiz.my.id/rn01/images/blankImage.jpg";
      //  return;
    }
    // 🔹 Ambil nomor WA dari JID
    let phone = participant.id._serialized.replace("@c.us", "");
    if (phone.startsWith("62")) {
      phone = "0" + phone.substring(2);
    }

    const response = await axios.get(avatarUrl, {
      responseType: "arraybuffer",
    });

    // Send to API
    await sendToAPI(namaGrup, name, phone, response);

    const media = new MessageMedia(
      "image/jpeg",
      Buffer.from(response.data, "binary").toString("base64"),
      `${name}.jpg`
    );
    await client.sendMessage(`${toNumber}@c.us`, media, {
      caption: `📸 ${name} (📞 ${phone})`,
    });
    console.log(`✅ Avatar of ${name} sent to ${toNumber}`);
  } catch (err) {
    console.error(`❌ Failed for ${name}:`, err.message);
  }
}
