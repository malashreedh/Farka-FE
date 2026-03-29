"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Compass,
  HandHelping,
  Landmark,
  MessageSquareHeart,
  MountainSnow,
  Sparkles,
  Store,
  CheckCircle2,
} from "lucide-react";

import { useLanguage } from "@/components/LanguageProvider";
import { getText } from "@/lib/language";

const featureCards = [
  {
    icon: MessageSquareHeart,
    eyebrow: "Human-centered",
    title: "A planning assistant that listens before it acts.",
    description:
      "FARKA respects your lived journey abroad. Tell us your story in plain Nepali or English—no rigid forms or confusing technical jargon required.",
    accent: "var(--accent)",
  },
  {
    icon: BriefcaseBusiness,
    eyebrow: "Direct Employment",
    title: "Find roles that respect your international experience.",
    description:
      "We bridge the gap between foreign trade skills and domestic demand, matching you to verified opportunities in your target district.",
    accent: "var(--accent)",
  },
  {
    icon: Store,
    eyebrow: "SME Roadmap",
    title: "Launch your own venture with a local roadmap.",
    description:
      "Turn your savings and global expertise into a sustainable local business. We provide checklists built for the reality of the Nepalese market.",
    accent: "var(--amber)",
  },
];

const trustStats = [
  { value: "0", label: "forms to fill first" },
  { value: "1", label: "simple conversation" },
  { value: "2", label: "clear paths home" },
];

export default function LandingPage() {
  const { language } = useLanguage();

  return (
    <main className="page-shell bg-[color:var(--navy)]">
      {/* ── HERO SECTION ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-8 md:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          
          {/* Left Column: The Narrative Hook */}
          <div className="fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--accent-soft)] px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">
              <Sparkles size={12} />
              Respecting your journey
            </div>

            <h1 className="mt-6 max-w-4xl text-[clamp(3rem,6.5vw,6rem)] font-bold leading-[0.92] tracking-[-0.05em] text-[color:var(--text)]">
              Your skills worked for the world. <br/>
              <span className="text-[color:var(--muted-strong)]">Now, let them work </span> 
              <span className="text-[color:var(--accent)]">for you at home.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[color:var(--muted)] md:text-xl">
              Stop searching generic boards. FARKA validates your years of hard work abroad and builds a realistic roadmap back to Nepal—whether it’s a verified role or your own business.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/chat"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[color:var(--accent)] px-8 py-5 text-base font-bold text-[color:var(--ink-strong)] shadow-[0_20px_40px_rgba(26,158,126,0.2)] transition hover:scale-[1.02]"
              >
                Plan my return
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-5 text-sm font-semibold text-[color:var(--text)] transition hover:border-[color:var(--line-strong)]"
              >
                How it works
                <Compass size={16} />
              </a>
            </div>

            <div className="mt-16 grid max-w-sm grid-cols-3 gap-6 border-t border-white/5 pt-10">
              {trustStats.map((stat, index) => (
                <div key={stat.label} className={`fade-in-up stagger-${index + 1}`}>
                  <p className="text-3xl font-bold tracking-tight text-[color:var(--text)]">{stat.value}</p>
                  <p className="mt-2 text-[10px] uppercase leading-tight tracking-[0.2em] text-[color:var(--muted-strong)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: The Visual Story (Synthesis Dashboard) */}
          <div className="fade-in-up stagger-2">
            <div className="panel-raised relative aspect-[4/5] overflow-hidden rounded-[48px] bg-[#0d1526] p-1 shadow-2xl border border-white/5">
              <div className="absolute inset-0 bg-[#0d1526]" />
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[color:var(--accent)] opacity-[0.05] blur-3xl" />
              
              <div className="relative flex h-full flex-col p-6 md:p-10">
                {/* Mock Chat Snippets */}
                <div className="mb-8 space-y-4">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-3xl rounded-tr-none bg-[color:var(--accent)] p-4 text-xs font-semibold text-[#0a1628] shadow-lg">
                      “I worked as a lead MEP supervisor in Dubai for 7 years. I want to return to Butwal.”
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-3xl rounded-tl-none border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-white/80 backdrop-blur-sm">
                      <Sparkles size={14} className="mb-2 text-[color:var(--accent)]" />
                      Mapping your expertise to Butwal&apos;s trade demand...
                    </div>
                  </div>
                </div>

                {/* Synthesis Result Card - HIGH CONTRAST COLORS */}
                <div className="mt-auto rounded-[32px] border border-white/10 bg-[#162136] p-6 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--accent)]">Path Analysis Found</span>
                    <CheckCircle2 size={14} className="text-[color:var(--accent)]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">Butwal Enterprise Roadmap</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                     <div className="rounded-2xl bg-[#0a1628] p-3 border border-white/5">
                        <p className="text-[9px] uppercase tracking-wider text-white/40 mb-1">Market Need</p>
                        <p className="text-sm font-bold text-[color:var(--accent)]">High (Rupandehi)</p>
                     </div>
                     <div className="rounded-2xl bg-[#0a1628] p-3 border border-white/5">
                        <p className="text-[9px] uppercase tracking-wider text-white/40 mb-1">Capital Usage</p>
                        <p className="text-sm font-bold text-amber-400">Efficient</p>
                     </div>
                  </div>
                  
                  <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[color:var(--accent)] p-4 text-[11px] font-bold text-[#0a1628]">
                     <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0a1628] text-[color:var(--accent)]">
                        <BriefcaseBusiness size={14} />
                     </div>
                     18 VERIFIED TRADE MATCHES NEARBY
                  </div>
                </div>
              </div>

              {/* Decorative Mountain Peak Overlay */}
              <div className="hero-mountain absolute inset-x-0 bottom-0 h-32 opacity-20 bg-[linear-gradient(180deg,transparent,rgba(26,158,126,0.5))]" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY SECTION ── */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-16">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">Our Philosophy</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--text)] md:text-5xl">
            One conversation. <br/>A clear next step.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[color:var(--muted)]">
            Traditional forms ignore the nuance of your journey. We built FARKA to understand where you have been, so we can show you where you can go.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className={`panel-subtle group rounded-[40px] p-8 transition-all hover:bg-white/[0.02] fade-in-up stagger-${index + 1}`}>
                <div className="flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--accent)] transition-transform group-hover:scale-110">
                  <Icon size={24} />
                </div>
                <p className="mt-8 text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">{feature.eyebrow}</p>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">{feature.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── PATHS SECTION ── */}
      <section id="paths" className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="panel-subtle relative overflow-hidden rounded-[40px] p-8 md:p-12 transition-all hover:border-[color:var(--accent)]/30">
            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--accent)] text-[#0a1628]">
                <BriefcaseBusiness size={24} />
              </div>
              <h3 className="mt-8 text-3xl font-bold tracking-[-0.04em] text-[color:var(--text)]">Direct Employment</h3>
              <p className="mt-4 text-base leading-8 text-[color:var(--muted)]">
                Whether you worked in construction in Qatar or hospitality in Dubai, we map your global experience to domestic roles that actually exist in Nepal.
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[color:var(--accent)] opacity-[0.03] blur-3xl" />
          </article>

          <article className="panel-subtle relative overflow-hidden rounded-[40px] p-8 md:p-12 transition-all hover:border-[color:var(--amber)]/30">
            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--amber)] text-[#0a1628]">
                <Store size={24} />
              </div>
              <h3 className="mt-8 text-3xl font-bold tracking-[-0.04em] text-[color:var(--text)]">Local Entrepreneurship</h3>
              <p className="mt-4 text-base leading-8 text-[color:var(--muted)]">
                Returning with savings? Get a localized launch plan including registration steps, realistic district costs, and resource links specific to Nepal.
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[color:var(--amber)] opacity-[0.03] blur-3xl" />
          </article>
        </div>
      </section>

      {/* ── FINAL CTA SECTION ── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-8">
        <div className="panel-raised relative overflow-hidden rounded-[48px] px-8 py-16 md:px-16 md:py-24 bg-[#0d1526]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,158,126,0.1),transparent_50%)]" />
          
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold leading-tight tracking-[-0.04em] text-[color:var(--text)] md:text-5xl">
                Start with a simple conversation. See what’s waiting at home.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-[color:var(--muted)]">
                No passwords, no CV uploads, no fees. Just a clear path back to your district in Nepal.
              </p>
            </div>

            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[color:var(--accent)] px-10 py-5 text-base font-bold text-[#0a1628] transition hover:scale-105"
            >
              Start Chatting
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <footer className="mt-12 flex flex-col gap-6 border-t border-white/5 pt-10 text-xs text-[color:var(--muted)] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-[color:var(--text)]">FARKA फर्का</span>
            <span className="text-white/10">|</span>
            <p>Built for the Nepal-US Hackathon 2026</p>
          </div>
          <p className="uppercase tracking-[0.2em] text-[color:var(--muted-strong)]">Empowering the return to Nepal</p>
        </footer>
      </section>
    </main>
  );
}