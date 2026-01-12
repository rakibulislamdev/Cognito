"use client"
import { createContext, useContext } from "react";
import { Message } from "@/lib/types/conversation";

interface ChatContextType {
    messages: Message[];
    addNewMessage: (content: string) => void;
}


export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};