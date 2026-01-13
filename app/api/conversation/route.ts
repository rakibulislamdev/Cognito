import { connectDB } from "@/lib/db";
import { generateGeminiReply } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { Conversations } from "@/models/conversations";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { conversationId, content } = await req.json();

    const userMessage = { role: "user", content };
    let conversation;

    conversation = await Conversations.findOne({ _id: conversationId });

    if (conversation) {
      conversation.messages.push(userMessage);
    } else {
      const titlePrompt = `Generate a very short, maximum 3-4 word title for a chat that starts with this message: "${content}". Return only the title text, no quotes or extra words.`;

      let smartTitle;
      try {
        smartTitle = await generateGeminiReply(titlePrompt);
        smartTitle = smartTitle.replace(/["']/g, "").trim();
      } catch (error) {
        smartTitle = content.slice(0, 30);
      }

      conversation = new Conversations({
        _id: conversationId,
        title: smartTitle,
        messages: [userMessage],
      });
    }

    const aiContent = await generateGeminiReply(content);
    const assistantMessage = { role: "assistant", content: aiContent };

    conversation.messages.push(assistantMessage);

    conversation.updatedAt = new Date();
    await conversation.save();

    return NextResponse.json(conversation);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const allConversations = await Conversations.find().sort({ updatedAt: -1 });
    return NextResponse.json(allConversations);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
