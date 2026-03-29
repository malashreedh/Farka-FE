"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Bot, Send } from "lucide-react";

import ChatBubble from "@/components/ChatBubble";
import { useLanguage } from "@/components/LanguageProvider";
import { api } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

export default function ResultsFollowUpChat() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const sessionId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem("farka_session_id") ?? "";
  }, []);

  async function handleSend() {
    const content = input.trim();
    if (!content || !sessionId || sending) {
      return;
    }

    const userEntry: ChatMessage = {
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((current) => [...current, userEntry]);
    setInput("");
    setSending(true);

    try {
      const response = await api.sendMessage(sessionId, content);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: response.message,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Something went wrong.";
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: detail,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  if (!sessionId) {
    return null;
  }

  return (
    <section className="panel-subtle rounded-[30px] p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--accent)]">
            <Bot size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-strong)]">
              {language === "ne" ? "च्याट अझै सक्रिय छ" : "Chat is still active"}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-[color:var(--text)]">
              {language === "ne" ? "यहीँबाट थप कुरा सोध्नुस्" : "Ask follow-up questions here"}
            </h3>
          </div>
        </div>
        <a
          href="/chat"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)]"
        >
          {language === "ne" ? "पूरा च्याट खोल्नुहोस्" : "Open full chat"}
          <ArrowUpRight size={15} />
        </a>
      </div>

      <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
        {language === "ne"
          ? "तपाईंको पुरानो सन्दर्भ जस्ताको तस्तै छ। अब जागिर, व्यवसाय, कागजपत्र, वा पैसाको योजनाबारे थप प्रश्न सोध्न सक्नुहुन्छ।"
          : "Your earlier context is still available. You can keep asking about jobs, business planning, documents, or funding without starting over."}
      </p>

      {messages.length ? (
        <div className="mt-5 space-y-4">
          {messages.map((message, index) => (
            <ChatBubble key={`${message.timestamp}-${index}`} {...message} />
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex items-center gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleSend();
            }
          }}
          placeholder={
            language === "ne"
              ? "यहाँ थप प्रश्न लेख्नुहोस्..."
              : "Ask a follow-up question here..."
          }
          className="h-12 flex-1 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-5 text-sm text-[color:var(--text)] outline-none transition focus:border-[color:var(--accent)]"
        />
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={sending || !input.trim()}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--accent)] text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} />
        </button>
      </div>
    </section>
  );
}
