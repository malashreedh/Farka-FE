"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getText } from "@/lib/language";

// ─── Animated Stat Component ─────────────────────────────────────────────────
function AnimatedStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-display text-3xl font-bold text-[var(--teal)]">
        {value}
      </span>
      <span className="text-xs tracking-widest uppercase opacity-50 text-white">
        {label}
      </span>
    </div>
  );
}

// ─── Feature Card Component ───────────────────────────────────────────────────
interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
  accent?: string;
}

function FeatureCard({ icon, title, description, delay, accent }: CardProps) {
  return (
    <div
      className="group relative rounded-2xl p-8 flex flex-col gap-4 overflow-hidden hero-reveal"
      style={{
        animationDelay: delay,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at top left, ${accent ?? "var(--teal)"}18 0%, transparent 65%)`,
        }}
      />
      <div
        className="absolute top-0 left-8 h-0.5 w-12 rounded-full group-hover:w-24 transition-all duration-500"
        style={{ background: accent ?? "var(--teal)" }}
      />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: `${accent ?? "var(--teal)"}22` }}
      >
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold text-white leading-tight">
        {title}
      </h3>
      <p className="text-sm text-white/60 leading-relaxed">
        {description}
      </p>
      <span
        className="mt-auto text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300"
        style={{ color: accent ?? "var(--teal)" }}
      >
        Learn more <span>→</span>
      </span>
    </div>
  );
}

// ─── Mountain SVG ─────────────────────────────────────────────────────────────
function MountainSilhouette() {
  return (
    <div className="fixed bottom-0 left-0 w-full pointer-events-none z-10" aria-hidden="true">
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-[clamp(140px,22vw,280px)] block"
      >
        <defs>
          <radialGradient id="snowGlow" cx="50%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.18" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111e35" />
            <stop offset="100%" stopColor="#0a1628" />
          </linearGradient>
        </defs>
        <path d="M0,260 L80,200 L180,230 L300,160 L420,195 L540,145 L660,180 L760,130 L860,165 L960,120 L1060,155 L1160,125 L1280,170 L1440,200 L1440,320 L0,320 Z" fill="rgba(15,30,60,0.6)" />
        <path d="M0,320 L0,295 L120,270 L220,250 L300,230 L380,210 L450,195 L520,175 L590,155 L640,130 L680,105 L720,75 L760,100 L800,120 L850,145 L910,165 L970,185 L1040,195 L1120,210 L1200,230 L1280,250 L1360,268 L1440,280 L1440,320 Z" fill="url(#mountainGrad)" />
        <ellipse cx="720" cy="100" rx="80" ry="40" fill="url(#snowGlow)" />
      </svg>
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const lang = "en";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cards = [
    { icon: "🗣️", title: getText("share_story_title", lang) ?? "Share Your Story", description: getText("share_story_desc", lang) ?? "Tell FARKA about your skills and journey.", delay: "0.1s", accent: "var(--teal)" },
    { icon: "💼", title: getText("find_jobs_title", lang) ?? "Find Real Jobs", description: getText("find_jobs_desc", lang) ?? "Verified opportunities in Nepal.", delay: "0.2s", accent: "var(--amber)" },
    { icon: "🏗️", title: getText("build_something_title", lang) ?? "Build Something", description: getText("build_something_desc", lang) ?? "Turn your savings into a business.", delay: "0.3s", accent: "#60a5fa" },
  ];

  return (
    <div className="mesh-bg min-h-screen text-white">
      {/* Navigation */}
      <header className={`fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all ${scrolled ? "bg-[var(--navy)]/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"}`}>
        <span className="font-display text-2xl font-bold text-[var(--teal)]">FARKA</span>
        <Link href="/chat" className="px-6 py-2 rounded-full border border-[var(--teal)]/30 bg-[var(--teal)]/10 text-[var(--teal)] hover:bg-[var(--teal)]/20 transition-all text-sm font-medium">
          Get Started
        </Link>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pb-[300px]">
        <div className="hero-reveal flex flex-col items-center gap-6 z-20">
          <div className="px-4 py-1.5 rounded-full border border-[var(--amber)]/30 bg-[var(--amber)]/10 text-[var(--amber)] text-xs tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--amber)] animate-pulse" />
            For Nepali Migrant Workers
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight tracking-tight">
            Is there something for <br />
            <span className="text-[var(--teal)]">you back in Nepal?</span>
          </h1>
          <p className="max-w-xl text-lg text-white/50">
            You&apos;ve worked hard abroad. <span className="text-white">FARKA</span> finds what&apos;s waiting for you back home.
          </p>
          <Link href="/chat" className="mt-4 px-10 py-4 rounded-full bg-[var(--teal)] text-white font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(26,158,126,0.3)]">
            Start Your Journey →
          </Link>

          <div className="mt-12 pt-8 border-t border-white/10 flex gap-8 md:gap-16">
            <AnimatedStat value="50k+" label="Workers" />
            <AnimatedStat value="1.2k+" label="Jobs" />
            <AnimatedStat value="30+" label="Districts" />
          </div>
        </div>
        <MountainSilhouette />
      </section>

      {/* Features */}
      <section id="features" className="relative z-20 bg-[#0b1a2e] py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl font-bold mb-12">Three steps to coming home.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-12 border-t border-white/5 bg-[var(--navy)] text-center">
        <p className="text-white/20 text-sm">
          FARKA फर्का • Nepal-US Hackathon 2026
        </p>
      </footer>
    </div>
  );
}