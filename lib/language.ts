// lib/language.ts
// All UI strings in English and Nepali.
// Key names match the backend spec requirements exactly.

export type Language = "en" | "ne";

export const translations = {
  en: {
    // ── Landing ──────────────────────────────────────────────────────────────
    landing_hero:  "Is there something for you back in Nepal?",
    landing_sub:   "Tell us your story. We'll find the path home.",
    start_chat:    "Start Your Journey",

    // ── Legacy aliases (used in existing page.tsx) ────────────────────────────
    hero_title:    "Is there something for you back in Nepal?",
    hero_sub:      "You've worked hard abroad. FARKA finds what's waiting for you back home.",
    start_journey: "Start Your Journey",

    // ── Loading states ────────────────────────────────────────────────────────
    loading:           "Finding your path...",
    loading_jobs:      "Searching for opportunities that match your skills...",
    loading_checklist: "Building your personalized business plan...",

    // ── Chat page ─────────────────────────────────────────────────────────────
    chat_placeholder:  "Type your message in English or Nepali...",
    chat_thinking:     "FARKA is thinking...",
    skill_tags_prompt: "Select your skills",

    // ── Results pages ─────────────────────────────────────────────────────────
    job_matches:      "Jobs That Match You",
    your_checklist:   "Your Business Roadmap",
    match_score:      "Match Score",
    view_details:     "View Details →",
    return_to_chat:   "Return to Chat",
    no_matches:       "No perfect matches found yet. Try chatting more with FARKA to refine your profile.",
    connect_mentor:   "Connect with a Mentor",

    // ── Feature cards ─────────────────────────────────────────────────────────
    share_story_title: "Share Your Story",
    share_story_desc:  "Tell FARKA about your skills, dreams, and the years you've spent working abroad. Your journey is the starting point — not a résumé.",
    find_jobs_title:   "Find Real Jobs",
    find_jobs_desc:    "No spam, no fake listings. We surface verified opportunities in Nepal matched to what you actually know how to do.",
    build_something_title: "Build Something",
    build_something_desc:  "The savings, the skills, the hunger — FARKA helps you turn what you've earned abroad into something lasting at home.",

    // ── Business checklist ────────────────────────────────────────────────────
    week_label:        "Week",
    progress_label:    "Tasks completed",
    need_finance:      "Need Financial Support?",
    finance_sub:       "There are specific grants for returning migrants starting businesses in Nepal.",
  },

  ne: {
    // ── Landing ──────────────────────────────────────────────────────────────
    landing_hero:  "के नेपालमा तपाईंको लागि अवसर छ?",
    landing_sub:   "हामीलाई आफ्नो कथा सुनाउनुस्। हामी घर फर्कने बाटो खोज्छौं।",
    start_chat:    "यात्रा सुरु गर्नुस्",

    // ── Legacy aliases ────────────────────────────────────────────────────────
    hero_title:    "के नेपालमा तपाईंको लागि अवसर छ?",
    hero_sub:      "तपाईंले विदेशमा कडा परिश्रम गर्नुभयो। FARKA ले तपाईंलाई नेपालमा पर्खिरहेका अवसरहरू खोज्न मद्दत गर्छ।",
    start_journey: "यात्रा सुरु गर्नुहोस्",

    // ── Loading states ────────────────────────────────────────────────────────
    loading:           "बाटो खोज्दैछौं...",
    loading_jobs:      "तपाईंको सीपसँग मिल्ने अवसर खोज्दैछौं...",
    loading_checklist: "तपाईंको व्यवसाय योजना बनाउँदैछौं...",

    // ── Chat page ─────────────────────────────────────────────────────────────
    chat_placeholder:  "अंग्रेजी वा नेपालीमा सन्देश टाइप गर्नुहोस्...",
    chat_thinking:     "FARKA सोच्दैछ...",
    skill_tags_prompt: "आफ्नो सीप छान्नुस्",

    // ── Results pages ─────────────────────────────────────────────────────────
    job_matches:      "तपाईंसँग मिल्ने जागिरहरू",
    your_checklist:   "तपाईंको व्यवसाय रोडम्याप",
    match_score:      "मिलान स्कोर",
    view_details:     "विवरण हेर्नुस् →",
    return_to_chat:   "च्याटमा फर्कनुस्",
    no_matches:       "अहिलेसम्म कुनै उपयुक्त अवसर भेटिएन। आफ्नो प्रोफाइल सुधार्न FARKA सँग थप कुराकानी गर्नुस्।",
    connect_mentor:   "सल्लाहकारसँग जडान गर्नुस्",

    // ── Feature cards ─────────────────────────────────────────────────────────
    share_story_title: "आफ्नो कथा सुनाउनुहोस्",
    share_story_desc:  "तपाईंको सीप र सपनाहरूको बारेमा FARKA लाई भन्नुहोस्।",
    find_jobs_title:   "वास्तविक जागिर खोज्नुहोस्",
    find_jobs_desc:    "तपाईंको सीपसँग मिल्ने नेपालका प्रमाणित अवसरहरू खोज्नुहोस्।",
    build_something_title: "केहि नयाँ सुरु गर्नुहोस्",
    build_something_desc:  "विदेशको कमाइलाई स्वदेशमा एउटा दिगो व्यवसायमा बदल्नुहोस्।",

    // ── Business checklist ────────────────────────────────────────────────────
    week_label:        "हप्ता",
    progress_label:    "कार्यहरू पूरा भए",
    need_finance:      "आर्थिक सहायता चाहिन्छ?",
    finance_sub:       "नेपालमा व्यवसाय सुरु गर्ने फर्कने प्रवासीहरूका लागि विशेष अनुदान उपलब्ध छन्।",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getText(key: TranslationKey, lang: Language): string {
  return translations[lang][key] ?? translations.en[key] ?? key;
}