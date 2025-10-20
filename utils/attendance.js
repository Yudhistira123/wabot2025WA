import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import {
  getAirQuality,
  interpretAQI,
  formatAirQuality,
} from "./airQualityService.cjs";

import { getWeather, formatWeather } from "./weather.js";
import { getFilteredPOISorted } from "./googleApi.js";

// helper untuk ambil nomor WA dari JID
export async function jidToNumber(jid, sock) {
  if (!jid) return null;

  // kalau sudah format nomor normal
  if (jid.endsWith("@s.whatsapp.net")) {
    return jid.split("@")[0];
  }

  // kalau masih lid, cek langsung ke WhatsApp
  try {
    const result = await sock.onWhatsApp(jid);
    if (result && result[0] && result[0].jid) {
      return result[0].jid.split("@")[0]; // nomor asli
    }
  } catch (e) {
    console.error("onWhatsApp error:", e);
  }

  // fallback terakhir
  return jid.split("@")[0];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === DB FILE ===
const DATA_FILE = path.join(__dirname, "data.json");
function loadData() {
  if (!fs.existsSync(DATA_FILE)) return { sessions: {}, hadir: {} };
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
let DB = loadData();

// === Helper ===
function haversineMeters(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function nowJakarta() {
  return new Date()
    .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
    .replace(" ", "T");
}

// === Command Handlers ===
export function openKelas(from, kode, ruang, lat, lng) {
  DB.sessions[from] = { kode, ruang, lat, lng, openedAt: nowJakarta() };
  DB.hadir[from] = {};
  saveData(DB);
  return `✅ Kelas ${kode} di ${ruang} dibuka!`;
}

// export function absen(from, sender, nama, lat, lng, sock) {
//   const sess = DB.sessions[from];
//   if (!sess) return "❌ Tidak ada kelas aktif.";
//   const dist = haversineMeters(sess.lat, sess.lng, lat, lng);
//   const nomor = jidToNumber(sender, sock);
//   console.log({ nomor });
//   if (dist < 700) {
//     DB.hadir[from][sender] = {
//       name: nama,
//       no: nomor,
//       lat,
//       lng,
//       distance: Math.round(dist) + " meter",
//       time: nowJakarta(),
//     };
//     saveData(DB);
//     return `✅ Absen diterima ${nama}, jarak ${Math.round(dist)} m`;
//   } else {
//     return `❌ Absen gagal ${nama}, jarak ${Math.round(dist)} m (terlalu jauh)`;
//   }
// }

export function daftarHadir(from) {
  const hadir = DB.hadir[from] || {};
  const entries = Object.values(hadir);
  if (entries.length === 0) return "📋 Daftar hadir masih kosong.";
  let out = `📋 Daftar hadir (${entries.length} mahasiswa):\n`;
  entries.forEach(
    (m, i) =>
      (out += `${i + 1}. ${m.name} (${m.no}) • ${m.distance} • ${m.time}\n`)
  );
  return out.trim();
}

export function endKelas(from) {
  if (!DB.sessions[from]) return "❌ Tidak ada sesi aktif.";
  const rekapFile = path.join(__dirname, "rekap.json");
  let rekap = [];
  if (fs.existsSync(rekapFile)) {
    rekap = JSON.parse(fs.readFileSync(rekapFile, "utf8"));
  }
  rekap.push({
    kelas: DB.sessions[from],
    hadir: DB.hadir[from],
    closedAt: nowJakarta(),
  });
  fs.writeFileSync(rekapFile, JSON.stringify(rekap, null, 2));
  delete DB.sessions[from];
  delete DB.hadir[from];
  saveData(DB);
  return "✅ Kelas ditutup, rekap tersimpan.";
}

export async function handleLocationMessage(msg, sock) {
  // const from = msg.key.remoteJid;
  // const sender = msg.key.participant;
  // const sess = DB.sessions[from];

  // === FITUR 2: INFO LINGKUNGAN ===
  //const loc = msg.message.locationMessage;
  // const nama = msg.pushName;
  const { latitude, longitude, description } = msg.location; // ✅ lowercase 'location'
  // const loc = msg.location;
  // const latitude = loc.degreesLatitude;
  // const longitude = loc.degreesLongitude;
  // const description = loc.name; // Deskripsi lokasi opsional
  // if (sess) {
  //   const dist = haversineMeters(sess.lat, sess.lng, latitude, longitude);
  //   const nomor = jidToNumber(sender, sock);
  //   console.log({ nomor });
  //   if (dist < 700) {
  //     DB.hadir[from][sender] = {
  //       name: nama,
  //       no: nomor,
  //       latitude,
  //       longitude,
  //       distance: Math.round(dist) + " meter",
  //       time: nowJakarta(),
  //     };
  //     saveData(DB);
  //     return `✅ Absen diterima ${nama}, jarak ${Math.round(dist)} m`;
  //   } else {
  //     return `❌ Absen gagal ${nama}, jarak ${Math.round(
  //       dist
  //     )} m (terlalu jauh)`;
  //   }
  // } else {
  const senderTime = new Date(msg.timestamp * 1000).toLocaleString("id-ID");

  console.log(
    `📍 Lokasi diterima: ${latitude}, ${longitude} (${
      description || "tanpa deskripsi"
    } pada ${senderTime})`
  );
  let header = `📍 Lokasi diterima: ${latitude}, ${longitude} (${
    description || "tanpa deskripsi"
  } pada ${senderTime})`;

  description + `Lat: ${latitude}, Lon: ${longitude} pada ${senderTime}`;
  const apiKey = "44747099862079d031d937f5cd84a57e"; // <- pakai key kamu
  const data = await getAirQuality(latitude, longitude, apiKey);
  const replyMsg1 = formatAirQuality(header, data);
  const weather = await getWeather(latitude, longitude, apiKey);
  const replyMsg2 = await formatWeather(weather);
  //POI
  const places = await getFilteredPOISorted(latitude, longitude, 1000);

  // Format semua hasil jadi satu string
  let replyMsg3 = "📍 *Tempat Penting Saat Turing*\n\n";
  places.slice(0, 20).forEach((p, i) => {
    const mapsLink = `https://www.google.com/maps?q=${p.lat},${p.lon}`;
    replyMsg3 += `${i + 1}. ${p.name}-${p.distance_km} km\n${mapsLink}\n\n`;
  });
  return replyMsg1 + "\n\n" + replyMsg2 + "\n\n" + replyMsg3;
}
