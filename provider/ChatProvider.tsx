
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


    const updateMessage = async (conversationId: string, messageId: string, newContent: string) => {
        // ১. আগের স্টেট ব্যাকআপ (Rollback এর জন্য)
        const previousConversations = [...conversations];

        // ২. Optimistic Update: সাথে সাথে UI পরিবর্তন করা
        setConversations((prev) => {
            return prev.map((c) => {
                if (c._id === conversationId) {
                    const msgIndex = c.messages.findIndex((m) => m._id === messageId);
                    if (msgIndex !== -1) {
                        // নতুন মেসেজ অ্যারে তৈরি করা
                        const updatedMessages = [...c.messages];
                        // এডিট করা মেসেজটি আপডেট করা
                        updatedMessages[msgIndex] = {
                            ...updatedMessages[msgIndex],
                            content: newContent
                        };
                        // যাদুর লাইন: এডিট করা মেসেজের পরের সব মেসেজ কেটে ফেলা
                        const finalMessages = updatedMessages.slice(0, msgIndex + 1);

                        return { ...c, messages: finalMessages };
                    }
                }
                return c;
            });
        });

        // AI thinking ইন্ডিকেটর অন করা
        setIsTyping(true);

        try {
            // ৩. সার্ভারে রিকোয়েস্ট পাঠানো
            const res = await fetch(`/api/conversation`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId, messageId, content: newContent }),
            });

            if (res.ok) {
                const updatedConversation = await res.json();
                // সার্ভারের রিয়েল ডেটা দিয়ে রিপ্লেস করা (যাতে নতুন AI রিপ্লাই আসে)
                setConversations((prev) =>
                    prev.map((c) => (c._id === conversationId ? updatedConversation : c))
                );
            } else {
                throw new Error("Failed to update");
            }
        } catch (error) {
            console.error("Error:", error);
            // এরর হলে আগের অবস্থায় ফিরে যাওয়া
            setConversations(previousConversations);
        } finally {
            setIsTyping(false);
        }
    };


    const addNewMessage = async (content: string, conversationId: string) => {
        if (!conversationId) return;
        const userMessage = {
            _id: Date.now().toString(),
            role: "user" as const,
            content: content,
            createdAt: new Date().toISOString(),
        };

        // ১. API response ashar AG-I context update kora (Optimistic Update)
        setConversations((prev: Conversation[]) => {
            const exists = prev.find((c: Conversation) => c._id === conversationId);
            if (exists) {
                // Jodi purono chat hoy, sudhu user message-ti push kora
                return prev.map((c: Conversation) =>
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
                        updatedAt: new Date().toISOString(),
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
            setConversations((prev: Conversation[]) =>
                prev.map((c: Conversation) =>
                    c._id === conversationId ? updatedConversation : c
                )
            );
        } catch (error) {
            console.error("Error adding message:", error);
        } finally {
            setIsTyping(false);
        }
    };


    const updateTitle = async (id: string, newTitle: string) => {

        const previousConversations = [...conversations];

        try {
            setConversations(prev => prev.map(c => c._id === id ? { ...c, title: newTitle } : c))

            const res = await fetch(`/api/conversation`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conversationId: id,
                    title: newTitle
                })

            })

            if (res.ok) {
                const updatedConversation = await res.json();
                setConversations(prev => prev.map(c => c._id === id ? updatedConversation : c))
            } else {
                setConversations(previousConversations);
            }


        } catch (error) {
            console.error("Update title failed", error);
            setConversations(previousConversations);
        }
    }


    const deleteConversation = async (id: string) => {
        const previousConversations = [...conversations];
        try {
            setConversations(prev => prev.filter(c => c._id !== id))

            const res = await fetch(`/api/conversation`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId: id })
            })

            if (!res.ok) {
                setConversations(previousConversations);
            }

        } catch (error) {
            console.error("Delete conversation failed", error);
            setConversations(previousConversations);
        }
    }



    return (
        <ChatContext.Provider value={{ conversations, setConversations, addNewMessage, isTyping, updateMessage, updateTitle, deleteConversation }}>
            {children}
        </ChatContext.Provider>
    );
};


