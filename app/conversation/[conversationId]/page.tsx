import { fakeConversations } from "@/app/page";
import Footer from "@/components/leftSidebar/Footer";
import LeftSidebar from "@/components/leftSidebar/LeftSidebar";


export default async function ConversationPage({ params }: any) {

    const { conversationId } = await params

    const conversation = fakeConversations.find(conv => conv.id === conversationId)
    console.log(conversation)


    if (!conversation) {
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
                                {conversation.title}
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
                    conversation.messages.map(msg => (
                        <div key={msg.id} className="flex flex-col px-8 py-6 overflow-y-auto space-y-6">
                            <div className="flex items-start space-x-3">
                                <div className={`w-8 h-8 ${msg.role === "user" ? "bg-blue-500" : "bg-gray-500"} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
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
                <div className="p-6 border-t border-gray-200">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Ask me Anything"
                            className="w-full p-4 pr-20 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                            <i data-lucide="sparkles" className="w-5 h-5 text-purple-500" />
                        </div>
                    </div>
                    <div className="flex items-center justify-end mt-3">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">0/1000</span>
                            <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer">
                                <span className="text-sm">Send</span>
                                <i data-lucide="arrow-right" className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
