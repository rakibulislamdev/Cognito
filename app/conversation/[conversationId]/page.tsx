"use client"
import LeftSidebar from "@/components/leftSidebar/LeftSidebar";
import PromptBox from "@/components/mainChatArea/PromptBox";
import { useChat } from "@/context/ChatContext";
import { fakeConversations } from "@/data/fakeConversations";
import { useParams } from "next/navigation";




export default function ConversationPage() {

    const { conversations } = useChat()
    const params = useParams()
    const conversationId = params.conversationId

    const conver = conversations.find(conv => conv.id === conversationId)
    console.log(",,,,,,,,,,,", conver)




    if (!conver) {
        return <p>Conversation not found</p>;
    }

    return (
        <div className="flex h-screen mx-auto bg-white max-h-screen">
            <LeftSidebar />
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Chat Header */}
                <div className="px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <h1 className="text-lg font-semibold text-gray-800">
                                {conver.title}
                            </h1>
                        </div>
                        <div className="relative">
                            <button
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"

                            >
                                <i
                                    data-lucide="more-horizontal"
                                    className="w-5 h-5 text-gray-500 group-hover:text-gray-700"
                                />
                            </button>
                            {/* Dropdown Menu */}
                            <div
                                id="conversationDropdown"
                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden z-20"
                            >
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                                    <i data-lucide="edit" className="w-4 h-4" />
                                    <span>Rename conversation</span>
                                </button>
                                <hr className="my-1 opacity-10" />
                                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                                    <i data-lucide="trash-2" className="w-4 h-4" />
                                    <span>Delete conversation</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Chat Content */}

                {
                    conver.messages.map(msg => (
                        <div key={msg.id} className="flex flex-col px-8 py-6 overflow-y-auto space-y-6">
                            <div className="flex items-start space-x-3">
                                <div className={`w-8 h-8 ${msg.role === "user" ? "bg-blue-500" : "bg-gradient-to-r from-purple-500 to-pink-500"} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                                    {msg.role === "user" ? "U" : "AI"}
                                </div>
                                <div className="flex-1">
                                    <div className={`${msg.role === "user" ? "bg-gray-100" : "border-2 border-gray-300"} rounded-2xl px-4 py-3 max-w-3xl`}>
                                        <p className="text-gray-800">
                                            {msg.content}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1 block">{msg.createdAt}</span>
                                </div>
                            </div>
                        </div>
                    ))
                }

                {/* Input Area */}
                <PromptBox />
            </div>
        </div>

    )
}
