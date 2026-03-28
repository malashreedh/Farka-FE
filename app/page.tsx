"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getText } from "@/lib/language";
import type { Language } from "@/lib/types";

// ─── Stat ─────────────────────────────────────────────────────────────────────
function AnimatedStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-bold" style={{ color: "var(--teal)", fontFamily: "'DM Sans', sans-serif" }}>
        {value}
      </span>
      <span className="text-xs tracking-widest uppercase opacity-50 text-white">
        {label}
      </span>
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  description,
  delay,
  accent,
}: {
  icon: string;
  title: string;
  description: string;
  delay: string;
  accent: string;
}) {
  return (
    <div
      className="group relative rounded-2xl p-8 flex flex-col gap-4 overflow-hidden hero-reveal"
      style={{
        animationDelay: delay,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${accent}20 0%, transparent 65%)` }}
      />
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-8 h-0.5 w-12 rounded-full group-hover:w-24 transition-all duration-500"
        style={{ background: accent }}
      />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: `${accent}22` }}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white leading-tight">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
        {description}
      </p>
      <span
        className="mt-auto text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300"
        style={{ color: accent }}
      >
        Learn more →
      </span>
    </div>
  );
}

// ─── Mountain SVG — fixed at bottom ──────────────────────────────────────────
function MountainSilhouette() {
  return (
    <div
      className="fixed bottom-0 left-0 w-full pointer-events-none z-10"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full block"
        style={{ height: "clamp(140px, 22vw, 280px)" }}
      >
        <defs>
          <radialGradient id="snowGlow" cx="50%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111e35" />
            <stop offset="100%" stopColor="#0a1628" />
          </linearGradient>
          <linearGradient id="ridgeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d2040" />
            <stop offset="100%" stopColor="#0a1628" />
          </linearGradient>
        </defs>
        {/* Far ridge */}
        <path
          d="M0,260 L80,200 L180,230 L300,160 L420,195 L540,145 L660,180 L760,130 L860,165 L960,120 L1060,155 L1160,125 L1280,170 L1440,200 L1440,320 L0,320 Z"
          fill="url(#ridgeGrad)"
          opacity="0.6"
        />
        {/* Main massif */}
        <path
          d="M0,320 L0,295 L120,270 L220,250 L300,230 L380,210 L450,195 L520,175 L590,155 L640,130 L680,105 L720,75 L760,100 L800,120 L850,145 L910,165 L970,185 L1040,195 L1120,210 L1200,230 L1280,250 L1360,268 L1440,280 L1440,320 Z"
          fill="url(#mountainGrad)"
        />
        {/* Snow cap */}
        <path
          d="M700,118 L720,75 L740,118 Q720,108 700,118 Z"
          fill="rgba(255,255,255,0.15)"
        />
        <ellipse cx="720" cy="100" rx="80" ry="40" fill="url(#snowGlow)" />
        {/* Teal mist */}
        <path
          d="M0,312 Q360,298 720,308 Q1080,318 1440,310 L1440,320 L0,320 Z"
          fill="rgba(26,158,126,0.07)"
        />
      </svg>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const lang: Language = "en";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cards = [
    {
      icon: "🗣️",
      title: getText("share_story_title", lang),
      description: getText("share_story_desc", lang),
      delay: "0.1s",
      accent: "var(--teal)",
    },
    {
      icon: "💼",
      title: getText("find_jobs_title", lang),
      description: getText("find_jobs_desc", lang),
      delay: "0.2s",
      accent: "var(--amber)",
    },
    {
      icon: "🏗️",
      title: getText("build_something_title", lang),
      description: getText("build_something_desc", lang),
      delay: "0.3s",
      accent: "#60a5fa",
    },
  ];

  return (
    <div className="min-h-screen text-white" style={{ background: "var(--navy)" }}>
      {/* ── Sticky Nav ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,22,40,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        }}
      >
        <span
          className="font-bold text-xl tracking-tight"
          style={{ color: "var(--teal)", fontFamily: "'DM Sans', sans-serif" }}
        >
          FARKA फर्क
        </span>

        <Link
          href="/chat"
          className="text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200"
          style={{
            background: "rgba(26,158,126,0.12)",
            color: "var(--teal)",
            border: "1px solid rgba(26,158,126,0.25)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(26,158,126,0.25)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(26,158,126,0.12)")}
        >
          {getText("start_chat", lang)}
        </Link>
      </header>

      {/* ── Hero ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 mesh-bg overflow-hidden"
        style={{ paddingBottom: "clamp(160px, 24vw, 300px)" }}
      >
        {/* Background glow orbs */}
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(26,158,126,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
            transform: "translate(-30%, -30%)",
          }}
          aria-hidden
        />
        <div
          className="absolute bottom-40 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
            transform: "translate(30%, 30%)",
          }}
          aria-hidden
        />

        <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center gap-6 hero-reveal">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs tracking-widest uppercase"
            style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.25)",
              color: "var(--amber)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--amber)" }}
            />
            Nepal–US Hackathon 2026
          </div>

          {/* Headline — spec: 64px+ Inter bold */}
          <h1
            className="font-bold text-white leading-tight tracking-tight"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            {/* Uses the correct spec key: landing_hero */}
            {getText("landing_hero", lang)
              .split("Nepal?")
              .map((part, i) =>
                i === 0 ? (
                  <span key={i}>{part}</span>
                ) : (
                  <span key={i}>
                    <span style={{ color: "var(--teal)" }}>Nepal?</span>
                    {part}
                  </span>
                )
              )}
          </h1>

          {/* Subtext — spec: DM Sans 20px muted */}
          <p
            className="max-w-xl leading-relaxed"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "rgba(255,255,255,0.52)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {getText("landing_sub", lang)}
          </p>

          {/* CTA — spec: teal, large, rounded, → /chat */}
          <Link
            href="/chat"
            className="mt-2 inline-flex items-center gap-2 font-bold rounded-full px-10 py-4 text-white transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, var(--teal), #14856a)",
              fontSize: "1.05rem",
              boxShadow: "0 0 40px rgba(26,158,126,0.3), 0 4px 20px rgba(0,0,0,0.3)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {getText("start_chat", lang)} →
          </Link>

          {/* Stats */}
          <div
            className="mt-8 pt-8 flex items-center gap-8 md:gap-16 flex-wrap justify-center"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <AnimatedStat value="50k+" label="Workers Helped" />
            <div className="w-px h-8 bg-white opacity-10 hidden sm:block" />
            <AnimatedStat value="1,200+" label="Verified Jobs" />
            <div className="w-px h-8 bg-white opacity-10 hidden sm:block" />
            <AnimatedStat value="30+" label="Districts" />
          </div>
        </div>

        <MountainSilhouette />
      </section>

      {/* ── Feature Cards — spec: 3 cards below fold ── */}
      <section
        id="features"
        className="relative z-20 py-24 px-6"
        style={{ background: "#0b1a2e" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: "var(--teal)" }} />
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--teal)" }}
            >
              How it works
            </span>
          </div>
          <h2
            className="font-bold text-white mb-12"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Three steps to coming home.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section
        className="relative z-20 py-20 px-6 text-center"
        style={{ background: "var(--navy)" }}
      >
        <div className="max-w-2xl mx-auto">
          <p
            className="text-xl md:text-2xl font-semibold text-white leading-snug mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            &ldquo;I worked in Qatar for six years. FARKA helped me find a
            construction supervisor role in Pokhara in three weeks. My children
            finally know their father.&rdquo;
          </p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            — Ramesh T., returned from Doha, 2024
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="relative z-20 py-20 px-6 text-center"
        style={{ background: "#0b1a2e" }}
      >
        <div className="max-w-xl mx-auto flex flex-col items-center gap-5">
          <h2
            className="font-bold text-white"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Your home is ready for you.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)" }}>
            Start a free conversation with FARKA — no account needed.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 font-bold rounded-full px-10 py-4 text-white transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, var(--teal), #14856a)",
              boxShadow: "0 0 32px rgba(26,158,126,0.25)",
            }}
          >
            {getText("start_chat", lang)} →
          </Link>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Available in Nepali &amp; English · Free forever
          </p>
        </div>
      </section>

      {/* ── Footer — spec text ── */}
      <footer
        className="relative z-20 py-8 px-6 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "var(--navy)" }}
      >
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
          FARKA फर्क • Nepal-US Hackathon 2026
        </p>
      </footer>
    </div>
  );
}