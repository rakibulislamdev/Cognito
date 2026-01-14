"use client"
import { createContext, useContext } from "react";
import { Conversation } from "@/lib/types/conversation";

interface ChatContextType {
    conversations: Conversation[];
    isTyping: boolean;
    addNewMessage: (content: string, conversationId: string) => Promise<void>;
    updateMessage: (
        conversationId: string,
        messageId: string,
        newContent: string
    ) => Promise<void>;
    updateTitle: (id: string, newTitle: string) => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};