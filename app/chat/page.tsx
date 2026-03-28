"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 1. Initialize session on mount
  useEffect(() => {
    const initChat = async () => {
      try {
        const data = await api.startChat();
        setSessionId(data.session_id);
        setMessages([{ role: "assistant", content: data.message }]);
      } catch (err) {
        console.error("Failed to start chat", err);
      }
    };
    initChat();
  }, []);

  // 2. Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !sessionId || loading) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    try {
      const response = await api.sendMessage(sessionId, userText);
      setMessages((prev) => [...prev, { role: "assistant", content: response.message }]);

      if (response.redirect === "jobs") {
        router.push(`/results/jobs?profile_id=${response.profile_id}`);
      } else if (response.redirect === "checklist") {
        router.push(`/results/business?profile_id=${response.profile_id}`);
      }
    } catch (err) {
      console.error("Message error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Calc ensures chat takes up exactly the remaining space below the Navbar */
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[var(--navy)] text-white font-sans">
      
      {/* ── Chat Messages ── */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 mesh-bg">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] px-5 py-3 rounded-2xl shadow-xl leading-relaxed text-sm md:text-base ${
                msg.role === "user" 
                  ? "bg-[var(--amber)] text-black rounded-tr-none" 
                  : "bg-[var(--teal)] text-white rounded-tl-none"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white/5 px-4 py-2 rounded-full text-xs text-white/40">
                FARKA is thinking...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </main>

      {/* ── Input Bar ── */}
      <footer className="p-4 bg-[var(--navy)] border-t border-white/10 sticky bottom-0">
        <div className="max-w-3xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message in English or Nepali..."
            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 pr-16 focus:outline-none focus:border-[var(--teal)] transition-all placeholder:text-white/20"
          />
          <button 
            onClick={handleSendMessage}
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-[var(--teal)] rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}