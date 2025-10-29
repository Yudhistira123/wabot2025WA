import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { AssemblyAI } from "assemblyai";
import { handleJadwalSholat } from "../utils/sholat.js";

/**
 * Handles voice or PTT messages:
 * 1. Downloads media
 * 2. Converts .ogg -> .wav
 * 3. Transcribes using AssemblyAI
 * 4. Sends result back to chat
 * 5. Calls relevant handlers (e.g., jadwal sholat)
 */
export async function handleVoiceMessage(chat, message) {
  const speechClient = new AssemblyAI({
    apiKey: "78982328a0484804b67518f4947a85d7", // 🔑 Replace with your key
  });

  /**
   * Convert .ogg to .wav using FFmpeg
   */
  const convertToWav = (inputFile, outputFile) => {
    return new Promise((resolve, reject) => {
      ffmpeg(inputFile)
        .toFormat("wav")
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .save(outputFile);
    });
  };

  /**
   * Transcribe audio file using AssemblyAI
   */
  const transcribeAudio = async (filePath) => {
    try {
      const params = {
        audio: filePath,
        speech_model: "universal",
        language_detection: true,
      };
      const transcript = await speechClient.transcripts.transcribe(params);
      console.log("✅ Transcribed text:", transcript.text);
      return transcript.text;
    } catch (error) {
      console.error("❌ Error transcribing audio:", error.message);
      return "";
    }
  };

  try {
    // 1️⃣ Download media
    const media = await message.downloadMedia();
    fs.writeFileSync("voice.ogg", Buffer.from(media.data, "base64"));

    // 2️⃣ Convert to WAV
    await convertToWav("voice.ogg", "voice.wav");

    // 3️⃣ Transcribe
    const transcribedText = await transcribeAudio("voice.wav");

    // optional: delete temp files
    fs.unlinkSync("voice.ogg");
    fs.unlinkSync("voice.wav");

    if (!transcribedText) {
      await chat.sendMessage("❌ Tidak bisa mengenali suara.");
      return;
    }

    // 4️⃣ Send transcription result
    await chat.sendMessage(`🗣️ *Hasil transkripsi:* ${transcribedText}`);

    // 5️⃣ Voice command detection
    const lowerText = transcribedText.toLowerCase();
    const cleanText = lowerText.trim().endsWith(".")
      ? lowerText.slice(0, -1)
      : lowerText;

    //const cleanText = lowerText.trim().replace(/[.,!?;:]$/, "");

    if (lowerText.includes("jadwal sholat")) {
      await handleJadwalSholat(chat, cleanText);
    }

    // ✅ Add more voice commands here if needed
    // else if (lowerText.includes("cuaca")) { ... }
    // else if (lowerText.includes("surat al-fatihah")) { ... }
  } catch (error) {
    console.error("❌ Error handling voice message:", error);
    await chat.sendMessage("⚠️ Terjadi kesalahan saat memproses suara.");
  }
}
