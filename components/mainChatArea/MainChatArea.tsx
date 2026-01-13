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
