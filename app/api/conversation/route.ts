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

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { conversationId, messageId, content } = await req.json();

    // ১. প্রথমে পুরো কনভারসেশনটি খুঁজে বের করি
    const conversation = await Conversations.findById(conversationId);

    if (!conversation) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // ২. যে মেসেজটি এডিট করা হয়েছে, সেটির পজিশন (Index) খুঁজে বের করি
    const msgIndex = conversation.messages.findIndex(
      (m: any) => m._id.toString() === messageId
    );

    if (msgIndex !== -1) {
      // ৩. ওই মেসেজের নতুন টেক্সট সেট করি
      conversation.messages[msgIndex].content = content;

      // ৪. যাদুর লাইন: এই মেসেজের পরে যা যা আছে (পুরোনো AI রিপ্লাই) সব মুছে ফেলি
      // splice(index + 1) মানে হলো এই পজিশনের পরের সব ডিলিট
      conversation.messages.splice(msgIndex + 1);

      // ৫. এখন নতুন কন্টেন্ট নিয়ে AI থেকে রিপ্লাই আনি
      const aiReply = await generateGeminiReply(content);

      // ৬. নতুন AI রিপ্লাইটি চ্যাটে যোগ করি
      conversation.messages.push({
        role: "assistant",
        content: aiReply,
      });

      // ৭. সবশেষে ডাটাবেসে সেভ করি
      conversation.updatedAt = new Date();
      await conversation.save();
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
