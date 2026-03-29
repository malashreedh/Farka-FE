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

export default function LandingPage() {
  const { language } = useLanguage();

  const featureCards = [
    {
      icon: MessageSquareHeart,
      eyebrow: language === "ne" ? "मानव-केंद्रित" : "Human-centered",
      title:
        language === "ne"
          ? "पहिले सुन्ने, अनि सिफारिस गर्ने सहायक।"
          : "A planning assistant that listens before it acts.",
      description: getText("share_story_desc", language),
    },
    {
      icon: BriefcaseBusiness,
      eyebrow: getText("landing_jobs_title", language),
      title:
        language === "ne"
          ? "विदेशको अनुभवलाई नेपालका वास्तविक भूमिकासँग जोड्नुहोस्।"
          : "Find roles that respect your international experience.",
      description: getText("landing_jobs_body", language),
    },
    {
      icon: Store,
      eyebrow: getText("landing_business_title", language),
      title:
        language === "ne"
          ? "स्थानीय बजार अनुसार व्यवसायको रोडम्याप बनाउनुहोस्।"
          : "Launch your own venture with a local roadmap.",
      description: getText("landing_business_body", language),
    },
  ];

  const trustStats = [
    { value: "0", label: getText("landing_stat_forms", language) },
    { value: "1", label: getText("landing_stat_chat", language) },
    { value: "2", label: getText("landing_stat_paths", language) },
  ];

  return (
    <main className="page-shell">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-8 md:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
          <div className="fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--accent-soft)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[color:var(--accent)]">
              <Sparkles size={14} />
              {getText("landing_badge", language)}
            </div>

            <h1 className="mt-6 max-w-4xl text-[clamp(3.2rem,7vw,6.4rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[color:var(--text)]">
              {getText("landing_hero_line1", language)}
              <br />
              <span className="text-[color:var(--muted-strong)]">{getText("landing_hero_line2", language)}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)] md:text-xl">
              {getText("landing_body", language)}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-6 py-4 text-sm font-semibold text-[color:var(--ink-strong)] transition hover:brightness-105"
              >
                {getText("landing_cta", language)}
                <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[color:var(--surface)] px-6 py-4 text-sm font-semibold text-[color:var(--text)] transition hover:border-[color:var(--line-strong)]"
              >
                {getText("landing_secondary", language)}
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
              <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(220,20,60,0.12),transparent_70%)]" />

              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">{getText("landing_journey", language)}</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">
                      {getText("landing_one_convo", language)}
                    </h2>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--terracotta)]">
                    <MountainSnow size={24} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[28px] border border-white/8 bg-[color:var(--surface)] p-5">
                    <p className="text-sm leading-7 text-[color:var(--text)]">
                      {language === "ne"
                        ? "“म दुबईमा ७ वर्ष MEP सुपरभाइजर थिएँ। अब बुटवल फर्किन चाहन्छु।”"
                        : "“I worked as a lead MEP supervisor in Dubai for 7 years. I want to return to Butwal.”"}
                    </p>
                  </div>
                  <div className="rounded-[28px] rounded-tl-md border border-[color:var(--line-strong)] bg-[color:var(--accent-soft)] p-5">
                    <p className="text-sm leading-7 text-[color:var(--text)]">
                      {language === "ne"
                        ? "FARKA ले अनुभव, जिल्ला र अर्को सम्भावित बाटो बुझेर उपयोगी सिफारिसतर्फ लैजान्छ।"
                        : "FARKA translates overseas experience into locally grounded next steps and a believable path home."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-[28px] border border-white/8 bg-[#13203a] p-5 text-white">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-[rgba(255,255,255,0.68)]">
                      {language === "ne" ? "विश्लेषण परिणाम" : "Path analysis found"}
                    </span>
                    <CheckCircle2 size={14} className="text-[color:var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {language === "ne" ? "बुटवल उद्यम रोडम्याप" : "Butwal Enterprise Roadmap"}
                  </h3>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-[20px] bg-[rgba(255,255,255,0.06)] p-3">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[rgba(255,255,255,0.54)]">
                        {language === "ne" ? "बजार माग" : "Market need"}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[color:var(--accent)]">
                        {language === "ne" ? "उच्च (रुपन्देही)" : "High (Rupandehi)"}
                      </p>
                    </div>
                    <div className="rounded-[20px] bg-[rgba(255,255,255,0.06)] p-3">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[rgba(255,255,255,0.54)]">
                        {language === "ne" ? "पूँजी उपयोग" : "Capital usage"}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#f7c56d]">
                        {language === "ne" ? "प्रभावकारी" : "Efficient"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[color:var(--accent)] p-4 text-[11px] font-bold text-[color:var(--ink-strong)]">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.18)]">
                      <BriefcaseBusiness size={14} />
                    </div>
                    {language === "ne" ? "१८ प्रमाणित भूमिका नजिकै" : "18 verified trade matches nearby"}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
                    <div className="flex items-center gap-3">
                      <Landmark size={18} className="text-[color:var(--terracotta)]" />
                      <p className="text-sm font-semibold text-[color:var(--text)]">
                        {language === "ne" ? "नेपालअनुकूल" : "Made for Nepal"}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                      {language === "ne"
                        ? "सल्लाह नेपाल फर्किने सन्दर्भअनुसार बनाइएको छ।"
                        : "Recommendations are framed around returning home, not generic global advice."}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-[color:var(--surface)] p-4">
                    <div className="flex items-center gap-3">
                      <HandHelping size={18} className="text-[color:var(--accent)]" />
                      <p className="text-sm font-semibold text-[color:var(--text)]">
                        {language === "ne" ? "उपयोगी र सरल" : "Helpful, not overwhelming"}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                      {language === "ne"
                        ? "कुराकानी स्वाभाविक राखेर आवश्यक समयमा मात्र सहयोगी संकेत देखिन्छ।"
                        : "You can type naturally, and the app only steps in when guidance becomes useful."}
                    </p>
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
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">{getText("landing_philosophy", language)}</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--text)]">{getText("landing_one_convo", language)}</h2>
          <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">{getText("landing_philosophy_body", language)}</p>
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
            <p className="mt-5 text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">{getText("landing_jobs_title", language)}</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--text)]">{getText("landing_jobs_title", language)}</h3>
            <p className="mt-4 text-base leading-8 text-[color:var(--muted)]">{getText("landing_jobs_body", language)}</p>
          </article>

          <article className="panel-subtle rounded-[32px] p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] text-[color:var(--terracotta)]">
              <Store size={22} />
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">{getText("landing_business_title", language)}</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--text)]">{getText("landing_business_title", language)}</h3>
            <p className="mt-4 text-base leading-8 text-[color:var(--muted)]">{getText("landing_business_body", language)}</p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-8">
        <div className="panel-raised rounded-[36px] px-6 py-10 md:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">{getText("landing_journey", language)}</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--text)]">{getText("landing_ready_title", language)}</h2>
              <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">{getText("landing_ready_body", language)}</p>
            </div>

            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--terracotta)] px-6 py-4 text-sm font-semibold text-white transition hover:brightness-110"
            >
              {getText("landing_start_chat", language)}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <footer className="mt-8 flex flex-col gap-3 border-t border-white/8 pt-6 text-sm text-[color:var(--muted)] md:flex-row md:items-center md:justify-between">
          <p>{getText("landing_ready_body", language)}</p>
          <p className="uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">{getText("landing_footer_tag", language)}</p>
        </footer>
      </section>
    </main>
  );
}
