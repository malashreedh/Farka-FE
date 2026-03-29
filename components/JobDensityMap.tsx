"use client";

import { useMemo, useState } from "react";
import { MapPinned } from "lucide-react";

import { getText, type Language } from "@/lib/language";
import { DISTRICT_POSITIONS, TRADE_COLORS } from "@/lib/nepalGeo";
import type { JobDensity, TradeCategoryEnum } from "@/lib/types";

function replaceTokens(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (current, [key, value]) => current.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export default function JobDensityMap({
  density,
  initialTrade = "construction",
  language,
}: {
  density: JobDensity[];
  initialTrade?: TradeCategoryEnum | string;
  language: Language;
}) {
  const [selectedTrade, setSelectedTrade] = useState<string>(initialTrade);

  const trades = useMemo(
    () => [...new Set(density.map((item) => item.trade_category))].filter(Boolean),
    [density],
  );

  const filtered = useMemo(
    () => density.filter((item) => item.trade_category === selectedTrade),
    [density, selectedTrade],
  );

  const topDistrict = filtered.slice().sort((a, b) => b.job_count - a.job_count)[0];

  return (
    <section className="panel-subtle rounded-[32px] p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">
            {getText("jobs_map_sub", language)}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">
            {getText("jobs_map_title", language)}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trades.map((trade) => (
            <button
              key={trade}
              type="button"
              onClick={() => setSelectedTrade(trade)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                selectedTrade === trade
                  ? "border-transparent text-white"
                  : "border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--muted)]"
              }`}
              style={
                selectedTrade === trade
                  ? { background: TRADE_COLORS[trade] ?? "var(--accent)" }
                  : undefined
              }
            >
              {trade}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
        {topDistrict
          ? replaceTokens(getText("map_summary", language), {
              count: topDistrict.job_count,
              district: topDistrict.district,
              trade: selectedTrade,
            })
          : getText("jobs_map_empty", language)}
      </p>

      <div className="mt-5 overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(250,244,236,0.95))] p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-[radial-gradient(circle_at_top_left,rgba(220,20,60,0.08),transparent_26%),linear-gradient(180deg,#fffdf8,#f7f0e6)]">
            <div className="absolute inset-0 opacity-[0.18]">
              <svg viewBox="0 0 800 420" className="h-full w-full">
                <path
                  d="M46 260 C82 236, 118 214, 170 208 C220 200, 246 170, 286 156 C334 140, 376 152, 426 138 C476 124, 500 88, 544 86 C590 84, 616 116, 652 126 C694 138, 724 126, 756 110 L774 140 C734 156, 700 176, 662 188 C622 200, 596 230, 556 236 C518 242, 476 224, 428 236 C384 246, 346 286, 304 292 C250 300, 214 280, 176 286 C128 294, 90 320, 48 326 Z"
                  fill="rgba(0,56,147,0.1)"
                  stroke="rgba(0,56,147,0.35)"
                  strokeWidth="10"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {filtered.map((item) => {
              const position = DISTRICT_POSITIONS[item.district];
              if (!position) return null;

              const size = Math.max(34, Math.min(72, 24 + item.job_count * 6));
              return (
                <div
                  key={`${item.district}-${item.trade_category}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                >
                  <div
                    className="flex items-center justify-center rounded-full border-4 border-white text-white shadow-[0_18px_32px_rgba(0,0,0,0.16)]"
                    style={{
                      width: size,
                      height: size,
                      background: TRADE_COLORS[item.trade_category] ?? "#dc143c",
                    }}
                  >
                    <span className="text-sm font-bold">{item.job_count}</span>
                  </div>
                  <p className="mt-2 whitespace-nowrap text-center text-xs font-semibold text-[color:var(--text)]">
                    {item.district}
                  </p>
                </div>
              );
            })}

            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2 text-xs font-medium text-[color:var(--muted)] shadow-soft">
              <MapPinned size={14} className="text-[color:var(--accent)]" />
              Nepal district demand view
            </div>
          </div>

          <div className="rounded-[28px] border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-strong)]">
              {getText("explore_trade", language)}
            </p>
            <div className="mt-4 space-y-3">
              {filtered
                .slice()
                .sort((a, b) => b.job_count - a.job_count)
                .map((item) => (
                  <div
                    key={`${item.district}-${item.trade_category}-list`}
                    className="flex items-center justify-between rounded-[20px] border border-[color:var(--line)] bg-[color:var(--bg-elevated)] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--text)]">{item.district}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-strong)]">{item.trade_category}</p>
                    </div>
                    <div
                      className="rounded-full px-3 py-1 text-xs font-bold text-white"
                      style={{ background: TRADE_COLORS[item.trade_category] ?? "#dc143c" }}
                    >
                      {item.job_count}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
