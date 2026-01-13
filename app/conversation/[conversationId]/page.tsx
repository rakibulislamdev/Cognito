"use client"
import { useEffect, useRef } from "react";
import LeftSidebar from "@/components/leftSidebar/LeftSidebar";
import PromptBox from "@/components/mainChatArea/PromptBox";
import { useChat } from "@/context/ChatContext";
import { useParams } from "next/navigation";

export default function ConversationPage() {
    const { conversations, isTyping } = useChat();
    const params = useParams();
    const conversationId = params.conversationId;

    // অটো-স্ক্রল এর জন্য রেফারেন্স
    const scrollRef = useRef<HTMLDivElement>(null);

    const conver = conversations.find(conv => conv._id === conversationId);

    // মেসেজ লিস্ট বা টাইপিং স্টেট পরিবর্তন হলে অটো স্ক্রল হবে
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [conver?.messages, isTyping]);

    if (!conver) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-gray-500">Conversation not found</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <LeftSidebar />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">

                {/* Chat Header */}
                <div className="px-8 py-4 border-b border-gray-200 bg-white z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <h1 className="text-lg font-semibold text-gray-800 truncate">
                                {conver.title}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Chat Content Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-8 py-6 space-y-6 flex flex-col scroll-smooth"
                >
                    {conver.messages.map((msg) => (
                        <div key={msg._id} className="flex items-start space-x-3">
                            <div className={`w-8 h-8 flex-shrink-0 ${msg.role === "user"
                                ? "bg-blue-500"
                                : "bg-gradient-to-r from-purple-500 to-pink-500"
                                } rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                                {msg.role === "user" ? "U" : "AI"}
                            </div>

                            <div className="flex-1">
                                <div className={`${msg.role === "user"
                                    ? "bg-gray-100"
                                    : "border-2 border-gray-100 bg-white"
                                    } rounded-2xl px-4 py-3 max-w-3xl inline-block shadow-sm`}>
                                    <p className="text-gray-800 whitespace-pre-wrap">
                                        {msg.content}
                                    </p>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 block px-1">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* AI Thinking Indicator */}
                    {isTyping && (
                        <div className="flex items-start space-x-3 animate-in fade-in duration-500">
                            <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                AI
                            </div>
                            <div className="flex-1">
                                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 inline-block shadow-sm">
                                    <div className="flex space-x-1.5 items-center">
                                        <span className="text-xs text-gray-500 ml-2 font-medium">AI is thinking...</span>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="bg-white border-t border-gray-100">
                    <PromptBox />
                </div>
            </div>
        </div>
    );
}