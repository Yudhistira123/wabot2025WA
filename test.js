// index.js
// === Simulated "Hasil Club Lari" script without WhatsApp ===

// Mock function: get club info (replace with real API later)
import { getClubInfo, getClubActivities } from "./utils/stravaService.js";

// === MAIN PROGRAM ===
async function main() {
  const CLUB_ID = "728531"; // ID Club Laris
  console.log(`📡 Mengambil data club ID: ${CLUB_ID} ...`);

  const clubInfo = await getClubInfo(CLUB_ID);
  const activities = await getClubActivities(CLUB_ID);

  if (!clubInfo) {
    console.error("❌ Gagal ambil info club.");
    return;
  }

  // Show cover photo URL (no WhatsApp image sending)
  if (clubInfo.cover_photo_small) {
    console.log(`🖼️ Cover photo URL: ${clubInfo.cover_photo_small}\n`);
  }

  // Build text reply
  let reply =
    `🏃 *${clubInfo.name}*\n` +
    `🌍 Lokasi: ${clubInfo.city}, ${clubInfo.state}, ${clubInfo.country}\n` +
    `👥 Member: ${clubInfo.member_count}\n\n` +
    `ℹ️ ${clubInfo.description || "No description"}\n\n` +
    `=== 10 Aktivitas Terbaru ===\n\n`;

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

  console.log(reply);
}

// Run program
main().catch((err) => console.error("❌ Error:", err.message));
