// app>results>business>page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

// ─── Step Item Component ─────────────────────────────────────────────────────
function ChecklistItem({ step, index }: { step: any; index: number }) {
  return (
    <div className="group flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--amber)]/40 transition-all duration-300">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--amber)]/10 border border-[var(--amber)]/30 flex items-center justify-center font-display font-bold text-[var(--amber)]">
        {index + 1}
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="font-display text-lg font-bold text-white group-hover:text-[var(--amber)] transition-colors">
          {step.task}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed">
          {step.description}
        </p>
        {step.resource_url && (
          <Link 
            href={step.resource_url} 
            className="inline-block text-xs font-medium text-[var(--teal)] hover:underline mt-2"
          >
            Official Government Portal →
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Business Results Content ────────────────────────────────────────────────
function BusinessContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("profile_id");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;

    const fetchBusinessPlan = async () => {
        try {
          const response = await api.getBusinessChecklist(profileId);
          // If the backend returns 404 or empty, generate a new one
          if (!response.data) {
            const newPlan = await api.generateChecklist(profileId);
            setData(newPlan.data); // ACCESS .data HERE
          } else {
            setData(response.data); // ACCESS .data HERE
          }
        } catch (err) {
          console.error("Error fetching business plan:", err);
        } finally {
          setLoading(false);
        }
      };

    fetchBusinessPlan();
  }, [profileId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[var(--amber)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--amber)] font-medium animate-pulse">Drafting your business roadmap...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12 text-center md:text-left">
        <div className="inline-block px-3 py-1 rounded-full bg-[var(--amber)]/10 border border-[var(--amber)]/20 text-[var(--amber)] text-xs font-bold uppercase tracking-widest mb-4">
          Entrepreneurship Path
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
          Your Business in <span className="text-[var(--amber)]">Nepal.</span>
        </h1>
        <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
          You have the capital and the vision. Here is your step-by-step guide to launching 
          <span className="text-white"> {data?.business_type || "your venture"} </span> back home.
        </p>
      </header>

      <div className="space-y-4">
        {/* Changed 'steps' to 'checklist_items' to match the database model */}
        {data?.checklist_items?.map((item: any, idx: number) => (
            <ChecklistItem key={idx} step={item} index={idx} />
        ))}
      </div>

      <footer className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-[var(--teal)]/20 to-transparent border border-[var(--teal)]/20 text-center">
        <h4 className="text-white font-bold mb-2">Need Financial Support?</h4>
        <p className="text-sm text-white/60 mb-6">There are specific grants for returning migrants starting businesses in Nepal.</p>
        <button className="px-8 py-3 rounded-full bg-[var(--teal)] text-white font-bold hover:scale-105 transition-all">
          Connect with a Mentor
        </button>
      </footer>
    </div>
  );
}

export default function BusinessChecklistPage() {
  return (
    <main className="min-h-screen bg-[var(--navy)] mesh-bg">
      <Suspense fallback={<div className="p-20 text-center text-white">Loading Roadmap...</div>}>
        <BusinessContent />
      </Suspense>
    </main>
  );
}