import Avatar from "./Avatar";
import Description from "./Description";
import Greeting from "./Greeting";
import PromptSuggestions from "./PromptSuggestions";


export default function ChatContent() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <Avatar />
            <Greeting />
            <Description />
            <PromptSuggestions />
        </div>
    )
}
