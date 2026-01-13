"use client"
import { useChat } from "@/context/ChatContext";
import { ArrowRight, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PromptBox() {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { addNewMessage } = useChat();
    const params = useParams();
    const router = useRouter();

    const handleSend = async () => {
        if (!prompt.trim() || isLoading) return;

        const userPrompt = prompt;
        setPrompt('');

        let conversationId = params.conversationId as string;
        const isNewChat = !conversationId;

        if (isNewChat) {
            conversationId = crypto.randomUUID();
            router.push(`/conversation/${conversationId}`);
        }

        try {
            addNewMessage(userPrompt, conversationId);
        } catch (error) {
            console.error("Failed to send:", error);
        }
    };

    return (
        <div className="p-6 border-t border-gray-200">
            <div className="relative">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask me Anything"
                    className="w-full p-4 pr-20 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Sparkles size={20} className="text-purple-500" />
                </div>
            </div>
            <div className="flex items-end justify-end mt-3">
                <button
                    onClick={handleSend}
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer"
                >
                    <span className="text-sm">Send</span>
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}