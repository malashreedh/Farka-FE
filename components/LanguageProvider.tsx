"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { Language } from "@/lib/types";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("farka_language");
    if (saved === "en" || saved === "ne") {
      setLanguageState(saved);
      sessionStorage.setItem("farka_lang", saved);
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: (nextLanguage: Language) => {
        setLanguageState(nextLanguage);
        window.localStorage.setItem("farka_language", nextLanguage);
        sessionStorage.setItem("farka_lang", nextLanguage);
      },
      toggleLanguage: () => {
        setLanguageState((current) => {
          const nextLanguage = current === "en" ? "ne" : "en";
          window.localStorage.setItem("farka_language", nextLanguage);
          sessionStorage.setItem("farka_lang", nextLanguage);
          return nextLanguage;
        });
      },
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
