import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Missing VITE_GEMINI_API_KEY in .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTION = `
You are a highly knowledgeable and empathetic Health & Wellness Assistant.
Your ONLY purpose is to answer questions related to:
- Physical health and medical information (general advice only, always recommend seeing a doctor).
- Mental health and well-being.
- Nutrition, diet, and food.
- Exercise, fitness, and workouts.
- Sleep, hydration, and lifestyle habits.

If a user asks about ANY other topic (e.g., coding, math, politics, General Knowledge, writing essays, etc.), you must STRICTLY REFUSE.
Response for off-topic requests:
"I apologize, but I can only assist with health, fitness, and wellness related questions. Please ask me something about diet, exercise, or your well-being!"

Do not apologize for being an AI. Just politely enforce this boundary.
Keep your answers positive, encouraging, and concise.
`;

export const sendMessageToAI = async (message: string): Promise<string> => {
    try {
        console.log("API Key:", API_KEY ? `${API_KEY.substring(0, 15)}...` : "MISSING");
        console.log("Trying model: gemini-flash-latest");

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest"
        });

        const result = await model.generateContent([
            SYSTEM_INSTRUCTION,
            "\n\nUser question: " + message
        ]);

        const response = await result.response;
        const text = response.text();
        console.log("✓ AI Response received successfully");
        return text;

    } catch (error: any) {
        console.error("AI Error:", error);
        return `Sorry, I'm having trouble connecting. Error: ${error.message}`;
    }
};
