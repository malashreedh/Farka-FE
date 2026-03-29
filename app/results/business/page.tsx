"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCheck, Landmark, ReceiptText, Store, Wallet, ExternalLink } from "lucide-react";

import FinancialViabilityPanel from "@/components/FinancialViabilityPanel";
import { useLanguage } from "@/components/LanguageProvider";
import LoadingState from "@/components/LoadingState";
import { api } from "@/lib/api";
import { getText } from "@/lib/language";
import type { BusinessChecklist, ChecklistItem, Profile } from "@/lib/types";

/**
 * Groups items by week while preserving their ORIGINAL index from the source array.
 * This ensures the toggle API (which uses index) still works in a Kanban layout.
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
    <div className={`group relative rounded-[20px] border p-4 transition-all duration-300 ${
      item.done 
      ? "border-[color:var(--sage)]/20 bg-[color:var(--sage)]/5 opacity-80" 
      : "border-white/8 bg-[color:var(--surface)] hover:border-white/20 shadow-sm"
    }`}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={handleToggle}
          disabled={saving}
          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
            item.done
              ? "border-[color:var(--sage)] bg-[color:var(--sage)] text-[color:var(--ink-strong)]"
              : "border-white/20 bg-transparent text-transparent group-hover:border-[color:var(--accent)]"
          }`}
        >
          <CheckCheck size={12} />
        </button>
        
        <div className="flex-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[color:var(--muted-strong)]">
            {item.category}
          </span>
          <p className={`mt-2 text-sm font-medium leading-relaxed ${
            item.done ? "text-[color:var(--muted)] line-through" : "text-[color:var(--text)]"
          }`}>
            {item.task}
          </p>
          
          {/* PLACEHOLDERS: These satisfy the "Product Moment" without backend changes */}
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
             <div className="flex items-center gap-1 text-[10px] font-bold text-[color:var(--accent)]">
                <Wallet size={12} />
                NPR —
             </div>
             <button className="flex items-center gap-1 text-[10px] text-[color:var(--muted)] hover:text-white transition">
                Docs <ExternalLink size={10} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BusinessContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("profile_id");
  const { language } = useLanguage();

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

  if (loading) return <LoadingState message={getText("loading_checklist", language)} />;

  if (error || !checklist) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-[color:var(--text)]">{error ?? "Checklist not found."}</p>
        <Link href="/chat" className="mt-6 inline-flex items-center gap-2 text-[color:var(--accent)]">
          {getText("return_to_chat", language)} <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  const completed = checklist.checklist_items.filter((i) => i.done).length;
  const total = checklist.checklist_items.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const kanbanWeeks = groupItemsForKanban(checklist.checklist_items);

  return (
    <div className="mx-auto max-w-full px-4 py-8 md:px-8">
      {/* ── HEADER ── */}
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <header className="panel-raised rounded-[32px] p-6 md:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--surface-strong)] text-[color:var(--terracotta)]">
                <Store size={20} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{getText("your_checklist", language)}</h1>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Trade</p>
                <p className="mt-1 text-lg font-bold text-[color:var(--accent)]">{checklist.trade}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">District</p>
                <p className="mt-1 text-lg font-bold">{checklist.district}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Progress</p>
                <p className="mt-1 text-lg font-bold text-[color:var(--sage)]">{progress}%</p>
              </div>
            </div>
          </header>

          <section className="panel-subtle flex items-center rounded-[32px] p-8">
             <div className="flex items-center gap-6">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white/5">
                   <span className="text-2xl font-bold">{progress}%</span>
                   <svg className="absolute inset-0 h-full w-full -rotate-90">
                      <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="4" className="text-[color:var(--sage)]" strokeDasharray={276} strokeDashoffset={276 - (276 * progress) / 100} />
                   </svg>
                </div>
                <p className="text-sm leading-relaxed text-[color:var(--muted)]">
                  Your business roadmap is currently active. Track your progress across the weeks below.
                </p>
             </div>
          </section>
        </div>
      </div>

      {/* ── KANBAN BOARD ── */}
      <div className="mt-10">
        <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-8 outline-none">
          {kanbanWeeks.map(([week, entries]) => (
            <div key={week} className="flex min-w-[300px] max-w-[320px] flex-col gap-5">
              {/* Column Header */}
              <div className="flex items-end justify-between px-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--muted-strong)]">
                    {getText("week_label", language)} {week}
                  </p>
                  <h3 className="text-lg font-bold">Preparation</h3>
                </div>
                <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-bold text-white/40">
                  {entries.length}
                </span>
              </div>

              {/* Column Body */}
              <div className="flex flex-col gap-3 rounded-[28px] bg-white/[0.02] p-3 outline-none ring-1 ring-white/5">
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
          
          {/* Visual Spacer for horizontal scroll */}
          <div className="min-w-[40px] shrink-0" />
        </div>
      </div>

      {/* ── VIABILITY PANEL ── */}
      <div className="mx-auto mt-8 max-w-7xl">
        {profileId && <FinancialViabilityPanel profileId={profileId} profile={profile} />}
      </div>
    </div>
  );
}

export default function BusinessResultsPage() {
  return (
    <main className="page-shell">
      <Suspense fallback={<LoadingState message="Loading your board..." />}>
        <BusinessContent />
      </Suspense>
    </main>
  );
}