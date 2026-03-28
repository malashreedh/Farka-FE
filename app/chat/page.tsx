"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getText } from "@/lib/language";
import type { Language, WorkflowStage, TradeCategoryEnum } from "@/lib/types";
import { SKILL_TAGS } from "@/lib/types";

// ─── Stage display label ──────────────────────────────────────────────────────
const STAGE_LABELS: Record<WorkflowStage, string> = {
  initial:                    "Welcome",
  language_set:               "Getting Started",
  collecting_basics:          "Your Background",
  collecting_experience:      "Your Experience",
  path_decision:              "Your Goal",
  collecting_skills:          "Your Skills",
  collecting_business_details:"Business Details",
  profile_complete:           "Profile Ready",
  job_matching:               "Finding Jobs...",
  checklist_generated:        "Plan Ready",
};

// ─── Skill Tag pill ───────────────────────────────────────────────────────────
function SkillTag({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 focus:outline-none"
      style={{
        background: selected ? "var(--amber)" : "rgba(245,158,11,0.08)",
        borderColor: selected ? "var(--amber)" : "rgba(245,158,11,0.3)",
        color: selected ? "#0a1628" : "var(--amber)",
        transform: selected ? "scale(1.05)" : "scale(1)",
      }}
      aria-pressed={selected}
    >
      {selected && <span className="mr-1">✓</span>}
      {label}
    </button>
  );
}

// ─── Chat Bubble ──────────────────────────────────────────────────────────────
function ChatBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} chat-bubble-in`}>
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mr-3 mt-1"
          style={{ background: "var(--teal)", color: "#fff" }}
        >
          F
        </div>
      )}
      <div
        className="max-w-[78%] px-5 py-3 rounded-2xl shadow-lg leading-relaxed text-sm md:text-base"
        style={
          isUser
            ? {
                background: "var(--amber)",
                color: "#0a1628",
                borderTopRightRadius: "4px",
                fontWeight: 500,
              }
            : {
                background: "rgba(26,158,126,0.18)",
                border: "1px solid rgba(26,158,126,0.3)",
                color: "#f1f5f9",
                borderTopLeftRadius: "4px",
              }
        }
      >
        {content}
      </div>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator({ lang }: { lang: Language }) {
  return (
    <div className="flex justify-start items-center gap-3 chat-bubble-in">
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
        style={{ background: "var(--teal)", color: "#fff" }}
      >
        F
      </div>
      <div
        className="px-5 py-3 rounded-2xl flex items-center gap-1"
        style={{
          background: "rgba(26,158,126,0.12)",
          border: "1px solid rgba(26,158,126,0.2)",
        }}
      >
        <span className="text-xs text-white/40 mr-2">{getText("chat_thinking", lang)}</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-teal-400 typing-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Redirect overlay ─────────────────────────────────────────────────────────
function RedirectOverlay({ message }: { message: string }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
      style={{ background: "rgba(10,22,40,0.96)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: "var(--teal)", borderTopColor: "transparent" }}
      />
      <p
        className="text-lg font-semibold animate-pulse"
        style={{ color: "var(--teal)" }}
      >
        {message}
      </p>
    </div>
  );
}

// ─── Main Chat Page ───────────────────────────────────────────────────────────
export default function ChatPage() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [stage, setStage] = useState<WorkflowStage>("initial");
  const [lang, setLang] = useState<Language>("en");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [redirecting, setRedirecting] = useState<string | null>(null);

  // Skill tag state — shown when stage === "collecting_skills"
  const [tradeCategory, setTradeCategory] = useState<TradeCategoryEnum | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [skillsConfirmed, setSkillsConfirmed] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // ── Init session on mount ────────────────────────────────────────────────
  useEffect(() => {
    const initChat = async () => {
      try {
        // Restore from sessionStorage if page was refreshed mid-chat
        const savedSession = sessionStorage.getItem("farka_session_id");
        const savedProfile = sessionStorage.getItem("farka_profile_id");

        if (savedSession) {
          // Session exists — we can't replay history without a GET /chat/session endpoint,
          // so we start fresh but keep profile_id for results pages.
          setSessionId(savedSession);
          if (savedProfile) setProfileId(savedProfile);
        }

        const data = await api.startChat();
        setSessionId(data.session_id);
        setStage(data.stage);
        sessionStorage.setItem("farka_session_id", data.session_id);
        setMessages([{ role: "assistant", content: data.message }]);
      } catch (err) {
        console.error("Failed to start chat:", err);
        setMessages([
          {
            role: "assistant",
            content:
              "Namaste! I'm having trouble connecting right now. Please refresh the page to try again.",
          },
        ]);
      } finally {
        setInitializing(false);
      }
    };
    initChat();
  }, []);

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Detect language from bot responses ──────────────────────────────────
  const detectLang = useCallback((text: string): Language => {
    const nepaliChars = (text.match(/[\u0900-\u097F]/g) || []).length;
    return nepaliChars > 2 ? "ne" : "en";
  }, []);

  // ── Send message ─────────────────────────────────────────────────────────
  const handleSendMessage = async (overrideText?: string) => {
    const text = overrideText ?? input.trim();
    if (!text || !sessionId || loading) return;

    if (!overrideText) setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      // KEY FIX: body field is "content" not "message"
      const response = await api.sendMessage(sessionId, text);

      setMessages((prev) => [...prev, { role: "assistant", content: response.message }]);
      setStage(response.stage);

      // Detect language from bot reply
      const detectedLang = detectLang(response.message);
      setLang(detectedLang);

      // Store profile_id whenever backend sends it
      if (response.profile_id) {
        setProfileId(response.profile_id);
        sessionStorage.setItem("farka_profile_id", response.profile_id);
      }

      // Handle redirects with a loading overlay
      if (response.redirect === "jobs") {
        setRedirecting(getText("loading_jobs", detectedLang));
        setTimeout(() => {
          router.push(`/results/jobs?profile_id=${response.profile_id}`);
        }, 2000);
      } else if (response.redirect === "checklist") {
        setRedirecting(getText("loading_checklist", detectedLang));
        setTimeout(() => {
          router.push(`/results/business?profile_id=${response.profile_id}`);
        }, 2000);
      }

      // Unlock skill tag UI when entering collecting_skills stage
      if (response.stage === "collecting_skills") {
        // Try to derive trade from profile — for now show all possible construction tags
        // The backend message will contain the relevant trade; we'll surface generic tags
        setSkillsConfirmed(false);
        setSelectedSkills(new Set());
      }
    } catch (err) {
      console.error("Message error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  // ── Confirm selected skills by sending them as a message ──────────────
  const handleConfirmSkills = () => {
    if (selectedSkills.size === 0) return;
    const skillList = Array.from(selectedSkills).join(", ");
    setSkillsConfirmed(true);
    handleSendMessage(`My skills are: ${skillList}`);
  };

  // ── Determine which skill tags to show ────────────────────────────────
  // We show tags for the detected trade, falling back to construction
  const visibleSkillTags: string[] =
    stage === "collecting_skills" && !skillsConfirmed
      ? SKILL_TAGS[tradeCategory ?? "construction"]
      : [];

  // ─────────────────────────────────────────────────────────────────────────
  if (initializing) {
    return (
      <div
        className="flex flex-col items-center justify-center h-[calc(100vh-80px)]"
        style={{ background: "var(--navy)" }}
      >
        <div
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mb-4"
          style={{ borderColor: "var(--teal)", borderTopColor: "transparent" }}
        />
        <p className="text-sm animate-pulse" style={{ color: "var(--teal)" }}>
          Starting your journey...
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .chat-bubble-in {
          animation: bubbleIn 0.3s ease both;
        }
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%           { transform: translateY(-5px); opacity: 1; }
        }
        .typing-dot {
          animation: typingBounce 1.2s ease-in-out infinite;
        }
      `}</style>

      {redirecting && <RedirectOverlay message={redirecting} />}

      <div
        className="flex flex-col h-[calc(100vh-80px)]"
        style={{ background: "var(--navy)" }}
      >
        {/* ── Top bar with stage indicator ── */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b"
          style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(10,22,40,0.8)", backdropFilter: "blur(8px)" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="font-bold text-lg tracking-tight"
              style={{ color: "var(--teal)", fontFamily: "'DM Sans', sans-serif" }}
            >
              FARKA फर्क
            </span>
          </div>
          {/* Stage indicator — spec requirement */}
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: stage === "job_matching" || stage === "checklist_generated" ? "var(--amber)" : "var(--teal)" }}
            />
            <span
              className="text-xs tracking-wide"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {STAGE_LABELS[stage] ?? stage}
            </span>
          </div>
        </div>

        {/* ── Messages area ── */}
        <main
          className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5 mesh-bg"
        >
          <div className="max-w-3xl mx-auto space-y-5">
            {messages.map((msg, idx) => (
              <ChatBubble key={idx} role={msg.role} content={msg.content} />
            ))}

            {/* Typing indicator while waiting for response */}
            {loading && <TypingIndicator lang={lang} />}

            {/* ── Skill tag picker — shown at collecting_skills stage ── */}
            {visibleSkillTags.length > 0 && (
              <div
                className="p-5 rounded-2xl chat-bubble-in"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p
                  className="text-sm font-semibold mb-3"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {getText("skill_tags_prompt", lang)}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {visibleSkillTags.map((tag) => (
                    <SkillTag
                      key={tag}
                      label={tag}
                      selected={selectedSkills.has(tag)}
                      onToggle={() => {
                        setSelectedSkills((prev) => {
                          const next = new Set(prev);
                          if (next.has(tag)) next.delete(tag);
                          else next.add(tag);
                          return next;
                        });
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={handleConfirmSkills}
                  disabled={selectedSkills.size === 0 || loading}
                  className="px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 disabled:opacity-40"
                  style={{ background: "var(--teal)", color: "#fff" }}
                >
                  Confirm Skills ({selectedSkills.size} selected)
                </button>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </main>

        {/* ── Input bar ── */}
        <footer
          className="px-4 py-4 border-t sticky bottom-0"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "rgba(10,22,40,0.95)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="max-w-3xl mx-auto relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={getText("chat_placeholder", lang)}
              disabled={loading || !!redirecting}
              className="w-full rounded-full px-6 py-4 pr-16 text-sm focus:outline-none transition-all duration-200 disabled:opacity-50"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f1f5f9",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(26,158,126,0.5)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim() || !!redirecting}
              aria-label="Send message"
              className="absolute right-2 top-2 bottom-2 aspect-square rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
              style={{ background: "var(--teal)" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          {/* Character count hint */}
          {input.length > 400 && (
            <p className="text-center text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              {500 - input.length} characters remaining
            </p>
          )}
        </footer>
      </div>
    </>
  );
}