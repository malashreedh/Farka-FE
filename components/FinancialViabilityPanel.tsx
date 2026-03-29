"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Banknote, Clock3, LineChart, Sparkles } from "lucide-react";

import { api } from "@/lib/api";
import type { BusinessViability, Profile } from "@/lib/types";

function getDefaultSavings(profile: Profile | null): number {
  if (!profile?.savings_range) return 800000;
  const defaults: Record<string, number> = {
    under_5L: 350000,
    "5L_to_20L": 800000,
    "20L_to_50L": 2500000,
    above_50L: 5500000,
  };
  return defaults[profile.savings_range] ?? 800000;
}

export default function FinancialViabilityPanel({
  profileId,
  profile,
}: {
  profileId: string;
  profile: Profile | null;
}) {
  const [savings, setSavings] = useState<number>(getDefaultSavings(profile));
  const [data, setData] = useState<BusinessViability | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSavings(getDefaultSavings(profile));
  }, [profile]);

  useEffect(() => {
    if (!profileId) return;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.getBusinessViability({
          profile_id: profileId,
          savings_amount_npr: savings,
        });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not estimate viability");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [profileId, savings]);

  return (
    <section className="panel-subtle rounded-[32px] p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">Financial viability</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--text)]">Can this business actually work with your savings?</h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--accent)]">
          <LineChart size={20} />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="text-sm font-medium text-[color:var(--muted)]">Savings (NPR)</label>
        <input
          type="number"
          min={100000}
          step={50000}
          value={savings}
          onChange={(event) => setSavings(Number(event.target.value) || 0)}
          className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--text)] outline-none md:max-w-xs"
        />
      </div>

      {loading ? <p className="mt-5 text-sm text-[color:var(--muted)]">Estimating startup cost, break-even, and risk...</p> : null}
      {error ? <p className="mt-5 text-sm text-[color:var(--accent)]">{error}</p> : null}

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {data?.options.map((option) => (
          <article key={option.title} className="rounded-[28px] border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">{option.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{option.fit_reason}</p>
              </div>
              <span
                className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{
                  background:
                    option.risk_level === "low"
                      ? "rgba(31,111,95,0.12)"
                      : option.risk_level === "moderate"
                        ? "rgba(0,56,147,0.12)"
                        : "rgba(220,20,60,0.12)",
                  color:
                    option.risk_level === "low"
                      ? "#1f6f5f"
                      : option.risk_level === "moderate"
                        ? "#003893"
                        : "#dc143c",
                }}
              >
                {option.risk_level} risk
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="flex items-center gap-3 text-sm text-[color:var(--muted)]">
                <Banknote size={16} className="text-[color:var(--accent)]" />
                Total estimated cost: NPR {option.total_estimated_cost_npr.toLocaleString()}
              </div>
              <div className="flex items-center gap-3 text-sm text-[color:var(--muted)]">
                <Clock3 size={16} className="text-[color:var(--terracotta)]" />
                Break-even estimate: {option.break_even_months} months
              </div>
              <div className="flex items-center gap-3 text-sm text-[color:var(--muted)]">
                <AlertTriangle size={16} className="text-[color:var(--sage)]" />
                Savings gap: NPR {option.savings_gap_npr.toLocaleString()}
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm leading-7 text-[color:var(--muted)]">
              <p>Revenue range: {option.monthly_revenue_range_npr}</p>
              <p>Cost range: {option.monthly_cost_range_npr}</p>
            </div>

            {option.ai_note ? (
              <div className="mt-5 rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface-highlight)] p-4 text-sm leading-7 text-[color:var(--text)]">
                <p className="mb-2 inline-flex items-center gap-2 font-semibold">
                  <Sparkles size={14} className="text-[color:var(--accent)]" />
                  Quick take
                </p>
                <p>{option.ai_note}</p>
              </div>
            ) : null}

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">First steps</p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-[color:var(--muted)]">
                {option.suggested_first_steps.map((step) => (
                  <li key={step}>• {step}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
