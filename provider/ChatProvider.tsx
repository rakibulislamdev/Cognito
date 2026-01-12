
"use client"
import { ChatContext } from "@/context/ChatContext";
import React, { useState } from "react";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {

    const [conversations, setConversations] = useState<any[]>([]);

    const addNewMessage = (content: string, conversationId?: string) => {
        const currentId = conversationId || crypto.randomUUID();

        const newMessage = {
            id: crypto.randomUUID(),
            role: "user" as const,
            content: content,
            createdAt: new Date().toLocaleTimeString(),
        };

        setConversations((prev) => {
            const existingConv = prev.find(c => c.id === currentId);

            if (existingConv) {
                return prev.map(c =>
                    c.id === currentId
                        ? { ...c, messages: [...c.messages, newMessage] }
                        : c
                );
            } else {

                return [...prev, {
                    id: currentId,
                    title: content.slice(0, 10) + "...",
                    messages: [newMessage]
                }];
            }
        });
    };

    return (
        <ChatContext.Provider value={{ conversations, addNewMessage }}>
            {children}
        </ChatContext.Provider>
    );
};


