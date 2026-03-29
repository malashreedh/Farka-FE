"use client";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";

import { getText, type Language } from "@/lib/language";
import type { JobDensity, TradeCategoryEnum } from "@/lib/types";
import { DISTRICT_COORDINATES, TRADE_COLORS } from "@/lib/nepalGeo";

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;

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
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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

      <div className="mt-5 overflow-hidden rounded-[28px] border border-[color:var(--line)]">
        <MapContainer center={[27.7, 84.2]} zoom={7} scrollWheelZoom={false} className="h-[360px] w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((item) => {
            const coords = DISTRICT_COORDINATES[item.district];
            if (!coords) return null;
            return (
              <CircleMarker
                key={`${item.district}-${item.trade_category}`}
                center={coords}
                radius={Math.max(8, Math.min(26, item.job_count * 2))}
                pathOptions={{
                  color: TRADE_COLORS[item.trade_category] ?? "#dc143c",
                  fillColor: TRADE_COLORS[item.trade_category] ?? "#dc143c",
                  fillOpacity: 0.55,
                  weight: 2,
                }}
              >
                <Popup>
                  <strong>{item.district}</strong>
                  <br />
                  {replaceTokens(getText("map_summary", language), {
                    count: item.job_count,
                    district: item.district,
                    trade: item.trade_category,
                  })}
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </section>
  );
}
