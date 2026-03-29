"use client";

import { Check } from "lucide-react";

type Props = {
  label: string;
  selected: boolean;
  onToggle: () => void;
};

export default function SkillTag({ label, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition duration-200 ${
        selected
          ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
          : "border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--text)] hover:border-[color:var(--line-strong)]"
      }`}
    >
      {selected ? <Check size={14} /> : null}
      <span>{label}</span>
    </button>
  );
}
