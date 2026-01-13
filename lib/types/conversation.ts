export type Message = {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type Conversation = {
  _id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
};
