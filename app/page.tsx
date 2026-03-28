"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Compass,
  Landmark,
  MapPinned,
  MessageSquareHeart,
  MountainSnow,
  Sparkles,
  Store,
} from "lucide-react";

import { getText } from "@/lib/language";
import type { Language } from "@/lib/types";
import { DOMAIN_OPTIONS } from "@/lib/workflows";

const language: Language = "en";

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
  { value: "6", label: "guided work domains" },
  { value: "2", label: "return pathways" },
  { value: "1", label: "conversation-led profile" },
];

export default function LandingPage() {
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
              FARKA helps Nepali workers abroad map what comes next at home, whether that means a grounded job search or a small business plan that fits their savings, skills, and district.
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
                See how it flows
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
                    <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">Live assistant flow</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">Built for voice-like conversation</h2>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--terracotta)]">
                    <MountainSnow size={24} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[28px] border border-white/8 bg-[color:var(--surface)] p-5">
                    <p className="text-sm leading-7 text-[color:var(--text)]">
                      “I&apos;m in Qatar. I worked in hotel operations for 5 years and now I&apos;m thinking about returning to Pokhara.”
                    </p>
                  </div>
                  <div className="rounded-[28px] rounded-tl-md border border-[color:var(--line-strong)] bg-[color:var(--accent-soft)] p-5">
                    <p className="text-sm leading-7 text-[color:var(--text)]">
                      FARKA understands the work domain, years of experience, and location, then gently asks whether the next step should be job matching or a business checklist.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
                    <div className="flex items-center gap-3">
                      <Landmark size={18} className="text-[color:var(--terracotta)]" />
                      <p className="text-sm font-semibold text-[color:var(--text)]">Local context</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Jobs, districts, and planning are framed around Nepal, not abstract templates.</p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
                    <div className="flex items-center gap-3">
                      <MapPinned size={18} className="text-[color:var(--accent)]" />
                      <p className="text-sm font-semibold text-[color:var(--text)]">Guided when useful</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Cards and chips appear only when they make the next answer easier.</p>
                  </div>
                </div>
              </div>

              <div className="hero-mountain mt-8 h-24 w-full bg-[linear-gradient(180deg,rgba(207,108,78,0.38),rgba(18,24,38,0.8))]" />
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
            The product stays conversational, but still collects enough structure to match jobs or generate a practical business roadmap.
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
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="panel-subtle rounded-[32px] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">Common pathways</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--text)]">
              Start from the work people actually did abroad.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">
              The guided domains make the conversation faster without turning the experience into a form. These are prompts, not constraints.
            </p>

            <div className="mt-8 rounded-[28px] border border-white/8 bg-[color:var(--surface)] p-5">
              <div className="flex items-center gap-3">
                <Building2 size={18} className="text-[color:var(--terracotta)]" />
                <p className="text-sm font-semibold text-[color:var(--text)]">Two outcome paths</p>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
                <p>Job seekers are redirected to ranked roles based on experience and skill tags.</p>
                <p>Business starters get a Nepal-grounded launch checklist shaped by district and savings.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {DOMAIN_OPTIONS.map((domain, index) => (
              <article key={domain.key} className={`panel-subtle rounded-[28px] p-5 fade-in-up stagger-${(index % 3) + 1}`}>
                <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-strong)]">{domain.key}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">{domain.titleEn}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{domain.introEn}</p>
                <div className="mt-4 rounded-[20px] border border-white/8 bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--text)]">
                  {domain.samplePromptEn}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-8">
        <div className="panel-raised rounded-[36px] px-6 py-10 md:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">Ready to test the live flow?</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--text)]">
                Use the official conversation flow, then plug the results straight into the backend.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">
                This frontend is built to stay compatible with the backend contract while feeling calm, modern, and much closer to a real product.
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
          <p>FARKA is a Nepal-first return-planning experience for workers coming home with skills, savings, and hard-earned experience.</p>
          <p className="uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">Built for the Nepal-US Hackathon</p>
        </footer>
      </section>
    </main>
  );
}
