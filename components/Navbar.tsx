"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, MessageSquareMore, Mountain, Sparkles } from "lucide-react";

import LanguageToggle from "@/components/LanguageToggle";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--line)] bg-[rgba(255,252,247,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-4">
          {!isHomePage ? (
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-2 text-sm text-[color:var(--muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--text)]"
            >
              <ArrowLeft size={15} />
              Back
            </button>
          ) : null}

          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[color:var(--surface)] text-[color:var(--accent)] shadow-soft">
              <Mountain size={20} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[color:var(--muted-strong)]">Farka</p>
              <p className="text-lg font-semibold tracking-[-0.03em] text-[color:var(--text)]">फर्क | Find your path home</p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-3 md:flex">
          <Link
            href="/#how-it-works"
            className="rounded-full px-4 py-2 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--text)]"
          >
            How it works
          </Link>
          <Link
            href="/#paths"
            className="rounded-full px-4 py-2 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--text)]"
          >
            About
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--accent-soft)] px-5 py-2.5 text-sm font-semibold text-[color:var(--accent)] transition hover:brightness-110"
          >
            <MessageSquareMore size={16} />
            Start chat
          </Link>
          <LanguageToggle />
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[color:var(--surface)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-strong)]">
            <Sparkles size={14} />
            Nepal-first
          </span>
        </nav>
      </div>
    </header>
  );
}
