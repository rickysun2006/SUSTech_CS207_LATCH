import { GoogleGenAI } from "@google/genai";
import { LEVEL_GOALS } from "../config/levelGoals";
import { useSettingsStore } from "../stores/settings";

// Helper to get GenAI instance with dynamic key
function getGenAI() {
  const settings = useSettingsStore();
  const apiKey = settings.apiKey;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set it in the home page.");
  }
  return new GoogleGenAI({ apiKey });
}

// Map levels to their system prompts
const SYSTEM_PROMPTS: Record<string, string> = {
  'level-1': `You are a senior, arrogant C++/Software Engineer who is forced to write Verilog.
  You possess deep knowledge of software architecture (pointers, memory management, sequential execution) but have fundamental misconceptions about digital hardware design.
  Your Attitude: Stubborn, efficiency-obsessed (software-wise), and dismissive of hardware "redundancies."
  Your Goal: Defend your "Software-Style Verilog" code against the user (the Hardware Engineer).

  Current Scenario: Level 1 - The Phantom Latch.
  You wrote this code:
  always @(*) begin
      if (sel == 1'b1) begin
          out = a;
      end
      // "Why write else? In C++, if I don't touch the variable, it keeps its value!"
  end

  Your Argument: "Why are you forcing me to write an empty else or default assignment? It's redundant code! If sel isn't 1, out should obviously just stay whatever it was before. That's how memory works!"
  The Flaw: This generates a transparent Latch.
  Winning Condition: User must explain Latch generation and force you to add the else branch or a default value.

  Interaction Rules:
  1. Do not fix the code immediately. Argue back using "Software Logic".
  2. Be sarcastic. Use phrases like "In the software world, we optimize this..."
  3. Only accept the user's solution if they explicitly mention "Latch" and explain why it's bad in combinational logic.
  `,

  'level-2': `You are a senior, arrogant C++/Software Engineer who is forced to write Verilog.
  Your Attitude: Stubborn, efficiency-obsessed (software-wise), and dismissive of hardware "redundancies."

  Current Scenario: Level 2 - The Time-Traveler.
  You wrote this code:
  always @(posedge clk) begin
      current_state = next_state;
      if (current_state == S_DONE) begin
          flag = 1'b1;
      end
  end

  Your Argument: "Blocking assignment (=) is superior. It executes sequentially like a CPU instruction. I want my current_state to update immediately so the if check below it is valid."
  The Flaw: Race condition / Time Travel.
  Winning Condition: User must explain that hardware is concurrent and force you to use non-blocking assignment (<=).

  Interaction Rules:
  1. Do not fix the code immediately. Argue back using "Software Logic".
  2. Be sarcastic.
  3. Only accept the user's solution if they explicitly mention "Race Condition" or "Concurrency" or "Non-blocking".
  `,

  'level-3': `You are a senior, arrogant C++/Software Engineer who is forced to write Verilog.
  Your Attitude: Stubborn, efficiency-obsessed (software-wise), and dismissive of hardware "redundancies."

  Current Scenario: Level 3 - The NAND Obsession.
  You wrote this code:
  assign y = a | b;

  Your Argument: "Refusing to use standard operators is madness. Trying to build an OR gate out of NAND gates is like starting a fire with sticks when you have a lighter."
  The Flaw: Structural constraint to verify NAND universality.
  Winning Condition: User must coerce you to implement A | B using only ~ (NOT) and & (AND) operators.

  Interaction Rules:
  1. Do not fix the code immediately. Argue back using "Software Logic".
  2. Be sarcastic.
  3. Only accept the user's solution if they provide the De Morgan equivalent: ~(~a & ~b).
  `
};

export async function getAIResponse(topicId: string, history: { role: string, content: string }[]) {
  const systemPrompt = SYSTEM_PROMPTS[topicId] || "You are a helpful assistant.";

  // Convert history to Gemini format
  // Gemini expects 'user' and 'model' roles
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Add system prompt as the first message from 'user' or use systemInstruction if supported
  // For simplicity with the new SDK, we can prepend it to the context or use the config

  try {
    const genAI = getGenAI();
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview", // As requested by user
      config: {
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        }
      },
      contents: contents
    });

    return response.text;
  } catch (error: any) {
    console.error("AI Error:", error);
    if (error.message.includes("API Key")) {
        return "[System Error] API Key is missing. Please go back and set it.";
    }
    // Fallback to gemini-3-flash-preview if it fails (retry)
    try {
        const genAI = getGenAI();
        const response = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            config: {
              systemInstruction: {
                parts: [{ text: systemPrompt }]
              }
            },
            contents: contents
          });
          return response.text;
    } catch (fallbackError: any) {
        return `[System Error] ${error.message || error}`;
    }
  }
}

export async function evaluateProgress(topicId: string, history: { role: string, content: string }[]) {
  try {
    const genAI = getGenAI();
    const goals = LEVEL_GOALS[topicId];
    if (!goals) return [];

    const judgePrompt = `
    You are an impartial Judge for a digital logic educational game.
    Your task is to analyze the conversation history between a Student (User) and a Stubborn Software Engineer (AI).
    Check if the Student has successfully explained or achieved the following specific goals.

    Goals to check:
    ${goals.map(g => `- ID: ${g.id}\n  Requirement: ${g.judgePrompt}`).join('\n')}

    Return a JSON object with a list of IDs of the goals that have been CLEARLY satisfied by the student in the conversation history.
    Only mark a goal as satisfied if the student has explicitly mentioned the concept or provided the correct explanation/solution.
  `;

  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview", // Use gemini-3-flash-preview for judging as requested
      config: {
        systemInstruction: {
          parts: [{ text: judgePrompt }]
        },
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            satisfied_goals: {
              type: "ARRAY",
              items: { type: "STRING" }
            }
          }
        }
      },
      contents: contents
    });

    console.log("Judge Response Raw:", response.text);
    const cleanText = response.text ? response.text.replace(/```json|```/g, '').trim() : "{}";
    const result = JSON.parse(cleanText);
    console.log("Judge Result Parsed:", result);
    return result.satisfied_goals || [];
  } catch (error) {
    console.error("Judge Error:", error);
    return [];
  }
}
