import React, { useState, useRef, useEffect } from "react";
import { getGeminiResponse } from "../services/geminiService";
import { Bot, User, Send, Loader2, X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "Hello! I'm your Maddy Medicore AI Assistant. How can I help you today? You can ask me about symptoms or hospital departments." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(userMessage);
      setMessages((prev) => [...prev, { role: "ai", content: response || "I'm sorry, I couldn't generate a response." }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I'm having trouble connecting to my brain right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-green-600 text-white rounded-full shadow-2xl hover:bg-green-700 transition-all z-50 group"
      >
        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-100"
          >
            {/* Header */}
            <div className="p-4 bg-green-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Maddy Medicore AI Assistant</h3>
                  <p className="text-[10px] text-green-100">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-green-600 text-white rounded-tr-none"
                        : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {msg.role === "user" ? (
                        <User className="w-3 h-3 opacity-70" />
                      ) : (
                        <Bot className="w-3 h-3 text-green-600" />
                      )}
                      <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">
                        {msg.role === "user" ? "You" : "MediAI"}
                      </span>
                    </div>
                    <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-p:my-1">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                    <span className="text-xs text-slate-500">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your symptoms or questions..."
                  className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 transition-all outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                AI can make mistakes. Consult a doctor for medical emergencies.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
