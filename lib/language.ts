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
    jobs_map_title:   "Where opportunities are clustering",
    jobs_map_sub:     "District-level demand by trade category",
    jobs_map_empty:   "Select a trade category to explore district-level demand.",
    jobs_found:       "Roles found",
    best_fit:         "Best fit",
    confidence_signal:"Confidence signal",
    profile_matching: "Profile-aware matching",
    professional_listings: "Professional listings",
    why_this_list:    "Why this shortlist feels professional",
    why_this_list_body:"Roles are grouped with clear organization details, salary signals, contract type, and why they match your profile.",
    official_employer:"Employer",
    salary_label:     "Salary",
    contract_label:   "Contract",
    experience_label: "Experience",
    location_label:   "Location",
    posted_label:     "Posted",
    no_apply_link:    "Application link will be added soon.",
    more_details:     "More details",
    hide_details:     "Hide details",
    explore_trade:    "Explore by trade",
    map_summary:      "{count} jobs in {district} for {trade}.",
    permanent_full_time: "Full-time permanent",
    fixed_term:       "Fixed-term contract",
    project_based:    "Project-based",
    government_role:  "Government role",
    private_role:     "Private sector",
    ngo_role:         "Development sector",
    landing_badge:    "Nepal-first return planning",
    landing_cta:      "Start the conversation",
    landing_secondary:"How it works",
    landing_journey:  "Respecting your journey",
    landing_hero_line1:"Your skills worked for the world.",
    landing_hero_line2:"Now, let them work for you at home.",
    landing_body:     "FARKA validates your years of work abroad and turns them into a realistic path back to Nepal, whether that means a job or your own business.",
    landing_stat_forms:"forms to fill first",
    landing_stat_chat: "simple conversation",
    landing_stat_paths:"clear paths home",
    landing_philosophy:"Our philosophy",
    landing_one_convo:"One conversation. A clear next step.",
    landing_philosophy_body:"We built FARKA to understand where you have been, so we can show you where you can go next in Nepal.",
    landing_jobs_title:"Direct employment",
    landing_jobs_body:"Map your overseas experience to roles that actually exist in Nepal.",
    landing_business_title:"Local entrepreneurship",
    landing_business_body:"Turn savings and experience into a practical business plan shaped for your district.",
    landing_ready_title:"Start with a simple conversation. See what’s waiting at home.",
    landing_ready_body:"No passwords, no CV uploads, no fees. Just a clear path back to Nepal.",
    landing_start_chat:"Start chatting",
    landing_footer:   "Built for the Nepal-US Hackathon 2026",
    landing_footer_tag:"Empowering the return to Nepal",

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
    jobs_map_title:   "अवसर कहाँ धेरै छन्",
    jobs_map_sub:     "क्षेत्रअनुसार जिल्लागत माग",
    jobs_map_empty:   "जिल्लागत माग हेर्न कामको क्षेत्र छान्नुहोस्।",
    jobs_found:       "भेटिएका भूमिका",
    best_fit:         "उत्तम मिलान",
    confidence_signal:"विश्वसनीय संकेत",
    profile_matching: "प्रोफाइलअनुसार मिलान",
    professional_listings: "व्यावसायिक जागिर सूची",
    why_this_list:    "यो सूची किन उपयोगी छ",
    why_this_list_body:"यहाँ संस्थाको विवरण, तलब, करारको प्रकार, र तपाईंको प्रोफाइलसँग किन मिल्यो भन्ने आधार स्पष्ट देखिन्छ।",
    official_employer:"नियोक्ता",
    salary_label:     "तलब",
    contract_label:   "करार",
    experience_label: "अनुभव",
    location_label:   "स्थान",
    posted_label:     "पोस्ट गरिएको",
    no_apply_link:    "आवेदन लिंक छिट्टै थपिनेछ।",
    more_details:     "थप विवरण",
    hide_details:     "विवरण लुकाउनुहोस्",
    explore_trade:    "क्षेत्रअनुसार हेर्नुहोस्",
    map_summary:      "{district} मा {trade} का {count} वटा जागिर छन्।",
    permanent_full_time: "पूर्णकालीन स्थायी",
    fixed_term:       "निश्चित अवधिको करार",
    project_based:    "परियोजनामुखी",
    government_role:  "सरकारी भूमिका",
    private_role:     "निजी क्षेत्र",
    ngo_role:         "विकास क्षेत्र",
    landing_badge:    "नेपाल-केन्द्रित पुनरागमन योजना",
    landing_cta:      "कुराकानी सुरु गर्नुहोस्",
    landing_secondary:"कसरी काम गर्छ",
    landing_journey:  "तपाईंको यात्राप्रति सम्मान",
    landing_hero_line1:"तपाईंको सीपले संसारका लागि काम गर्‍यो।",
    landing_hero_line2:"अब ती सीप तपाईंको घरका लागि काम गरून्।",
    landing_body:     "FARKA ले विदेशको अनुभवलाई नेपाल फर्कने यथार्थपरक बाटोमा बदल्छ—जागिर वा आफ्नै व्यवसाय, जुन उपयोगी हुन्छ त्यही।",
    landing_stat_forms:"सुरुमै फाराम",
    landing_stat_chat: "साधारण संवाद",
    landing_stat_paths:"स्पष्ट बाटो",
    landing_philosophy:"हाम्रो सोच",
    landing_one_convo:"एक कुराकानी। स्पष्ट अर्को कदम।",
    landing_philosophy_body:"हामीले FARKA यसरी बनायौं कि यसले तपाईं कहाँबाट आउनुभयो भनेर बुझोस् र नेपालमा कहाँ जान सकिन्छ देखाओस्।",
    landing_jobs_title:"प्रत्यक्ष रोजगारी",
    landing_jobs_body:"विदेशको अनुभवलाई नेपालमा उपलब्ध वास्तविक भूमिकासँग जोड्नुहोस्।",
    landing_business_title:"स्थानीय उद्यम",
    landing_business_body:"बचत र अनुभवलाई जिल्लाअनुसार व्यवहारिक व्यवसाय योजनामा बदल्नुहोस्।",
    landing_ready_title:"साधारण कुराकानीबाट सुरु गर्नुहोस्। घरमा के पर्खिरहेको छ हेर्नुहोस्।",
    landing_ready_body:"पासवर्ड छैन, CV अपलोड छैन, शुल्क छैन। नेपाल फर्कने स्पष्ट बाटो मात्र।",
    landing_start_chat:"कुराकानी सुरु गर्नुहोस्",
    landing_footer:   "नेपाल-अमेरिका ह्याकाथन २०२६ का लागि निर्मित",
    landing_footer_tag:"नेपाल फर्कन सशक्त बनाउँदै",

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
