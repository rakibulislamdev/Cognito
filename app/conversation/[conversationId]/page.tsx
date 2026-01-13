"use client"
import { useEffect, useRef, useState } from "react";
import LeftSidebar from "@/components/leftSidebar/LeftSidebar";
import PromptBox from "@/components/mainChatArea/PromptBox";
import { useChat } from "@/context/ChatContext";
import { useParams } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Pencil, X, Save } from "lucide-react";
import ThinkingIndicator from "@/components/ThinkingIndicator";

export default function ConversationPage() {
    const { conversations, isTyping, updateMessage } = useChat();
    const params = useParams();
    const conversationId = params.conversationId;

    const [copied, setCopied] = useState<null | string>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    const scrollRef = useRef<HTMLDivElement>(null);
    const conver = conversations.find(conv => conv._id === conversationId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [conver?.messages, isTyping]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const startEditing = (id: string, content: string) => {
        setEditingId(id);
        setEditContent(content);
    };

    const handleSaveEdit = async (id: string) => {
        const newText = editContent.trim();
        if (!newText) return;

        setEditingId(null); // সাথে সাথে ইনপুট বক্সটি বন্ধ করে মেসেজ মোডে নিয়ে যান
        await updateMessage(conversationId as string, id, newText);
    };

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
                        <div key={msg._id} className="flex items-start space-x-3 relative">
                            {/* Avatar */}
                            <div className={`w-8 h-8 flex-shrink-0 ${msg.role === "user"
                                ? "bg-blue-500"
                                : "bg-gradient-to-r from-purple-500 to-pink-500"
                                } rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                                {msg.role === "user" ? "U" : "AI"}
                            </div>

                            <div className="flex-1 flex flex-col items-start">
                                {/* Message Bubble */}
                                <div className={`${msg.role === "user"
                                    ? "bg-gray-100"
                                    : "border-2 border-gray-100 bg-white"
                                    } rounded-2xl px-4 py-3 max-w-3xl inline-block shadow-sm relative`}
                                >
                                    {editingId === msg._id ? (
                                        <div className="flex flex-col space-y-2 min-w-[250px] md:min-w-[400px]">
                                            <textarea
                                                className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                rows={4}
                                                autoFocus
                                            />
                                            <div className="flex justify-end space-x-2">
                                                <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"><X size={18} /></button>
                                                <button onClick={() => handleSaveEdit(msg._id)} className="p-1 text-blue-600 hover:text-blue-700 font-medium text-[12px] flex items-center gap-1 cursor-pointer">
                                                    <Save size={16} /> Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="chat-markdown">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Info: Time + Buttons */}
                                <div className="flex items-center space-x-3 mt-1 px-1">
                                    <span className="text-[12px] text-gray-400">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>

                                    {!editingId && (
                                        <div className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-opacity">
                                            {/* Copy Button */}
                                            <button
                                                onClick={() => handleCopy(msg.content, msg._id)}
                                                className="text-gray-400 cursor-pointer hover:text-gray-700 transition-colors"
                                                title="Copy"
                                            >
                                                {copied === msg._id ? (
                                                    <span className="flex items-center gap-0.5 text-[12px] text-green-600 font-medium">
                                                        <Check size={16} /> Copied
                                                    </span>
                                                ) : (
                                                    <Copy size={16} />
                                                )}
                                            </button>

                                            {/* Edit Button - Only for User */}
                                            {msg.role === "user" && (
                                                <button
                                                    onClick={() => startEditing(msg._id, msg.content)}
                                                    className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && <ThinkingIndicator />}
                </div>

                {/* Input Area */}
                <div className="bg-white border-t border-gray-100">
                    <PromptBox />
                </div>
            </div>
        </div>
    );
}