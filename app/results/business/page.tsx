"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { getText } from "@/lib/language";
import Link from "next/link";
import type { BusinessChecklist, ChecklistItem, Language } from "@/lib/types";

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {label}
          </span>
          <span className="text-sm font-bold" style={{ color: "var(--amber)" }}>
            {value}%
          </span>
        </div>
      )}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            background: "linear-gradient(90deg, var(--teal), var(--amber))",
          }}
        />
      </div>
    </div>
  );
}

// ─── Single checklist item ────────────────────────────────────────────────────
function ChecklistItemRow({
  item,
  index,
  checklistId,
  onToggle,
}: {
  item: ChecklistItem;
  index: number;
  checklistId: string;
  onToggle: (index: number, done: boolean) => void;
}) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle(index, !item.done);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      className="group flex items-start gap-4 p-5 rounded-xl transition-all duration-200"
      style={{
        background: item.done
          ? "rgba(26,158,126,0.06)"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${item.done ? "rgba(26,158,126,0.2)" : "rgba(255,255,255,0.07)"}`,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        aria-label={item.done ? "Mark as incomplete" : "Mark as complete"}
        className="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 mt-0.5 focus:outline-none"
        style={{
          borderColor: item.done ? "var(--teal)" : "rgba(255,255,255,0.2)",
          background: item.done ? "var(--teal)" : "transparent",
        }}
      >
        {item.done && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p
            className="text-sm font-semibold leading-snug"
            style={{
              color: item.done ? "rgba(255,255,255,0.4)" : "#f1f5f9",
              textDecoration: item.done ? "line-through" : "none",
            }}
          >
            {item.task}
          </p>
        </div>
        {/* Category badge */}
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
            color: "var(--amber)",
          }}
        >
          {item.category}
        </span>
      </div>
    </div>
  );
}

// ─── Week section (collapsible) ───────────────────────────────────────────────
function WeekSection({
  week,
  items,
  startIndex,
  checklistId,
  lang,
  onToggle,
}: {
  week: number;
  items: ChecklistItem[];
  startIndex: number;
  checklistId: string;
  lang: Language;
  onToggle: (index: number, done: boolean) => void;
}) {
  const [open, setOpen] = useState(true);
  const doneCount = items.filter((i) => i.done).length;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Week header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors duration-200 focus:outline-none"
        style={{ background: "rgba(255,255,255,0.04)" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")
        }
      >
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "rgba(245,158,11,0.15)", color: "var(--amber)" }}
          >
            {week}
          </span>
          <span className="font-semibold text-white">
            {getText("week_label", lang)} {week}
          </span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {doneCount}/{items.length} done
          </span>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="transition-transform duration-200"
          style={{
            color: "rgba(255,255,255,0.3)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Items */}
      {open && (
        <div className="p-4 space-y-3" style={{ background: "rgba(10,22,40,0.5)" }}>
          {items.map((item, i) => (
            <ChecklistItemRow
              key={i}
              item={item}
              index={startIndex + i}
              checklistId={checklistId}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Loading state ─────────────────────────────────────────────────────────────
function LoadingState({ message, lang }: { message?: string; lang: Language }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <div
        className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: "var(--amber)", borderTopColor: "transparent" }}
      />
      <p
        className="text-base font-semibold animate-pulse text-center max-w-xs"
        style={{ color: "var(--amber)" }}
      >
        {message ?? getText("loading_checklist", lang)}
      </p>
    </div>
  );
}

// ─── Main content ──────────────────────────────────────────────────────────────
function BusinessContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("profile_id");

  const [checklist, setChecklist] = useState<BusinessChecklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lang: Language = "en";

  useEffect(() => {
    if (!profileId) {
      setError("No profile ID found. Please complete the chat first.");
      setLoading(false);
      return;
    }

    const fetchChecklist = async () => {
      try {
        // FIXED: GET /business/checklist/{profile_id} — path param
        const existing = await api.getChecklist(profileId);
        setChecklist(existing);
      } catch {
        // 404 or similar — generate a new one
        // POST /business/checklist  body: {profile_id}
        try {
          const generated = await api.generateChecklist(profileId);
          setChecklist(generated);
        } catch (genErr) {
          console.error("Checklist generation failed:", genErr);
          setError("Could not generate your business roadmap. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, [profileId]);

  // SPEC: toggle checkbox calls PATCH /business/checklist/item
  const handleToggle = async (itemIndex: number, done: boolean) => {
    if (!checklist) return;
    try {
      const updated = await api.toggleChecklistItem(checklist.id, itemIndex, done);
      setChecklist(updated);
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  if (loading) return <LoadingState lang={lang} />;

  if (error || !checklist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
        <p className="text-white/50">{error ?? "Something went wrong."}</p>
        <Link href="/chat" className="text-sm hover:underline" style={{ color: "var(--teal)" }}>
          {getText("return_to_chat", lang)}
        </Link>
      </div>
    );
  }

  const items = checklist.checklist_items ?? [];
  const doneCount = items.filter((i) => i.done).length;
  const progressPct = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;

  // SPEC: Group by week
  const byWeek: Record<number, { item: ChecklistItem; globalIndex: number }[]> = {};
  items.forEach((item, idx) => {
    if (!byWeek[item.week]) byWeek[item.week] = [];
    byWeek[item.week].push({ item, globalIndex: idx });
  });
  const sortedWeeks = Object.keys(byWeek)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
            color: "var(--amber)",
          }}
        >
          Entrepreneurship Path
        </div>

        <h1
          className="font-bold text-white leading-tight mb-3"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontFamily: "'DM Sans', sans-serif" }}
        >
          {getText("your_checklist", lang)}
          <span style={{ color: "var(--amber)" }}>.</span>
        </h1>

        {(checklist.trade || checklist.district) && (
          <p className="text-base mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
            Your guide to launching{" "}
            <span className="text-white font-medium">{checklist.trade}</span>
            {checklist.district ? ` in ${checklist.district}` : ""}.
          </p>
        )}

        {/* SPEC: Progress bar showing % complete */}
        <div
          className="p-5 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <ProgressBar
            value={progressPct}
            label={`${doneCount} of ${items.length} ${getText("progress_label", lang)}`}
          />
        </div>
      </header>

      {/* SPEC: Grouped by week, collapsible sections */}
      <div className="space-y-4">
        {sortedWeeks.map((week) => {
          const weekEntries = byWeek[week];
          return (
            <WeekSection
              key={week}
              week={week}
              items={weekEntries.map((e) => e.item)}
              startIndex={weekEntries[0].globalIndex}
              checklistId={checklist.id}
              lang={lang}
              onToggle={handleToggle}
            />
          );
        })}
      </div>

      {/* Footer CTA */}
      <div
        className="mt-14 p-8 rounded-3xl text-center"
        style={{
          background: "linear-gradient(135deg, rgba(26,158,126,0.12), rgba(10,22,40,0))",
          border: "1px solid rgba(26,158,126,0.2)",
        }}
      >
        <h4 className="text-white font-bold text-lg mb-2">
          {getText("need_finance", lang)}
        </h4>
        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
          {getText("finance_sub", lang)}
        </p>
        <button
          className="px-8 py-3 rounded-full font-bold text-white transition-all hover:scale-105 active:scale-95"
          style={{ background: "var(--teal)" }}
        >
          {getText("connect_mentor", lang)}
        </button>
      </div>
    </div>
  );
}

// ─── Page (Suspense required for useSearchParams in Next.js 14) ───────────────
export default function BusinessChecklistPage() {
  return (
    <main
      className="min-h-screen mesh-bg"
      style={{ background: "var(--navy)", color: "#f1f5f9" }}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: "var(--amber)", borderTopColor: "transparent" }}
            />
          </div>
        }
      >
        <BusinessContent />
      </Suspense>
    </main>
  );
}