"use client";

import { Bot, UserRound } from "lucide-react";

type Props = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

export default function ChatBubble({ role, content, timestamp }: Props) {
  const isUser = role === "user";

  return (
    <div className={`fade-in-up flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser ? (
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--accent)] shadow-soft">
          <Bot size={18} />
        </div>
      ) : null}

      <div
        className={`max-w-[82%] rounded-[24px] px-5 py-4 shadow-soft ${
          isUser
            ? "rounded-tr-md bg-[color:var(--accent)] text-[color:var(--ink-strong)]"
            : "rounded-tl-md border border-white/8 bg-[color:var(--surface)] text-[color:var(--text)]"
        }`}
      >
        <p className="whitespace-pre-wrap text-[15px] leading-7">{content}</p>
        <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] opacity-60">
          {isUser ? <UserRound size={12} /> : <Bot size={12} />}
          <span>{timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : isUser ? "You" : "Farka"}</span>
        </div>
      </div>
    </div>
  );
}
