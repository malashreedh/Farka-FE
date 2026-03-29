"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCheck, Store, Wallet, ExternalLink, LayoutDashboard } from "lucide-react";

import FinancialViabilityPanel from "@/components/FinancialViabilityPanel";
import { useLanguage } from "@/components/LanguageProvider";
import LoadingState from "@/components/LoadingState";
import ResultsFollowUpChat from "@/components/ResultsFollowUpChat";
import { api } from "@/lib/api";
import { getText } from "@/lib/language";
import type { BusinessChecklist, ChecklistItem, Profile } from "@/lib/types";

/**
 * Groups items by week while preserving their ORIGINAL index from the source array.
 * Essential for the toggle API to work in a Kanban layout.
 */
function groupItemsForKanban(items: ChecklistItem[]) {
    const grouped = new Map<number, { item: ChecklistItem; originalIndex: number }[]>();
    items.forEach((item, index) => {
        const current = grouped.get(item.week) ?? [];
        current.push({ item, originalIndex: index });
        grouped.set(item.week, current);
    });
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
}

/**
 * Kanban Card with FIXED 200px height and internal scroll.
 */
function KanbanCard({
  item,
  index,
  onToggle,
}: {
  item: ChecklistItem;
  index: number;
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
    <div className={`group flex flex-col justify-between rounded-[24px] border p-5 transition-all h-[200px] w-full ${
      item.done 
      ? "border-[color:var(--sage)]/20 bg-[color:var(--sage)]/5 opacity-70" 
      : "border-white/8 bg-[color:var(--surface)] shadow-sm hover:border-white/20"
    }`}>
      <div className="flex items-start gap-3 h-full overflow-hidden">
        <button
          type="button"
          onClick={handleToggle}
          disabled={saving}
          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
            item.done
              ? "border-[color:var(--sage)] bg-[color:var(--sage)] text-[color:var(--ink-strong)]"
              : "border-white/20 bg-transparent text-transparent group-hover:border-[color:var(--accent)]"
          }`}
        >
          <CheckCheck size={12} />
        </button>
        
        {/* Scrollable text area for long tasks */}
        <div className="flex-1 h-full overflow-y-auto pr-1 scrollbar-thin">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[color:var(--accent)]">
            {item.category}
          </span>
          <p className={`mt-2 text-sm leading-relaxed font-medium ${item.done ? "text-[color:var(--muted)] line-through" : "text-[color:var(--text)]"}`}>
            {item.task}
          </p>
        </div>
      </div>
      
      {/* Footer stays at the bottom of the 200px card */}
      <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-3 shrink-0">
         <div className="flex items-center gap-1 text-[10px] font-bold text-[color:var(--accent)]">
            <Wallet size={12} />
            NPR —
         </div>
         <div className="flex items-center gap-1 text-[10px] text-[color:var(--muted-strong)] cursor-pointer hover:text-white transition">
            Docs <ExternalLink size={10} />
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
        } catch (err) {
          setError("We could not generate the business roadmap right now.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchChecklist();
  }, [profileId]);

  async function handleToggle(index: number, done: boolean) {
    if (!checklist) return;
    const updated = await api.toggleChecklistItem(checklist.id, index, done);
    setChecklist(updated);
  }

  const language = profile?.language_pref ?? uiLanguage;

  if (loading) return <LoadingState message={getText("loading_checklist", language)} />;

  if (error || !checklist) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="panel-subtle rounded-[32px] p-8">
          <p className="text-lg text-[color:var(--text)]">{error ?? "Checklist not found."}</p>
          <Link href="/chat" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)]">
            {getText("return_to_chat", language)} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  const completed = checklist.checklist_items.filter((item) => item.done).length;
  const total = checklist.checklist_items.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const kanbanWeeks = groupItemsForKanban(checklist.checklist_items);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      {/* ── HEADER SECTION (UNTOUCHED) ── */}
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

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">District</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">{checklist.district}</p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">
                {language === "ne" ? "क्षेत्र" : "Trade"}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--accent)]">{checklist.trade}</p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">{getText("progress_label", language)}</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--sage)]">{progress}%</p>
            </div>
          </div>
        </section>

        <ResultsFollowUpChat />
      </div>

      <div className="mt-8 space-y-8">
        {profileId ? <FinancialViabilityPanel profileId={profileId} profile={profile} /> : null}

        {/* ── KANBAN SECTION HEADER ── */}
        <div className="flex flex-col gap-4 border-t border-white/5 pt-10 md:flex-row md:items-end md:justify-between">
           <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                 <LayoutDashboard size={12} />
                 Interactive Board
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[color:var(--text)]">
                {language === "ne" ? "साप्ताहिक कार्यान्वयन योजना" : "Implementation Plan"}
              </h2>
           </div>
           <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-[color:var(--accent)] animate-pulse" />
              Live Updates Active
           </div>
        </div>

        {/* ── KANBAN BOARD (REPLACED SECTION) ── */}
        <div className="overflow-x-auto pb-8 scrollbar-hide">
          <div className="flex gap-6 min-w-max items-stretch">
            {kanbanWeeks.map(([week, entries]) => (
              <div key={week} className="w-[310px] flex flex-col gap-5">
                <div className="px-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[color:var(--muted-strong)]">{getText("week_label", language)}</p>
                    <h3 className="text-lg font-bold text-[color:var(--text)]">Week {week}</h3>
                </div>
                
                <div className="flex flex-col gap-4 rounded-[32px] bg-white/[0.02] p-4 ring-1 ring-white/5 h-full min-h-[500px]">
                  {entries.map(({ item, originalIndex }) => (
                    <KanbanCard
                      key={`${week}-${originalIndex}`}
                      item={item}
                      index={originalIndex}
                      onToggle={handleToggle}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="w-8 shrink-0" />
          </div>
        </div>
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