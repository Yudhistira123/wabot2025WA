// const axios = require("axios");
import axios from "axios";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;
import fetch from "node-fetch";

// Strava API Credentials
const CLIENT_ID = "54707";
const CLIENT_SECRET = "24def89a80ad1fe7586f0303af693787576075b3";
const REFRESH_TOKEN = "729818486aef1199b8a0e2ffb481e6f8c7f72e47";

let accessToken = "";

// --- Function: Refresh Token Strava ---
export async function getAccessToken() {
  try {
    const res = await axios.post("https://www.strava.com/oauth/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token",
    });
    accessToken = res.data.access_token;
    console.log("✅ Access Token diperbarui");
  } catch (err) {
    console.error("❌ Error refresh token:", err.message);
  }
}

export async function getClubInfo(CLUB_ID) {
  try {
    if (!accessToken) await getAccessToken();

    const res = await axios.get(
      `https://www.strava.com/api/v3/clubs/${CLUB_ID}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    console.log("📊 Club Info:", JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (err) {
    console.error("❌ Error getClubInfo:", err.message);
    return null;
  }
}

// --- Function: Get Club Activities ---
export async function getClubActivities(CLUB_ID) {
  try {
    if (!accessToken) await getAccessToken();

    //const clubInfo = await getClubInfo(CLUB_ID);
    const res = await axios.get(
      `https://www.strava.com/api/v3/clubs/${CLUB_ID}/activities`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { per_page: 20 }, // ambil 5 aktivitas terbaru
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error getClubActivities:", err.message);
    return "Gagal ambil data Club Strava.";
  }
}

export async function handleHasilLari(chat, text) {
  const CLUB_ID = "728531"; // ID Club Laris
  const clubInfo = await getClubInfo(CLUB_ID);
  const activities = await getClubActivities(CLUB_ID);
  if (!clubInfo) {
    await chat.sendMessage("❌ Gagal ambil info club.");
    return;
  }
  if (clubInfo.cover_photo_small) {
    try {
      const res = await fetch(clubInfo.cover_photo_small);
      //const buffer = await res.arrayBuffer();
      const buffer = Buffer.from(await res.arrayBuffer());

      // Convert to base64
      const base64 = Buffer.from(buffer).toString("base64");

      // Create WhatsApp media object
      const media = new MessageMedia("image/jpeg", base64);

      // Send image with caption xxxx

      await chat.sendMessage(media, undefined, {
        caption: `🏃 *${clubInfo.name}*`,
      });

      // await sock.sendMessage(from, {
      //   image: buffer,
      //   caption: `🏃 *${clubInfo.name}*`,
      // });
    } catch (err) {
      console.error("❌ Error sending cover photo:", err.message);
    }
  }

  // Build text reply
  let reply =
    `🌍 Lokasi: ${clubInfo.city}, ${clubInfo.state}, ${clubInfo.country}\n` +
    `👥 Member: ${clubInfo.member_count}\n\n` +
    `ℹ️ ${clubInfo.description || "No description"}\n\n` +
    `=== 20 Aktivitas Terbaru ===\n\n`;

  activities.forEach((act, i) => {
    const distanceKm = act.distance / 1000;
    const movingMinutes = (act.moving_time / 60).toFixed(0);

    // pace in seconds/km
    const paceSecPerKm = act.moving_time / distanceKm;
    const paceMin = Math.floor(paceSecPerKm / 60);
    const paceSec = Math.round(paceSecPerKm % 60);
    const paceFormatted = `${paceMin}:${paceSec
      .toString()
      .padStart(2, "0")} /km`;
    reply +=
      `${i + 1}. ${act.athlete.firstname} ${act.athlete.lastname}\n` +
      `📌 ${act.name}\n` +
      `📏 ${distanceKm.toFixed(2)} km\n` +
      `⏱️ ${movingMinutes} menit\n` +
      `🏃 Pace: ${paceFormatted}\n` +
      `⛰️ Elevasi: ${act.total_elevation_gain} m\n\n`;
  });
  await chat.sendMessage(reply);
  //  5. Kalendar
}

// module.exports = { getClubInfo, getClubActivities };
