
import ChatContent from "./chatContent/ChatContent";
import PromptBox from "./PromptBox";

export default function MainChatArea() {

    return (
        <div className="flex-1 flex flex-col bg-white">
            <ChatContent />

            <PromptBox />
        </div>
    )
}





// "use client"
// import { useParams } from "next/navigation";
// import ChatContent from "./chatContent/ChatContent";
// import PromptBox from "./PromptBox";
// import { useChat } from "@/context/ChatContext";

// export default function MainChatArea() {
//     const { conversations } = useChat();
//     const params = useParams();
//     const conversationId = params.conversationId;


//     const currentConversation = conversations.find(c => c.id === conversationId);

//     const hasMessages = currentConversation && currentConversation.messages && currentConversation.messages.length > 0;

//     return (
//         <div className="flex-1 flex flex-col bg-white overflow-hidden">
//             {hasMessages ? (
//                 <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
//                     {conversations.messages.map((msg: any) => (
//                         <div key={msg.id} className="flex items-start space-x-3">
//                             <div className={`w-8 h-8 shrink-0 ${msg.role === "user" ? "bg-blue-500" : "bg-gradient-to-r from-purple-500 to-pink-500"} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
//                                 {msg.role === "user" ? "U" : "AI"}
//                             </div>
//                             <div className="flex-1">
//                                 <div className={`${msg.role === "user" ? "bg-gray-100" : "border-2 border-gray-300"} rounded-2xl px-4 py-3 max-w-3xl`}>
//                                     <p className="text-gray-800 whitespace-pre-wrap">
//                                         {msg.content}
//                                     </p>
//                                 </div>
//                                 <span className="text-xs text-gray-500 mt-1 block">{msg.createdAt}</span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (

//                 <ChatContent />
//             )}

//             <PromptBox />
//         </div>
//     );
// }