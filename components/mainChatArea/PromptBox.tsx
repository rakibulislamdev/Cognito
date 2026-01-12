"use client"
import { useChat } from "@/context/ChatContext";
import { ArrowRight, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";


export default function PromptBox() {
    const [prompt, setPrompt] = useState('');

    const { addNewMessage } = useChat()
    const params = useParams();
    const router = useRouter();


    const handleSend = async () => {
        if (!prompt.trim()) return;

        const conversationId = (params.conversationId) || crypto.randomUUID();


        addNewMessage(prompt, conversationId);
        setPrompt('');

        if (!params.conversationId) {
            router.push(`/conversation/${conversationId}`);
        }
    };



    return (
        <div className="p-6 border-t border-gray-200">
            <div className="relative">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask me Anything"
                    className="w-full p-4 pr-20 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <Sparkles size={20} className="w-5 h-5 text-purple-500" />
                </div>
            </div>
            <div className="flex items-end justify-end mt-3">
                <div className="flex items-end space-x-4">
                    <span className="text-sm text-gray-500">{prompt.trim().length}/1000</span>
                    <button
                        onClick={handleSend}
                        className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer">
                        <span className="text-sm">Send</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}
