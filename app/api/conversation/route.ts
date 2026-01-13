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

    // ডাটাবেসে চেক করা হচ্ছে চ্যাটটি আগে থেকে আছে কি না
    conversation = await Conversations.findOne({ _id: conversationId });

    if (conversation) {
      // যদি পুরনো চ্যাট হয়, শুধু মেসেজ পুশ হবে
      conversation.messages.push(userMessage);
    } else {
      // ১. যদি একদম নতুন চ্যাট হয়, তবে টাইটেল জেনারেট করার জন্য জেমিনিকে বলা হবে
      const titlePrompt = `Generate a very short, maximum 3-4 word title for a chat that starts with this message: "${content}". Return only the title text, no quotes or extra words.`;

      let smartTitle;
      try {
        smartTitle = await generateGeminiReply(titlePrompt);
        // অনেক সময় জেমিনি উত্তর বড় দিতে পারে বা কোট দিতে পারে, সেগুলো ক্লিন করা
        smartTitle = smartTitle.replace(/["']/g, "").trim();
      } catch (error) {
        // যদি কোনো কারণে টাইটেল জেনারেট না হয়, তবে আগের স্লাইস পদ্ধতি ব্যাকআপ হিসেবে থাকবে
        smartTitle = content.slice(0, 30);
      }

      conversation = new Conversations({
        _id: conversationId,
        title: smartTitle, // অটো জেনারেটেড টাইটেল সেট হলো
        messages: [userMessage],
      });
    }

    // ২. এবার ইউজারের প্রম্পটের আসল উত্তর জেনারেট করা
    const aiContent = await generateGeminiReply(content);
    const assistantMessage = { role: "assistant", content: aiContent };

    conversation.messages.push(assistantMessage);

    // সেভ করার আগে নিশ্চিত হওয়া যে updatedAt আপডেট হচ্ছে (সাইডবারের সর্টিং এর জন্য)
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
    // লেটেস্ট চ্যাট সবার উপরে দেখানোর জন্য সর্টিং
    const allConversations = await Conversations.find().sort({ updatedAt: -1 });
    return NextResponse.json(allConversations);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
