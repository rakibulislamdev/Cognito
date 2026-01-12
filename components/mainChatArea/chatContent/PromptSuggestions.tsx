import { Zap } from "lucide-react";


export default function PromptSuggestions() {
    return (
        <div className="space-y-3 w-full max-w-2xl">
            <button className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer text-left">
                <Zap size={20} className="text-yellow-500 flex-shrink-0" />
                <span className="text-gray-700">
                    It looks like you're writing an email, would you like help drafting
                    it?
                </span>
            </button>

        </div>
    )
}
