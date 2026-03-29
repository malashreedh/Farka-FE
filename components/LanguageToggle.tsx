"use client";

import { Languages } from "lucide-react";

import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-2 text-sm font-medium text-[color:var(--text)] transition hover:border-[color:var(--line-strong)]"
      aria-label="Toggle language"
    >
      <Languages size={16} className="text-[color:var(--accent)]" />
      <span>{language === "en" ? "नेपाली" : "English"}</span>
    </button>
  );
}
