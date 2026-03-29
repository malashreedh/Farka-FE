"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleGauge,
  MapPin,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { useLanguage } from "@/components/LanguageProvider";
import LoadingState from "@/components/LoadingState";
import { api } from "@/lib/api";
import { getText, type Language } from "@/lib/language";
import type { Job, JobDensity, JobMatch, OrgTypeEnum } from "@/lib/types";

const JobDensityMap = dynamic(() => import("@/components/JobDensityMap"), { ssr: false });

const ORG_BRANDING: Record<
  string,
  {
    initials: string;
    imageKey: string;
    tone: string;
  }
> = {
  "Department of Roads": { initials: "DoR", imageKey: "department-of-roads", tone: "linear-gradient(135deg,#dc143c,#003893)" },
  "Nepal Army Engineering": { initials: "NAE", imageKey: "nepal-army-engineering", tone: "linear-gradient(135deg,#8b1e2d,#003893)" },
  DWSS: { initials: "DWSS", imageKey: "dwss", tone: "linear-gradient(135deg,#003893,#2563eb)" },
  "Ministry of Agriculture": { initials: "MoA", imageKey: "ministry-of-agriculture", tone: "linear-gradient(135deg,#2e8b57,#003893)" },
  "Nepal Telecom": { initials: "NT", imageKey: "nepal-telecom", tone: "linear-gradient(135deg,#2563eb,#003893)" },
  "Pokhara Local Municipality": { initials: "PLM", imageKey: "pokhara-local-municipality", tone: "linear-gradient(135deg,#dc143c,#7c3aed)" },
  "Nepal Electricity Authority": { initials: "NEA", imageKey: "nepal-electricity-authority", tone: "linear-gradient(135deg,#003893,#0f766e)" },
  "Department of Transport": { initials: "DoT", imageKey: "department-of-transport", tone: "linear-gradient(135deg,#dc143c,#003893)" },
  "Hotel Annapurna": { initials: "HA", imageKey: "hotel-annapurna", tone: "linear-gradient(135deg,#c96f3f,#dc143c)" },
  "Hyatt Regency Kathmandu": { initials: "HRK", imageKey: "hyatt-regency-kathmandu", tone: "linear-gradient(135deg,#1f2937,#6b7280)" },
  "Leapfrog Technology": { initials: "LT", imageKey: "leapfrog-technology", tone: "linear-gradient(135deg,#2563eb,#7c3aed)" },
  "CloudFactory": { initials: "CF", imageKey: "cloudfactory", tone: "linear-gradient(135deg,#003893,#2563eb)" },
  "UNDP Nepal": { initials: "UNDP", imageKey: "undp-nepal", tone: "linear-gradient(135deg,#003893,#1d4ed8)" },
  "UN Women Nepal": { initials: "UNW", imageKey: "un-women-nepal", tone: "linear-gradient(135deg,#dc143c,#ec4899)" },
};

function formatPostedDate(postedAt: string, language: Language) {
  const date = new Date(postedAt);
  return date.toLocaleDateString(language === "ne" ? "ne-NP" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getOrgBadge(orgType: OrgTypeEnum, language: Language) {
  if (orgType === "government") return getText("government_role", language);
  if (orgType === "ngo") return getText("ngo_role", language);
  return getText("private_role", language);
}

function getContractLabel(job: Job, language: Language) {
  if (job.org_type === "government") return getText("permanent_full_time", language);
  if (job.org_type === "ngo") return getText("project_based", language);
  return getText("fixed_term", language);
}

function getExperienceLabel(level: Job["experience_level"], language: Language) {
  const map = {
    en: { entry: "Entry level", mid: "Mid level", senior: "Senior level" },
    ne: { entry: "प्रारम्भिक", mid: "मध्यम", senior: "वरिष्ठ" },
  } as const;
  return map[language][level];
}

function OrganizationVisual({ job }: { job: Job }) {
  const branding =
    ORG_BRANDING[job.org_name] ?? {
      initials: job.org_name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase(),
      imageKey: job.org_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      tone: "linear-gradient(135deg,#dc143c,#003893)",
    };

  return (
    <div className="flex items-center gap-4">
      <div
        className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[22px] border border-[color:var(--line)] text-sm font-bold text-white shadow-soft"
        style={{ background: branding.tone }}
      >
        <img
          src={`/job-logos/${branding.imageKey}.png`}
          alt={job.org_name}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center">{branding.initials}</span>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">{job.org_name}</p>
        <p className="mt-1 text-sm font-medium text-[color:var(--muted)]">{job.org_type}</p>
      </div>
    </div>
  );
}

function MatchBar({ value }: { value: number }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[rgba(0,56,147,0.08)]">
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,var(--terracotta),var(--accent))] transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function JobCard({ match, language }: { match: JobMatch; language: Language }) {
  const percentage = Math.round(match.match_score * 100);
  const [expanded, setExpanded] = useState(false);
  const hasExternalUrl = Boolean(match.job.apply_url && /^https?:\/\//.test(match.job.apply_url));

  return (
    <article className="panel-subtle rounded-[28px] p-5">
      <div className="flex flex-col gap-5 border-b border-[color:var(--line)] pb-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-4">
          <OrganizationVisual job={match.job} />
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-strong)]">
              <BadgeCheck size={12} className="text-[color:var(--accent)]" />
              {getOrgBadge(match.job.org_type, language)}
            </div>
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">{match.job.title}</h3>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{match.job.description}</p>
          </div>
        </div>

        <div className="w-full rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface)] p-4 xl:max-w-[220px]">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">{getText("match_score", language)}</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[color:var(--accent)]">{percentage}%</p>
          <div className="mt-4">
            <MatchBar value={percentage} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {match.matched_tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[color:var(--line)] bg-[color:var(--bg-elevated)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--text)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--bg-elevated)] p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">{getText("location_label", language)}</p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--text)]">
            <MapPin size={15} className="text-[color:var(--terracotta)]" />
            {match.job.district}
          </p>
        </div>
        <div className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--bg-elevated)] p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">{getText("salary_label", language)}</p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--text)]">
            <Wallet size={15} className="text-[color:var(--accent)]" />
            {match.job.salary_range ?? "N/A"}
          </p>
        </div>
        <div className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--bg-elevated)] p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">{getText("contract_label", language)}</p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--text)]">
            <BriefcaseBusiness size={15} className="text-[color:var(--terracotta)]" />
            {getContractLabel(match.job, language)}
          </p>
        </div>
        <div className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--bg-elevated)] p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">{getText("experience_label", language)}</p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--text)]">
            <CircleGauge size={15} className="text-[color:var(--accent)]" />
            {getExperienceLabel(match.job.experience_level, language)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--line)] pt-4">
        <p className="inline-flex items-center gap-2 text-sm text-[color:var(--muted)]">
          <CalendarDays size={15} className="text-[color:var(--terracotta)]" />
          {getText("posted_label", language)}: {formatPostedDate(match.job.posted_at, language)}
        </p>

        {hasExternalUrl ? (
          <a
            href={match.job.apply_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--ink-strong)] transition hover:brightness-105"
          >
            {getText("view_details", language)}
            <ArrowRight size={15} />
          </a>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-2 text-sm font-semibold text-[color:var(--accent)] transition hover:border-[color:var(--line-strong)]"
          >
            {expanded ? getText("hide_details", language) : getText("more_details", language)}
            <ArrowRight size={15} className={expanded ? "rotate-90 transition-transform" : "transition-transform"} />
          </button>
        )}
      </div>

      {!hasExternalUrl && expanded ? (
        <div className="mt-4 rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface)] p-4 text-sm leading-7 text-[color:var(--muted)]">
          <p className="font-semibold text-[color:var(--text)]">{getText("official_employer", language)}: {match.job.org_name}</p>
          <p className="mt-2">{getText("no_apply_link", language)}</p>
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

  const topMatch = matches[0];
  const topTrade = useMemo(() => topMatch?.job.trade_category ?? "construction", [topMatch]);

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
      <div className="grid gap-8 xl:grid-cols-[0.86fr_1.14fr]">
        <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <section className="panel-raised rounded-[32px] p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--accent)]">
                <BriefcaseBusiness size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">{getText("professional_listings", language)}</p>
                <h1 className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--text)]">{getText("job_matches", language)}</h1>
              </div>
            </div>

            <p className="mt-6 text-lg leading-8 text-[color:var(--muted)]">
              {getText("why_this_list_body", language)}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">{getText("jobs_found", language)}</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[color:var(--accent)]">{matches.length}</p>
              </div>
              <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">{getText("best_fit", language)}</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[color:var(--terracotta)]">
                  {matches.length ? `${Math.round(matches[0].match_score * 100)}%` : "--"}
                </p>
              </div>
              <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">{getText("confidence_signal", language)}</p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--text)]">
                  <ShieldCheck size={16} className="text-[color:var(--sage)]" />
                  {getText("profile_matching", language)}
                </p>
              </div>
            </div>
          </section>

          {density.length ? <JobDensityMap density={density} initialTrade={topTrade} language={language} /> : null}
        </div>

        <section className="panel-subtle rounded-[32px] p-4 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <Building2 size={18} className="text-[color:var(--terracotta)]" />
            <p className="text-sm font-semibold text-[color:var(--text)]">{getText("why_this_list", language)}</p>
          </div>

          <div className="space-y-5 xl:max-h-[calc(100vh-11rem)] xl:overflow-y-auto xl:pr-2">
            {matches.map((match) => (
              <JobCard key={match.job.id} match={match} language={language} />
            ))}
          </div>
        </section>
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
