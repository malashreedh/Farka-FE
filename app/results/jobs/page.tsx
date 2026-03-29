"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CircleGauge,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { useLanguage } from "@/components/LanguageProvider";
import type { JobDensity } from "@/lib/types";
import LoadingState from "@/components/LoadingState";
import { api } from "@/lib/api";
import { getText } from "@/lib/language";
import type { JobMatch } from "@/lib/types";

const JobDensityMap = dynamic(() => import("@/components/JobDensityMap"), { ssr: false });

function MatchBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,var(--terracotta),var(--accent))] transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function JobCard({ match, language }: { match: JobMatch; language: "en" | "ne" }) {
  const percentage = Math.round(match.match_score * 100);
  const [expanded, setExpanded] = useState(false);
  const hasExternalUrl = Boolean(match.job.apply_url && /^https?:\/\//.test(match.job.apply_url));

  return (
    <article className="panel-subtle rounded-[28px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-strong)]">{match.job.org_type}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">{match.job.title}</h3>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{match.job.org_name}</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--line-strong)] bg-[color:var(--accent-soft)] px-3 py-2 text-right">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">Match</p>
          <p className="mt-1 text-lg font-semibold text-[color:var(--accent)]">{percentage}%</p>
        </div>
      </div>

      <div className="mt-5">
        <MatchBar value={percentage} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {match.matched_tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-[color:var(--surface)] px-3 py-1 text-xs font-medium text-[color:var(--text)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{match.job.description}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-[color:var(--muted)]">
          <span className="inline-flex items-center gap-2">
            <MapPin size={15} className="text-[color:var(--terracotta)]" />
            {match.job.district}
          </span>
          {match.job.salary_range ? (
            <span className="inline-flex items-center gap-2">
              <CircleGauge size={15} className="text-[color:var(--accent)]" />
              {match.job.salary_range}
            </span>
          ) : null}
        </div>

        {hasExternalUrl ? (
          <a
            href={match.job.apply_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)] transition hover:brightness-110"
          >
            {getText("view_details", language)}
            <ArrowRight size={15} />
          </a>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)] transition hover:brightness-110"
          >
            {expanded ? "Hide details" : "More details"}
            <ArrowRight size={15} className={expanded ? "rotate-90 transition-transform" : "transition-transform"} />
          </button>
        )}
      </div>

      {!hasExternalUrl && expanded ? (
        <div className="mt-4 rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface)] p-4 text-sm leading-7 text-[color:var(--muted)]">
          <p className="font-semibold text-[color:var(--text)]">{match.job.title}</p>
          <p className="mt-2">
            {language === "ne"
              ? "यो भूमिकाको बाह्य आवेदन लिंक अहिले उपलब्ध छैन। तर यो सूचीमा किन परेको हो भनेर तलको विवरणबाट बुझ्न सकिन्छ।"
              : "A direct application link is not available yet, but the role details below explain why this match appears in your shortlist."}
          </p>
          <p className="mt-2">
            {language === "ne"
              ? `संगठन: ${match.job.org_name} • जिल्ला: ${match.job.district}`
              : `Organization: ${match.job.org_name} • District: ${match.job.district}`}
          </p>
        </div>
      ) : null}
    </article>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("profile_id");
  const { language } = useLanguage();

  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [density, setDensity] = useState<JobDensity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) {
      setError("Missing profile ID. Please complete the chat first.");
      setLoading(false);
      return;
    }

    const fetchMatches = async () => {
      try {
        const densityRows = await api.getJobDensity();
        setDensity(densityRows);
        const existing = await api.getJobMatches(profileId);
        if (existing.length > 0) {
          setMatches(existing);
        } else {
          const generated = await api.triggerJobMatch(profileId);
          setMatches(generated);
        }
      } catch (err) {
        console.error(err);
        setError("We could not load job matches right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [profileId]);

  if (loading) {
    return <LoadingState message={getText("loading_jobs", language)} />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="panel-subtle rounded-[32px] p-8">
          <p className="text-lg text-[color:var(--text)]">{error}</p>
          <Link href="/chat" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)]">
            {getText("return_to_chat", language)}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="panel-raised rounded-[32px] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--accent)]">
              <BriefcaseBusiness size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">Job results</p>
              <h1 className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--text)]">{getText("job_matches", language)}</h1>
            </div>
          </div>

          <p className="mt-6 text-lg leading-8 text-[color:var(--muted)]">
            These roles were matched against the profile built in chat. The goal is to keep the list believable, locally grounded, and easy to scan.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">Roles found</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[color:var(--accent)]">{matches.length}</p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">Best fit</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[color:var(--terracotta)]">
                {matches.length ? `${Math.round(matches[0].match_score * 100)}%` : "--"}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">Signal</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--text)]">
                <ShieldCheck size={16} className="text-[color:var(--sage)]" />
                Profile-aware matching
              </p>
            </div>
          </div>
        </section>

        <section className="panel-subtle rounded-[32px] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Building2 size={18} className="text-[color:var(--terracotta)]" />
            <p className="text-sm font-semibold text-[color:var(--text)]">Why this list feels tighter</p>
          </div>
          <div className="mt-4 space-y-4 text-sm leading-7 text-[color:var(--muted)]">
            <p>We keep the page focused on roles that align with the experience the user shared in conversation, instead of dumping every job at once.</p>
            <p>Matched tags are visible so the frontend can explain why a role is here, which helps during demos and later when you refine the ranking.</p>
          </div>
        </section>
      </div>

      {density.length ? (
        <div className="mt-8">
          <JobDensityMap density={density} initialTrade={matches[0]?.job.trade_category ?? "construction"} />
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {matches.map((match) => (
          <JobCard key={match.job.id} match={match} language={language} />
        ))}
      </div>
    </div>
  );
}

export default function JobResultsPage() {
  return (
    <main className="page-shell">
      <Suspense fallback={<LoadingState message="Loading job matches..." />}>
        <ResultsContent />
      </Suspense>
    </main>
  );
}
