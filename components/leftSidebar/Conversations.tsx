"use client"
import { useChat } from "@/context/ChatContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Trash2, Check, X } from "lucide-react";
import React, { useState } from "react";

export default function Conversations() {
    const { conversations, deleteConversation, updateTitle } = useChat();
    const params = useParams();
    const activeId = params.conversationId;
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingTitle, setEditingTitle] = useState<string>("")
    const router = useRouter();


    const displayConversations = [...conversations].reverse();


    const handleEditStart = async (e: React.MouseEvent, id: string, title: string) => {
        e.preventDefault();
        setEditingId(id)
        setEditingTitle(title)
    }

    const handleSaveTitle = async (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        if (editingTitle.trim()) {
            updateTitle(id, editingTitle)
        }
        setEditingId(null)
    }

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        e.stopPropagation()

        if (confirm("Are you sure you want to delete this conversation?")) {
            await deleteConversation(id)

            if (activeId === id) {
                router.push("/");
            }
        }
    }




    return (
        <div className="pt-4">
            <span className="text-gray-500 text-xs uppercase font-semibold px-3">
                Conversations
            </span>
            <div className="space-y-1 mt-3 px-2">
                {displayConversations.length === 0 ? (
                    <p className="text-gray-600 text-xs px-3">No chats yet</p>
                ) : (
                    displayConversations.map((conv) => {
                        const isActive = conv._id === activeId;

                        return (
                            <div key={conv._id} className="group relative">

                                {
                                    editingId === conv._id ? (<div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg">
                                        <input
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                            autoFocus
                                            className="bg-transparent text-sm text-white outline-none w-full"

                                        />
                                        <button
                                            onClick={(e) => handleSaveTitle(e, conv._id)}
                                            className="text-green-500 cursor-pointer"><Check size={18} /></button>
                                        <button onClick={() => setEditingId(null)} className="text-red-500 cursor-pointer"><X size={18} /></button>
                                    </div>) : <Link
                                        href={`/conversation/${conv._id}`}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer ${isActive ? "bg-gray-800" : ""}`}
                                    >
                                        <span className={`text-sm truncate mr-2 ${isActive ? "text-white" : "text-zinc-400"}`}>
                                            {conv.title || "Untitled Chat"}
                                        </span>

                                        {/* Action Buttons (Visible on Hover) */}
                                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => handleEditStart(e, conv._id, conv.title)}
                                                className="text-zinc-500 cursor-pointer hover:text-blue-400"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, conv._id)}
                                                className="text-zinc-500 cursor-pointer hover:text-red-400"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </Link>
                                }
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}