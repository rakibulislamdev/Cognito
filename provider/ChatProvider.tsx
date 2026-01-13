
"use client"
import { ChatContext } from "@/context/ChatContext";
import { Conversation } from "@/lib/types/conversation";
import React, { useEffect, useState } from "react";



export const ChatProvider = ({ children }: { children: React.ReactNode }) => {

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const fetchAllConversations = async () => {
            try {
                const res = await fetch("/api/conversation");
                const data = await res.json();
                if (res.ok) {
                    setConversations(data);
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };
        fetchAllConversations();
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

    // ChatContext.tsx er bhetor
    const addNewMessage = async (content: string, conversationId: string) => {
        const userMessage = {
            _id: Date.now().toString(), // Temporary ID
            role: "user",
            content: content,
            createdAt: new Date(),
        };

        // ১. API response ashar AG-I context update kora (Optimistic Update)
        setConversations((prev: any) => {
            const exists = prev.find((c: any) => c._id === conversationId);
            if (exists) {
                // Jodi purono chat hoy, sudhu user message-ti push kora
                return prev.map((c: any) =>
                    c._id === conversationId
                        ? { ...c, messages: [...c.messages, userMessage] }
                        : c
                );
            } else {
                // Jodi notun chat hoy, pura conversation structure create kora
                return [
                    ...prev,
                    {
                        _id: conversationId,
                        title: content.slice(0, 30),
                        messages: [userMessage],
                    },
                ];
            }
        });

        setIsTyping(true); // AI thinking shuru

        try {
            const res = await fetch("/api/conversation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId, content }),
            });

            const updatedConversation = await res.json();

            // ২. API response ashar por temporary data-ti real data diye replace kora
            setConversations((prev: any) =>
                prev.map((c: any) =>
                    c._id === conversationId ? updatedConversation : c
                )
            );
        } catch (error) {
            console.error("Error adding message:", error);
        } finally {
            setIsTyping(false);
        }
    };



    return (
        <ChatContext.Provider value={{ conversations, setConversations, addNewMessage, isTyping }}>
            {children}
        </ChatContext.Provider>
    );
};


