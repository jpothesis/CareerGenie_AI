"use client";

import { useState } from "react";
import { Bot, SendHorizontal } from "lucide-react";
import api from '@lib/axios'; // axios instance

interface Message {
  type: "user" | "bot";
  text: string;
}

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/assistant/ask", { prompt: userMessage.text });
      const botMessage: Message = {
        type: "bot",
        text: res.data.response || "No response received.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("❌ Assistant Error:", err);
      setError("Could not reach assistant. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="col-span-12 p-4 rounded border border-stone-300 bg-white shadow-sm flex flex-col h-[500px]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b pb-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
          <Bot className="w-5 h-5 text-violet-600" />
          CareerGenie Assistant
        </h3>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.type === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && <p className="text-gray-400 text-sm">Assistant is typing...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Input */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask anything about your career..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-4 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
        <button
          onClick={handleSend}
          className="bg-violet-600 hover:bg-violet-700 text-white p-2 rounded-md transition"
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Assistant;
