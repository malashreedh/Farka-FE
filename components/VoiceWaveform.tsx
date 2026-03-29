"use client";

type Props = {
  active?: boolean;
  playing?: boolean;
  levels?: number[];
};

export default function VoiceWaveform({ active = false, playing = false, levels = [] }: Props) {
  const bars = levels.length ? levels : [0.22, 0.45, 0.68, 0.4, 0.3, 0.7, 0.36, 0.54, 0.26, 0.6];

  return (
    <div className="flex h-10 items-end gap-1 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2">
      {bars.map((level, index) => (
        <span
          key={`${index}-${level}`}
          className={`${active || playing ? "animate-pulse" : ""} w-1 rounded-full bg-[color:var(--accent)] transition-all duration-150`}
          style={{
            height: `${Math.max(18, Math.round(level * 100))}%`,
            opacity: active || playing ? 0.9 : 0.45,
            animationDelay: `${index * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}
