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
} from "lucide-react";

import { useLanguage } from "@/components/LanguageProvider";
import { getText } from "@/lib/language";

const featureCards = [
  {
    icon: MessageSquareHeart,
    eyebrow: "Conversation first",
    title: "A return-planning assistant that listens before it recommends.",
    description:
      "FARKA turns lived work experience abroad into a practical next step back in Nepal, without forcing people through stiff forms.",
  },
  {
    icon: BriefcaseBusiness,
    eyebrow: "Jobs path",
    title: "Surface grounded opportunities that reflect real skills and districts.",
    description:
      "We match profiles to roles that feel believable for returning workers, not generic listings that ignore actual trade background.",
  },
  {
    icon: Store,
    eyebrow: "Business path",
    title: "Translate savings and experience into a launch plan that makes sense.",
    description:
      "The business roadmap is tuned for Nepal, so the plan feels like a local starting point instead of a generic startup checklist.",
  },
];

const trustStats = [
  { value: "2", label: "clear next-step options" },
  { value: "1", label: "simple guided conversation" },
  { value: "0", label: "forms to fill first" },
];

export default function LandingPage() {
  const { language } = useLanguage();

  return (
    <main className="page-shell">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-8 md:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div className="fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--accent-soft)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[color:var(--accent)]">
              <Sparkles size={14} />
              Nepal-first return planning
            </div>

            <h1 className="mt-6 max-w-4xl text-[clamp(3.2rem,7vw,6.6rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[color:var(--text)]">
              {getText("landing_hero", language)}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)] md:text-xl">
              FARKA helps Nepali workers abroad understand what is realistically possible back in Nepal, then guides them toward either a job opportunity or a small-business plan.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-6 py-4 text-sm font-semibold text-[color:var(--ink-strong)] transition hover:brightness-105"
              >
                Start the conversation
                <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[color:var(--surface)] px-6 py-4 text-sm font-semibold text-[color:var(--text)] transition hover:border-[color:var(--line-strong)]"
              >
                How it works
                <Compass size={16} />
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {trustStats.map((stat, index) => (
                <div key={stat.label} className={`panel-subtle rounded-[24px] p-4 fade-in-up stagger-${index + 1}`}>
                  <p className="text-2xl font-semibold tracking-[-0.03em] text-[color:var(--accent)]">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[color:var(--muted-strong)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-in-up stagger-2">
            <div className="panel-raised relative overflow-hidden rounded-[36px] p-6 md:p-8">
              <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(232,178,87,0.18),transparent_70%)]" />

              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">Path Analysis Found</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">Dubai expertise to <br/>Butwal enterprise.</h2>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--terracotta)]">
                    <Sparkles size={24} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[28px] border border-white/8 bg-[color:var(--surface)] p-6">
                    <p className="text-sm italic leading-relaxed text-[color:var(--text)]">
                      “I spent 7 years as an MEP lead in Dubai. I have savings and want to open a workshop in Butwal.”
                    </p>
                  </div>
                  
                  <div className="rounded-[28px] border border-[color:var(--line-strong)] bg-[color:var(--accent-soft)] p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[color:var(--muted-strong)]">Market Need</p>
                        <p className="mt-1 text-sm font-bold text-[color:var(--accent)]">High Demand</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[color:var(--muted-strong)]">Eligibility</p>
                        <p className="mt-1 text-sm font-bold text-amber-500">SME Grant</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 border-t border-[color:var(--line-strong)] pt-4">
                      <BriefcaseBusiness size={14} className="text-[color:var(--accent)]" />
                      <p className="text-[11px] font-bold uppercase tracking-wide text-[color:var(--accent)]">18 Verified Matches Nearby</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
                    <div className="flex items-center gap-3">
                      <Landmark size={18} className="text-[#3b82f6]" />
                      <p className="text-sm font-semibold text-[color:var(--text)]">Made for Nepal</p>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">Local costs, real districts, and government schemes.</p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
                    <div className="flex items-center gap-3">
                      <HandHelping size={18} className="text-[color:var(--terracotta)]" />
                      <p className="text-sm font-semibold text-[color:var(--text)]">Calm & Simple</p>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">No passwords or CVs. Just talk to get started.</p>
                  </div>
                </div>
              </div>

              <div className="hero-mountain mt-8 h-24 w-full bg-[linear-gradient(180deg,rgba(220,20,60,0.34),rgba(240,246,255,0.95))]" />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">How it works</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--text)]">
            One conversation, then a clear next step.
          </h2>
          <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">
            We keep the experience simple for the person using it: talk naturally, get understood, then see a path forward.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className={`panel-subtle rounded-[30px] p-6 fade-in-up stagger-${index + 1}`}>
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--accent)]">
                  <Icon size={22} />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">{feature.eyebrow}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">{feature.title}</h3>
                <p className="mt-4 text-base leading-8 text-[color:var(--muted)]">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="paths" className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-16">
        <div className="grid gap-5 md:grid-cols-2">
          <article className="panel-subtle rounded-[32px] p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--accent)]">
              <BriefcaseBusiness size={22} />
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">For jobs</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--text)]">See what roles could actually fit.</h3>
            <p className="mt-4 text-base leading-8 text-[color:var(--muted)]">
              Share where you are, what you did abroad, and how much experience you have. FARKA helps you move toward relevant roles in Nepal.
            </p>
          </article>

          <article className="panel-subtle rounded-[32px] p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--terracotta)]">
              <Store size={22} />
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">For business</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--text)]">Turn savings and experience into a plan.</h3>
            <p className="mt-4 text-base leading-8 text-[color:var(--muted)]">
              If returning home means starting something of your own, FARKA helps shape a realistic checklist based on your district and savings.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-8">
        <div className="panel-raised rounded-[36px] px-6 py-10 md:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">Ready to begin?</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--text)]">
                Start with a simple conversation and see what could be waiting back home.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">
                The experience is designed to feel clear, calm, and human from the first message.
              </p>
            </div>

            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--terracotta)] px-6 py-4 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Enter chat
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <footer className="mt-8 flex flex-col gap-3 border-t border-white/8 pt-6 text-sm text-[color:var(--muted)] md:flex-row md:items-center md:justify-between">
          <p>FARKA is a Nepal-first planning experience for workers returning home with skills, savings, and hard-earned experience.</p>
          <p className="uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">Built for the Nepal-US Hackathon</p>
        </footer>
      </section>
    </main>
  );
}