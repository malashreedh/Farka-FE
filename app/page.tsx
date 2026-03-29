"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bot,
  Clock3,
  HeartHandshake,
  Languages,
  Mic,
  Send,
  Sparkles,
  Square,
  Wrench,
} from "lucide-react";

import ChatBubble from "@/components/ChatBubble";
import ProfileProgressCard from "@/components/ProfileProgressCard";
import { useLanguage } from "@/components/LanguageProvider";
import LoadingState from "@/components/LoadingState";
import QuickActions from "@/components/QuickActions";
import SkillTag from "@/components/SkillTag";
import VoiceWaveform from "@/components/VoiceWaveform";
import { api } from "@/lib/api";
import { getText } from "@/lib/language";
import type { ChatMessage, Language, TradeCategoryEnum, WorkflowStage } from "@/lib/types";
import { SKILL_TAGS } from "@/lib/types";
import { DISTRICT_ACTIONS, DOMAIN_OPTIONS, PATH_ACTIONS, SAVINGS_ACTIONS } from "@/lib/workflows";

const STAGE_LABELS: Record<WorkflowStage, string> = {
  initial: "Arrival",
  language_set: "Context",
  collecting_basics: "Work Domain",
  collecting_experience: "Experience",
  path_decision: "Direction",
  collecting_skills: "Strengths",
  collecting_business_details: "Business Details",
  profile_complete: "Profile Complete",
  job_matching: "Matching Jobs",
  checklist_generated: "Building Roadmap",
};

function detectLanguage(text: string): Language {
  const nepaliChars = (text.match(/[\u0900-\u097F]/g) ?? []).length;
  return nepaliChars > 2 ? "ne" : "en";
}

function inferTrade(messages: ChatMessage[]): TradeCategoryEnum {
  const combined = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content.toLowerCase())
    .join(" ");

  const tradeRules: Record<TradeCategoryEnum, string[]> = {
    construction: ["construction", "builder", "mason", "site", "plumbing", "electric", "निर्माण"],
    hospitality: ["hotel", "hospitality", "restaurant", "kitchen", "housekeeping", "होटल"],
    manufacturing: ["factory", "machine", "manufacturing", "welding", "assembly", "फ्याक्ट्री"],
    agriculture: ["farm", "agriculture", "crop", "livestock", "harvest", "कृषि"],
    domestic: ["domestic", "caregiver", "childcare", "elder care", "home", "घरेलु"],
    transport: ["driver", "transport", "logistics", "cargo", "fleet", "ड्राइभर"],
    tech: ["it", "developer", "computer", "digital", "support", "प्रविधि"],
    other: [],
  };

  for (const [trade, keywords] of Object.entries(tradeRules) as [TradeCategoryEnum, string[]][]) {
    if (keywords.some((keyword) => combined.includes(keyword))) {
      return trade;
    }
  }

  return "construction";
}

function getLastAssistantMessage(messages: ChatMessage[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "assistant") {
      return messages[index]?.content ?? "";
    }
  }

  return "";
}

function TypingIndicator({ language }: { language: Language }) {
  return (
    <div className="fade-in-up flex gap-3">
      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--accent)] shadow-soft">
        <Bot size={18} />
      </div>
      <div className="rounded-[24px] rounded-tl-md border border-white/8 bg-[color:var(--surface)] px-5 py-4 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted-strong)]">
            {getText("chat_thinking", language)}
          </span>
          <div className="flex gap-1.5">
            <span className="typing-dot" />
            <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
            <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RedirectOverlay({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(8,12,20,0.82)] backdrop-blur-xl">
      <div className="fade-in-up flex max-w-md flex-col items-center rounded-[32px] border border-white/10 bg-[color:var(--surface)] px-8 py-10 text-center shadow-panel">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[color:var(--line-strong)] bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
          <Sparkles size={26} className="animate-pulse" />
        </div>
        <p className="text-lg font-semibold text-[color:var(--text)]">{message}</p>
        <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
          We&apos;re preparing the next view using the profile we just built together.
        </p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { language, setLanguage } = useLanguage();

  const [sessionId, setSessionId] = useState("");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<WorkflowStage>("initial");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [waveformLevels, setWaveformLevels] = useState<number[]>([]);
  const [playingAudio, setPlayingAudio] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const data = await api.startChat();
        setSessionId(data.session_id);
        setStage(data.stage);
        sessionStorage.setItem("farka_session_id", data.session_id);
        setMessages([
          {
            role: "assistant",
            content: data.message,
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch {
        setMessages([
          {
            role: "assistant",
            content: "I couldn't reach the backend just now. Please check the API URL and try again.",
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending, stage]);

  useEffect(() => {
    sessionStorage.setItem("farka_lang", language);
  }, [language]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      void audioContextRef.current?.close().catch(() => undefined);
    };
  }, []);

  const lastAssistantMessage = getLastAssistantMessage(messages).toLowerCase();
  const inferredTrade = inferTrade(messages);
  const visibleSkills = SKILL_TAGS[inferredTrade] ?? [];

  const shouldShowDomainOptions =
    stage === "collecting_basics" &&
    (lastAssistantMessage.includes("type of work") ||
      lastAssistantMessage.includes("work did you do") ||
      lastAssistantMessage.includes("कस्तो काम") ||
      lastAssistantMessage.includes("काम"));

  const shouldShowPathActions =
    stage === "path_decision" &&
    (lastAssistantMessage.includes("job") ||
      lastAssistantMessage.includes("business") ||
      lastAssistantMessage.includes("जागिर") ||
      lastAssistantMessage.includes("व्यवसाय"));

  const shouldShowBusinessDistricts =
    stage === "collecting_business_details" &&
    (lastAssistantMessage.includes("district") || lastAssistantMessage.includes("जिल्ला"));

  const shouldShowBusinessSavings =
    stage === "collecting_business_details" &&
    (lastAssistantMessage.includes("savings") || lastAssistantMessage.includes("बचत"));

  async function submitMessage(overrideMessage?: string) {
    const content = (overrideMessage ?? input).trim();
    if (!content || !sessionId || sending) {
      return;
    }

    const userEntry: ChatMessage = {
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    const optimisticLanguage = messages.length <= 1 ? detectLanguage(content) : language;
    setLanguage(optimisticLanguage);
    setMessages((current) => [...current, userEntry]);
    setInput("");
    setSending(true);

    try {
      const response = await api.sendMessage(sessionId, content);
      const nextLanguage = detectLanguage(response.message);
      setLanguage(nextLanguage);
      setStage(response.stage);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: response.message,
          timestamp: new Date().toISOString(),
        },
      ]);

      if (response.profile_id) {
        setProfileId(response.profile_id);
        sessionStorage.setItem("farka_profile_id", response.profile_id);
      }

      if (response.redirect && response.profile_id) {
        const overlayMessage =
          response.redirect === "jobs"
            ? getText("loading_jobs", nextLanguage)
            : getText("loading_checklist", nextLanguage);
        setRedirectMessage(overlayMessage);

        window.setTimeout(() => {
          if (response.redirect === "jobs") {
            router.push(`/results/jobs?profile_id=${response.profile_id}`);
          } else {
            router.push(`/results/business?profile_id=${response.profile_id}`);
          }
        }, 1400);
      }
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
      window.setTimeout(() => inputRef.current?.focus(), 20);
    }
  }

  function toggleSkill(skill: string) {
    setSelectedSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill],
    );
  }

  async function submitSelectedSkills() {
    if (!selectedSkills.length) {
      return;
    }
    await submitMessage(selectedSkills.join(", "));
  }

  function startVisualizer(stream: MediaStream) {
    const audioContext = new window.AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 32;
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const update = () => {
      analyser.getByteFrequencyData(dataArray);
      setWaveformLevels(Array.from(dataArray.slice(0, 10)).map((value) => Math.max(0.16, value / 255)));
      animationFrameRef.current = requestAnimationFrame(update);
    };

    update();
  }

  async function startRecording() {
    if (!sessionId || sending || recording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];
      startVisualizer(stream);

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
        setRecording(false);
        setSending(true);

        try {
          const response = await api.sendVoiceMessage(sessionId, blob);
          const nextLanguage = detectLanguage(response.message);
          setLanguage(nextLanguage);
          setMessages((current) => [
            ...current,
            { role: "user", content: response.transcript, timestamp: new Date().toISOString() },
            { role: "assistant", content: response.message, timestamp: new Date().toISOString() },
          ]);
          setStage(response.stage);

          if (response.profile_id) {
            setProfileId(response.profile_id);
            sessionStorage.setItem("farka_profile_id", response.profile_id);
          }

          if (response.audio_b64) {
            setPlayingAudio(true);
            const interval = window.setInterval(() => {
              setWaveformLevels(Array.from({ length: 10 }, (_, index) => 0.2 + Math.abs(Math.sin(Date.now() / 180 + index)) * 0.65));
            }, 120);
            const audio = new Audio(`data:${response.audio_mime_type || "audio/mpeg"};base64,${response.audio_b64}`);
            audio.onended = () => {
              window.clearInterval(interval);
              setPlayingAudio(false);
              setWaveformLevels([]);
            };
            audio.onerror = () => {
              window.clearInterval(interval);
              setPlayingAudio(false);
              setWaveformLevels([]);
            };
            void audio.play().catch(() => {
              window.clearInterval(interval);
              setPlayingAudio(false);
              setWaveformLevels([]);
            });
          } else {
            setWaveformLevels([]);
          }

          if (response.redirect && response.profile_id) {
            const overlayMessage =
              response.redirect === "jobs"
                ? getText("loading_jobs", nextLanguage)
                : getText("loading_checklist", nextLanguage);
            setRedirectMessage(overlayMessage);

            window.setTimeout(() => {
              if (response.redirect === "jobs") {
                router.push(`/results/jobs?profile_id=${response.profile_id}`);
              } else {
                router.push(`/results/business?profile_id=${response.profile_id}`);
              }
            }, 1400);
          }
        } catch (error) {
          const detail = error instanceof Error ? error.message : "Voice message failed.";
          setMessages((current) => [
            ...current,
            { role: "assistant", content: detail, timestamp: new Date().toISOString() },
          ]);
          setWaveformLevels([]);
        } finally {
          setSending(false);
        }
      };

      recorder.start();
      setRecording(true);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Microphone access failed.";
      setMessages((current) => [
        ...current,
        { role: "assistant", content: detail, timestamp: new Date().toISOString() },
      ]);
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  if (loading) {
    return (
      <main className="page-shell flex items-center px-6">
        <div className="mx-auto w-full max-w-4xl">
          <LoadingState message="Starting your FARKA session..." />
        </div>
      </main>
    );
  }

  return (
    <>
      {redirectMessage ? <RedirectOverlay message={redirectMessage} /> : null}

      <main className="page-shell">
        <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1.55fr_0.75fr] lg:px-8">
          <div className="panel-raised flex min-h-[75vh] flex-col overflow-hidden rounded-[32px]">
            <header className="flex items-center justify-between border-b border-[color:var(--line)] px-5 py-4 md:px-7">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">
                  फर्क chat
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">
                  Tell us a little about your situation
                </h1>
              </div>
              <div className="hidden rounded-full border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--accent)] md:block">
                {STAGE_LABELS[stage]}
              </div>
            </header>

            <div className="chat-scroll flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-6">
              {messages.map((message, index) => (
                <ChatBubble key={`${message.timestamp}-${index}`} {...message} />
              ))}

              {sending ? <TypingIndicator language={language} /> : null}

              {shouldShowDomainOptions ? (
                <QuickActions
                  title={language === "ne" ? "सामान्य कार्य क्षेत्र छान्नुस्" : "Choose a common work domain"}
                  subtitle={
                    language === "ne"
                      ? "तपाईंको मुख्य कामसँग मिल्ने क्षेत्र रोज्न सक्नुहुन्छ।"
                      : "Pick the closest work domain if typing it out feels slower."
                  }
                  actions={DOMAIN_OPTIONS.map((option) => ({
                    label: language === "ne" ? option.titleNe : option.titleEn,
                    description: language === "ne" ? option.introNe : option.introEn,
                    value: language === "ne" ? option.samplePromptNe : option.samplePromptEn,
                  }))}
                  onSelect={(value) => submitMessage(value)}
                />
              ) : null}

              {stage === "collecting_skills" ? (
                <section className="fade-in-up rounded-[28px] border border-white/8 bg-[color:var(--surface)] p-4 shadow-soft">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--text)]">
                        {getText("skill_tags_prompt", language)}
                      </p>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">
                        {language === "ne"
                          ? "तपाईंले वास्तवमै प्रयोग गरेका सीप छान्नुस्।"
                          : "Pick the strengths you used most often abroad."}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--accent)]">
                      <Wrench size={18} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {visibleSkills.map((skill) => (
                      <SkillTag
                        key={skill}
                        label={skill}
                        selected={selectedSkills.includes(skill)}
                        onToggle={() => toggleSkill(skill)}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={submitSelectedSkills}
                    disabled={!selectedSkills.length || sending}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-[color:var(--ink-strong)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ArrowRight size={16} />
                    Confirm and continue
                  </button>
                </section>
              ) : null}

              {shouldShowPathActions ? (
                <QuickActions
                  title={language === "ne" ? "तपाईंलाई के सहयोग चाहिन्छ?" : "Choose what you want help with"}
                  subtitle={
                    language === "ne"
                      ? "जागिर वा सानो व्यवसाय, जुन अहिले बढी उपयोगी छ त्यो रोज्नुस्।"
                      : "Pick the direction you want FARKA to take next."
                  }
                  actions={(language === "ne" ? PATH_ACTIONS.ne : PATH_ACTIONS.en).map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  onSelect={(value) => submitMessage(value)}
                  compact
                />
              ) : null}

              {shouldShowBusinessDistricts ? (
                <QuickActions
                  title={language === "ne" ? "लक्षित जिल्ला" : "Target district"}
                  subtitle={
                    language === "ne"
                      ? "नेपाल फर्किएपछि काम वा व्यवसाय सुरु गर्न चाहेको जिल्ला छान्नुस्।"
                      : "Choose the district you want to return to first."
                  }
                  actions={(language === "ne" ? DISTRICT_ACTIONS.ne : DISTRICT_ACTIONS.en).map((district) => ({
                    label: district,
                    value: district,
                  }))}
                  onSelect={(value) => submitMessage(value)}
                  compact
                />
              ) : null}

              {shouldShowBusinessSavings ? (
                <QuickActions
                  title={language === "ne" ? "बचतको दायरा" : "Savings band"}
                  subtitle={
                    language === "ne"
                      ? "आफ्नो उपलब्ध बचतको नजिकको दायरा छान्नुस्।"
                      : "Choose the closest savings range so the checklist stays realistic."
                  }
                  actions={(language === "ne" ? SAVINGS_ACTIONS.ne : SAVINGS_ACTIONS.en).map((band) => ({
                    label: band,
                    value: band,
                  }))}
                  onSelect={(value) => submitMessage(value)}
                  compact
                />
              ) : null}

              <div ref={messagesEndRef} />
            </div>

            <footer className="border-t border-[color:var(--line)] bg-[rgba(255,252,247,0.88)] px-4 py-4 backdrop-blur md:px-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <VoiceWaveform active={recording} playing={playingAudio} levels={waveformLevels} />
                <button
                  type="button"
                  onClick={recording ? stopRecording : startRecording}
                  disabled={sending || !sessionId}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    recording
                      ? "bg-[color:var(--accent)] text-white"
                      : "border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--accent)]"
                  } disabled:cursor-not-allowed disabled:opacity-45`}
                >
                  {recording ? <Square size={14} /> : <Mic size={14} />}
                  {recording ? "Stop recording" : "Use voice"}
                </button>
              </div>

              <div className="flex items-end gap-3">
                <div className="flex-1 rounded-[28px] border border-white/10 bg-[color:var(--surface)] px-4 py-3 shadow-soft">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        submitMessage();
                      }
                    }}
                    placeholder={getText("chat_placeholder", language)}
                    disabled={sending || !!redirectMessage}
                    className="w-full bg-transparent text-[15px] text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => submitMessage()}
                  disabled={sending || !input.trim() || !!redirectMessage}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--accent)] text-[color:var(--ink-strong)] shadow-soft transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Send size={18} />
                </button>
              </div>
            </footer>
          </div>

          <aside className="space-y-4">
            <ProfileProgressCard stage={stage} />

            <div className="panel-subtle rounded-[30px] p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">What to expect</p>
              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-white/10 bg-[color:var(--surface-strong)] p-2 text-[color:var(--accent)]">
                    <HeartHandshake size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-[color:var(--muted)]">Friendly guidance</p>
                    <p className="mt-1 text-base font-semibold text-[color:var(--text)]">The chat keeps things simple and asks only what matters next.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-white/10 bg-[color:var(--surface-strong)] p-2 text-[color:var(--terracotta)]">
                    <Clock3 size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-[color:var(--muted)]">Quick to complete</p>
                    <p className="mt-1 text-base font-semibold text-[color:var(--text)]">Most people can reach results in just a few messages.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-white/10 bg-[color:var(--surface-strong)] p-2 text-[color:var(--saffron)]">
                    <Languages size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-[color:var(--muted)]">Language support</p>
                    <p className="mt-1 text-base font-semibold text-[color:var(--text)]">
                      You can continue in {language === "ne" ? "Nepali" : "English"}.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel-subtle rounded-[30px] p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">A few tips</p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
                <p className="flex gap-3">
                  <Sparkles size={16} className="mt-1 shrink-0 text-[color:var(--accent)]" />
                  You can type naturally, and suggested choices will only appear when they are helpful.
                </p>
                <p className="flex gap-3">
                  <ArrowRight size={16} className="mt-1 shrink-0 text-[color:var(--terracotta)]" />
                  If you already know what you want, say it directly and FARKA will move faster.
                </p>
              </div>
            </div>

            <div className="panel-subtle rounded-[30px] p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">Voice reply</p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                Record in Nepali or English. Farka will transcribe your message and play the response back when audio is available.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}