import { MessageCircle } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import Conversations from "./Conversations";
import Link from "next/link";


export default function LeftSidebar() {
    return (
        <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
            <Header />

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="space-y-1">
                    <Link
                        href="/"
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                        <MessageCircle size={16} />
                        <span className="text-sm">Create Chat</span>
                    </Link>
                </div>

                <Conversations />
            </nav>

            <Footer />

        </div>
    )
}
