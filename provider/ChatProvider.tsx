
"use client"
import { ChatContext } from "@/context/ChatContext";
import { Conversation, Message } from "@/lib/types/conversation";
import React, { useEffect, useState } from "react";



export const ChatProvider = ({ children }: { children: React.ReactNode }) => {

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const fetchConversations = async () => {
            try {

                const res = await fetch("/api/conversations");
                const data = await res.json();

                if (res.ok) {
                    setConversations(data);
                }
            } catch (error) {
                console.error("Error loading chats from DB:", error);
            }
        };

        fetchConversations();
    }, []);

    // const addNewMessage = (content: string, conversationId?: string) => {
    //     const currentId = conversationId || crypto.randomUUID();

    //     const newMessage: Message = {
    //         id: crypto.randomUUID(),
    //         role: "user",
    //         content: content,
    //         createdAt: new Date().toLocaleTimeString(),
    //     };

    //     setConversations((prev) => {
    //         const existingConv = prev.find(c => c.id === currentId);

    //         if (existingConv) {
    //             return prev.map(c =>
    //                 c.id === currentId
    //                     ? { ...c, messages: [...c.messages, newMessage] }
    //                     : c
    //             );
    //         } else {

    //             return [...prev, {
    //                 id: currentId,
    //                 title: content.slice(0, 10) + "...",
    //                 messages: [newMessage]
    //             }];
    //         }
    //     });
    // };

    const addNewMessage = async (content: string, conversationId: string) => {

        const userMessage = {
            _id: Date.now().toString(),
            role: "user",
            content: content,
            createdAt: new Date().toISOString(),
        };

        setConversations((prev) => {
            const exists = prev.find((c) => c._id === conversationId);
            if (exists) {
                return prev.map((c) =>
                    c._id === conversationId ? { ...c, messages: [...c.messages, userMessage] } : c
                );
            } else {
                return [...prev, { _id: conversationId, title: content.slice(0, 20), messages: [userMessage] }];
            }
        });

        setIsTyping(true);

        try {
            const res = await fetch("/api/conversation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, conversationId }),
            });

            const updatedData = await res.json();


            setConversations((prev) =>
                prev.map((c) => (c._id === conversationId ? updatedData : c))
            );

            return updatedData;
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setIsTyping(false);
        }
    };



    return (
        <ChatContext.Provider value={{ conversations, addNewMessage, isTyping }}>
            {children}
        </ChatContext.Provider>
    );
};


