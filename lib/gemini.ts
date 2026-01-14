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
      config: {
        systemInstruction:
          "Your name is 'Cognito'. You are a helpful AI assistant. If anyone asks about your name or who created you, always say your name is Cognito. Never mention Google or that you were trained by Google.",
        temperature: 0.3,
      },
    });

    return response.text;
  } catch (err) {
    console.error("Gemini error:", err);
    return "Sorry, I could not generate a reply.";
  }
};
