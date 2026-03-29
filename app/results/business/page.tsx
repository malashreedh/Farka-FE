"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCheck, Store } from "lucide-react";

import FinancialViabilityPanel from "@/components/FinancialViabilityPanel";
import { useLanguage } from "@/components/LanguageProvider";
import LoadingState from "@/components/LoadingState";
import ResultsFollowUpChat from "@/components/ResultsFollowUpChat";
import { api } from "@/lib/api";
import { getText } from "@/lib/language";
import type { BusinessChecklist, ChecklistItem, Profile } from "@/lib/types";

function groupByWeek(items: ChecklistItem[]) {
    const grouped = new Map<number, ChecklistItem[]>();
    items.forEach((item) => {
        const current = grouped.get(item.week) ?? [];
        current.push(item);
        grouped.set(item.week, current);
    });
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
}

function ChecklistRow({
  item,
  index,
  checklistId,
  onToggle,
}: {
  item: ChecklistItem;
  index: number;
  checklistId: string;
  onToggle: (index: number, done: boolean) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);

  async function handleToggle() {
    setSaving(true);
    try {
      await onToggle(index, !item.done);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={handleToggle}
          disabled={saving}
          className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
            item.done
              ? "border-[color:var(--sage)] bg-[color:var(--sage)] text-[color:var(--ink-strong)]"
              : "border-white/18 bg-transparent text-transparent"
          }`}
        >
          <CheckCheck size={14} />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[color:var(--line-strong)] bg-[color:var(--accent-soft)] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
              {item.category}
            </span>
          </div>
          <p className={`mt-3 text-sm leading-7 ${item.done ? "text-[color:var(--muted)] line-through" : "text-[color:var(--text)]"}`}>
            {item.task}
          </p>
        </div>
      </div>
    </div>
  );
}

function BusinessContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("profile_id");
  const { language: uiLanguage } = useLanguage();

  const [checklist, setChecklist] = useState<BusinessChecklist | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) {
      setError("Missing profile ID. Please complete the chat first.");
      setLoading(false);
      return;
    }

    const fetchChecklist = async () => {
      try {
        const existing = await api.getChecklist(profileId);
        setChecklist(existing);
        const profileData = await api.getProfile(profileId);
        setProfile(profileData);
      } catch {
        try {
          const generated = await api.generateChecklist(profileId);
          setChecklist(generated);
          const profileData = await api.getProfile(profileId);
          setProfile(profileData);
        } catch (generationError) {
          console.error(generationError);
          setError("We could not generate the business roadmap right now.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, [profileId]);

  async function handleToggle(index: number, done: boolean) {
    if (!checklist) {
      return;
    }

    const updated = await api.toggleChecklistItem(checklist.id, index, done);
    setChecklist(updated);
  }

  if (loading) {
    return <LoadingState message={getText("loading_checklist", profile?.language_pref ?? uiLanguage)} />;
  }

  if (error || !checklist) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="panel-subtle rounded-[32px] p-8">
          <p className="text-lg text-[color:var(--text)]">{error ?? "Checklist not found."}</p>
          <Link href="/chat" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)]">
            {getText("return_to_chat", language)}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  const completed = checklist.checklist_items.filter((item) => item.done).length;
  const total = checklist.checklist_items.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const groupedWeeks = groupByWeek(checklist.checklist_items);
  const language = profile?.language_pref ?? uiLanguage;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="panel-raised rounded-[32px] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--terracotta)]">
              <Store size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">Business roadmap</p>
              
              <h1 className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--text)]">{getText("your_checklist", language)}</h1>
            </div>
          </div>

          <p className="mt-6 text-lg leading-8 text-[color:var(--muted)]">
            {language === "ne"
              ? "यो रोडम्याप व्यापार, जिल्ला र बचतको आधारमा बनाइएको व्यवहारिक सुरुआती योजना हो, सामान्य प्रेरणादायी पाठ होइन।"
              : "This is a grounded launch sequence shaped by trade, district, and savings, so the plan feels practical rather than generic."}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">District</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">{checklist.district}</p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">{getText("progress_label", language)}</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--sage)]">{progress}%</p>
            </div>
          </div>
        </section>

        <ResultsFollowUpChat />
      </div>

      <div className="mt-8 space-y-5">
        {profileId ? <FinancialViabilityPanel profileId={profileId} profile={profile} /> : null}

        {groupedWeeks.map(([week, items]) => {
          const startIndex = checklist.checklist_items.findIndex((item) => item === items[0]);
          return (
            <section key={week} className="panel-subtle rounded-[30px] p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-strong)]">{getText("week_label", language)}</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">
                    {getText("week_label", language)} {week}
                  </h2>
                </div>
                <p className="text-sm text-[color:var(--muted)]">
                  {language === "ne"
                    ? `${items.filter((item) => item.done).length}/${items.length} काम पूरा`
                    : `${items.filter((item) => item.done).length}/${items.length} tasks complete`}
                </p>
              </div>

              <div className="grid gap-4">
                {items.map((item, itemIndex) => (
                  <ChecklistRow
                    key={`${week}-${itemIndex}`}
                    item={item}
                    index={startIndex + itemIndex}
                    checklistId={checklist.id}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default function BusinessResultsPage() {
  return (
    <main className="page-shell">
      <Suspense fallback={<LoadingState message="Loading business roadmap..." />}>
        <BusinessContent />
      </Suspense>
    </main>
  );
}
