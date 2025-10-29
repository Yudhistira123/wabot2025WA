// Install the assemblyai package by executing the command "npm install assemblyai"

import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: "78982328a0484804b67518f4947a85d7",
});

const audioFile = "./test2.m4a";
//const audioFile = "https://assembly.ai/wildfires.mp3";

const params = {
  audio: audioFile,
  speech_model: "universal",
  language_detection: true,
};

const run = async () => {
  const transcript = await client.transcripts.transcribe(params);

  console.log(transcript.text);
};

run();
