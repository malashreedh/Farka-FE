// app>results>jobs>page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

// ─── Internal Job Card Component ──────────────────────────────────────────────
function JobCard({ job, matchScore, tags }: { job: any; matchScore: number; tags: string[] }) {
  const percentage = Math.round(matchScore * 100);
  
  return (
    <div className="group relative rounded-2xl p-6 bg-white/5 border border-white/10 hover:border-[var(--teal)]/50 transition-all duration-300 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-display text-xl font-bold text-white group-hover:text-[var(--teal)] transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-white/40">{job.org_name} • {job.org_type}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-[var(--teal)]">{percentage}%</span>
          <span className="text-[10px] uppercase tracking-widest text-white/30">Match Score</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="px-2 py-1 rounded-md bg-[var(--teal)]/10 border border-[var(--teal)]/20 text-[10px] text-[var(--teal)] font-medium">
            {tag}
          </span>
        ))}
      </div>

      <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
        <span className="text-xs text-white/40 flex items-center gap-1">
          📍 {job.district}
        </span>
        <Link 
          href={job.apply_url || "#"} 
          className="text-xs font-bold text-[var(--amber)] hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

// ─── Results Content (Handles Search Params) ──────────────────────────────────
function ResultsContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("profile_id");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;

    const fetchMatches = async () => {
        try {
          const response = await api.getJobMatches(profileId);
          // If the data array is empty, trigger a new match
          if (!response.data || response.data.length === 0) {
            const triggerResponse = await api.triggerJobMatch(profileId);
            setMatches(triggerResponse.data);
          } else {
            setMatches(response.data);
          }
        } catch (err) {
          console.error("Error fetching jobs:", err);
        } finally {
          setLoading(false);
        }
      };

    fetchMatches();
  }, [profileId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[var(--teal)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--teal)] font-medium animate-pulse">Analyzing opportunities in Nepal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          Jobs That Match <span className="text-[var(--teal)]">You.</span>
        </h1>
        <p className="text-white/50 max-w-2xl">
          Based on your experience abroad, we found these opportunities in Nepal. 
          Your skills are exactly what these organizations are looking for.
        </p>
      </header>

      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((m, idx) => (
            <JobCard key={idx} job={m.job} matchScore={m.match_score} tags={m.matched_tags} />
          ))}
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
          <p className="text-white/40">No perfect matches found yet. Try chatting more with FARKA to refine your profile.</p>
          <Link href="/chat" className="mt-4 inline-block text-[var(--teal)] hover:underline">Return to Chat</Link>
        </div>
      )}
    </div>
  );
}

// ─── Main Page (Wrapped in Suspense for Next.js 14) ──────────────────────────
export default function JobResultsPage() {
  return (
    <main className="min-h-screen bg-[var(--navy)] mesh-bg">
      <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
        <ResultsContent />
      </Suspense>
    </main>
  );
}