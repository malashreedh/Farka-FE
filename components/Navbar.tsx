"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Don't show the "Back" button on the home page itself
  const isHomePage = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[var(--navy)]/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-6">
        {/* The "Back" Button (Hidden on Home) */}
        {!isHomePage && (
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-[var(--teal)] transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back</span>
          </button>
        )}

        {/* The Logo (Always links to home) */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold tracking-tight text-[var(--teal)]">
            FARKA <span className="text-white/20 font-light ml-1">| फर्क</span>
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/40">
        <Link href="/#features" className="hover:text-white transition-colors">How It Works</Link>
        <Link href="/chat" className="px-4 py-1.5 rounded-full bg-[var(--teal)]/10 text-[var(--teal)] border border-[var(--teal)]/20 hover:bg-[var(--teal)]/20 transition-all">
          Start Chat
        </Link>
      </nav>
    </header>
  );
}