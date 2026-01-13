import { GoogleGenAI } from "@google/genai";

// Gemini client init
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const generateGeminiReply = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: content,
    });

    return response.text;
  } catch (err) {
    console.error("Gemini error:", err);
    return "Sorry, I could not generate a reply.";
  }
};
