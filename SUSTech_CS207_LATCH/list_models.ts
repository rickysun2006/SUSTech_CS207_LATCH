import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const apiKey = process.env.VITE_GOOGLE_API_KEY || "AIzaSyApV1CsALtoJGldEPnf1_DwWrQ6tFUwKMI";
const genAI = new GoogleGenAI({ apiKey });

async function listModels() {
  try {
    const response = await genAI.models.list();
    console.log("Available models:");
    for await (const model of response) {
      console.log(model.name);
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
