

export default function ThinkingIndicator() {
    return (
        <div className="flex items-start space-x-3 animate-in fade-in duration-500">
            <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                AI
            </div>
            <div className="flex-1">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 inline-block shadow-sm">
                    <div className="flex space-x-1.5 items-center">
                        <span className="text-xs text-gray-500 ml-2 font-medium">Thinking...</span>
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>

                    </div>
                </div>
            </div>
        </div>
    )
}
