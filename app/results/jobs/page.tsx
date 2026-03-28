"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { getText } from "@/lib/language";
import Link from "next/link";
import type { JobMatch, Language } from "@/lib/types";

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] uppercase tracking-widest text-white/30">{label}</span>
          <span className="text-sm font-bold" style={{ color: "var(--teal)" }}>
            {value}%
          </span>
        </div>
      )}
      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            background:
              value >= 75
                ? "var(--teal)"
                : value >= 50
                ? "var(--amber)"
                : "rgba(255,255,255,0.3)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Org type colors ──────────────────────────────────────────────────────────
const ORG_COLORS: Record<string, string> = {
  government: "rgba(96,165,250,0.15)",
  ngo:        "rgba(167,139,250,0.15)",
  private:    "rgba(26,158,126,0.15)",
};
const ORG_TEXT: Record<string, string> = {
  government: "#60a5fa",
  ngo:        "#a78bfa",
  private:    "var(--teal)",
};

// ─── Job Card (FIXED Syntax) ──────────────────────────────────────────────────
function JobCard({ job, match_score, matched_tags, lang }: JobMatch & { lang: Language }) {
  const percentage = Math.round(match_score * 100);

  return (
    <div
      className="group relative rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-lg leading-snug group-hover:text-teal-400 transition-colors truncate">
            {job.title}
          </h3>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            {job.org_name}
          </p>
        </div>

        <span
          className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{
            background: ORG_COLORS[job.org_type] ?? "rgba(255,255,255,0.08)",
            color: ORG_TEXT[job.org_type] ?? "rgba(255,255,255,0.5)",
            border: `1px solid ${ORG_TEXT[job.org_type] ?? "rgba(255,255,255,0.1)"}33`,
          }}
        >
          {job.org_type}
        </span>
      </div>

      <ProgressBar value={percentage} label={getText("match_score", lang)} />

      {matched_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {matched_tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md"
              style={{
                background: "rgba(26,158,126,0.12)",
                border: "1px solid rgba(26,158,126,0.25)",
                color: "var(--teal)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "rgba(255,255,255,0.55)" }}>
        {job.description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>📍 {job.district}</span>
          {job.salary_range && (
            <span className="text-xs font-medium" style={{ color: "var(--amber)" }}>{job.salary_range}</span>
          )}
        </div>
        <Link
          href={job.apply_url || "#"}
          className="text-xs font-bold transition-all hover:underline"
          style={{ color: "var(--amber)" }}
        >
          {getText("view_details", lang)}
        </Link>
      </div>
    </div>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────
function LoadingState({ lang }: { lang: Language }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <div className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "var(--teal)", borderTopColor: "transparent" }} />
      <p className="text-base font-semibold animate-pulse text-center" style={{ color: "var(--teal)" }}>
        {getText("loading_jobs", lang)}
      </p>
    </div>
  );
}

// ─── Results Content ──────────────────────────────────────────────────────────
function ResultsContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("profile_id");

  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    // Persist language from chat
    const savedLang = sessionStorage.getItem("farka_lang") as Language;
    if (savedLang) setLang(savedLang);

    if (!profileId) {
      setError("No profile ID found. Please complete the chat first.");
      setLoading(false);
      return;
    }

    const fetchMatches = async () => {
      try {
        const existing = await api.getJobMatches(profileId);
        if (existing && existing.length > 0) {
          setMatches(existing);
        } else {
          const fresh = await api.triggerJobMatch(profileId);
          setMatches(fresh ?? []);
        }
      } catch (err) {
        console.error("Error fetching job matches:", err);
        setError("Could not load job matches.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [profileId]);

  if (loading) return <LoadingState lang={lang} />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <p className="text-white/50">{error}</p>
        <Link href="/chat" style={{ color: "var(--teal)" }} className="hover:underline text-sm">
          {getText("return_to_chat", lang)}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: "rgba(26,158,126,0.1)", border: "1px solid rgba(26,158,126,0.2)", color: "var(--teal)" }}>
          {matches.length} Opportunities Found
        </div>
        <h1 className="font-bold text-white leading-tight mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
          {getText("job_matches", lang)}<span style={{ color: "var(--teal)" }}>.</span>
        </h1>
        <p className="max-w-xl text-base" style={{ color: "rgba(255,255,255,0.45)" }}>
          Based on your experience abroad, we found these opportunities in Nepal.
        </p>
      </header>

      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((m, idx) => (
            <JobCard
              key={idx}
              job={m.job}
              match_score={m.match_score}
              matched_tags={m.matched_tags}
              lang={lang}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl p-12 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-white/40 mb-4">{getText("no_matches", lang)}</p>
        </div>
      )}
    </div>
  );
}

export default function JobResultsPage() {
  return (
    <main className="min-h-screen mesh-bg" style={{ background: "var(--navy)", color: "#f1f5f9" }}>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <ResultsContent />
      </Suspense>
    </main>
  );
}