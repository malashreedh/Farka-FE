export type Language = "en" | "ne";

export const translations = {
  en: {
    hero_title: "Is there something for you back in Nepal?",
    hero_sub: "You've worked hard abroad. FARKA finds what's waiting for you back home.",
    start_journey: "Start Your Journey",
    loading: "Finding your path...",
    // Add these new keys:
    share_story_title: "Share Your Story",
    share_story_desc: "Tell FARKA about your skills, dreams, and the years you've spent working abroad.",
    find_jobs_title: "Find Real Jobs",
    find_jobs_desc: "We surface verified opportunities in Nepal matched to what you actually know how to do.",
    build_something_title: "Build Something",
    build_something_desc: "Turn what you've earned abroad into something lasting at home.",
  },
  ne: {
    hero_title: "के नेपालमा तपाईंको लागि अवसर छ?",
    hero_sub: "तपाईंले विदेशमा कडा परिश्रम गर्नुभयो। FARKA ले तपाईंलाई नेपालमा पर्खिरहेका अवसरहरू खोज्न मद्दत गर्छ।",
    start_journey: "यात्रा सुरु गर्नुहोस्",
    loading: "बाटो खोज्दैछौं...",
    // Add these new keys:
    share_story_title: "आफ्नो कथा सुनाउनुहोस्",
    share_story_desc: "तपाईंको सीप र सपनाहरूको बारेमा FARKA लाई भन्नुहोस्।",
    find_jobs_title: "वास्तविक जागिर खोज्नुहोस्",
    find_jobs_desc: "तपाईंको सीपसँग मिल्ने नेपालका प्रमाणित अवसरहरू खोज्नुहोस्।",
    build_something_title: "केहि नयाँ सुरु गर्नुहोस्",
    build_something_desc: "विदेशको कमाइलाई स्वदेशमा एउटा दिगो व्यवसायमा बदल्नुहोस्।",
  }
};

export function getText(key: keyof typeof translations.en, lang: Language) {
  return translations[lang][key] || translations.en[key];
}