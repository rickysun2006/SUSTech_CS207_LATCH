import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const apiKey = process.env.VITE_GOOGLE_API_KEY;
if (!apiKey) {
  console.error("Error: VITE_GOOGLE_API_KEY is not set in environment variables.");
  process.exit(1);
}
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
