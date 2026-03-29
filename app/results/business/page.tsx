"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCheck, Landmark, ReceiptText, Store, Wallet, ExternalLink, LayoutDashboard } from "lucide-react";

import FinancialViabilityPanel from "@/components/FinancialViabilityPanel";
import { useLanguage } from "@/components/LanguageProvider";
import LoadingState from "@/components/LoadingState";
import { api } from "@/lib/api";
import { getText } from "@/lib/language";
import type { BusinessChecklist, ChecklistItem, Profile } from "@/lib/types";

// ─── KANBAN GROUPING HELPER ───
function groupItemsForKanban(items: ChecklistItem[]) {
    const grouped = new Map<number, { item: ChecklistItem; originalIndex: number }[]>();
    items.forEach((item, index) => {
        const current = grouped.get(item.week) ?? [];
        current.push({ item, originalIndex: index });
        grouped.set(item.week, current);
    });
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
}

// ─── KANBAN CARD COMPONENT ───
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
    <div className={`group rounded-[20px] border p-4 transition-all ${
      item.done 
      ? "border-[color:var(--sage)]/20 bg-[color:var(--sage)]/5 opacity-70" 
      : "border-white/8 bg-[color:var(--surface)] shadow-sm hover:border-white/20"
    }`}>
      <div className="flex items-start gap-3">
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
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[color:var(--accent)]">
            {item.category}
          </span>
          <p className={`mt-2 text-sm leading-relaxed font-medium ${item.done ? "text-[color:var(--muted)] line-through" : "text-[color:var(--text)]"}`}>
            {item.task}
          </p>
          
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
             <div className="flex items-center gap-1 text-[10px] font-bold text-[color:var(--accent)]">
                <Wallet size={12} />
                NPR —
             </div>
             <div className="flex items-center gap-1 text-[10px] text-[color:var(--muted-strong)] cursor-pointer hover:text-white transition">
                Docs <ExternalLink size={10} />
             </div>
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

  const completed = checklist.checklist_items.filter((item) => item.done).length;
  const total = checklist.checklist_items.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const kanbanWeeks = groupItemsForKanban(checklist.checklist_items);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      {/* ── ORIGINAL HEADER BOXES ── */}
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
            This is a grounded launch sequence shaped by trade, district, and savings.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">District</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">{checklist.district}</p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">Trade</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--accent)]">{checklist.trade}</p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">{getText("progress_label", language)}</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--sage)]">{progress}%</p>
            </div>
          </div>
        </section>

        <section className="panel-subtle rounded-[32px] p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
              <div className="flex items-center gap-3">
                <Landmark size={18} className="text-[color:var(--terracotta)]" />
                <p className="text-sm font-semibold text-[color:var(--text)]">Legal tasks</p>
              </div>
              <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">Registration and local compliance.</p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
              <div className="flex items-center gap-3">
                <Wallet size={18} className="text-[color:var(--accent)]" />
                <p className="text-sm font-semibold text-[color:var(--text)]">Budget pressure</p>
              </div>
              <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">Savings and financing steps.</p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
              <div className="flex items-center gap-3">
                <ReceiptText size={18} className="text-[color:var(--sage)]" />
                <p className="text-sm font-semibold text-[color:var(--text)]">Actionable output</p>
              </div>
              <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">Toggle items for cleaner progress reviews.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 space-y-8">
        {profileId ? <FinancialViabilityPanel profileId={profileId} profile={profile} /> : null}

        {/* ── NEW SECTION HEADER ── */}
        <div className="flex flex-col gap-4 border-t border-white/5 pt-10 md:flex-row md:items-end md:justify-between">
           <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                 <LayoutDashboard size={12} />
                 Interactive Board
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[color:var(--text)]">Weekly Implementation Plan</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                 Scroll horizontally to see your full roadmap. Toggle tasks as you complete them to keep your launch on schedule.
              </p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 text-xs font-semibold">
                 <span className="h-2 w-2 rounded-full bg-[color:var(--accent)] animate-pulse" />
                 Live Updates Active
              </div>
           </div>
        </div>

        {/* ── HORIZONTAL KANBAN SCROLL ── */}
        <div className="overflow-x-auto pb-8 outline-none scrollbar-hide">
          <div className="flex gap-6 min-w-max">
            {kanbanWeeks.map(([week, entries]) => (
              <div key={week} className="w-[310px] flex flex-col gap-5">
                <div className="flex items-end justify-between px-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[color:var(--muted-strong)]">{getText("week_label", language)}</p>
                    <h3 className="text-lg font-bold text-[color:var(--text)]">
                       Week {week}
                    </h3>
                  </div>
                  <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-bold text-white/30">
                     {entries.length} Tasks
                  </span>
                </div>
                
                <div className="flex flex-col gap-3 rounded-[28px] bg-white/[0.02] p-3 ring-1 ring-white/5 min-h-[400px]">
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
            
            {/* Visual Spacer for end of scroll */}
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