import mongoose, { Schema } from "mongoose";
import MessageSchema from "./message";

const ConversationSchema = new Schema(
  {
    // _id কে String হিসেবে ডিফাইন করুন
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    _id: false, // মঙ্গোসকে বলুন আমরা ম্যানুয়ালি _id দিচ্ছি
  }
);

export const Conversations =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
