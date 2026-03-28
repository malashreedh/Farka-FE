export type Language = "en" | "ne";

export const translations = {
  en: {
    hero_title: "Is there something for you back in Nepal?",
    hero_sub: "You've worked hard abroad. FARKA finds what's waiting for you back home.",
    start_journey: "Start Your Journey",
    loading: "Finding your path...",
  },
  ne: {
    hero_title: "के नेपालमा तपाईंको लागि अवसर छ?",
    hero_sub: "तपाईंले विदेशमा कडा परिश्रम गर्नुभयो। FARKA ले तपाईंलाई नेपालमा पर्खिरहेका अवसरहरू खोज्न मद्दत गर्छ।",
    start_journey: "यात्रा सुरु गर्नुहोस्",
    loading: "बाटो खोज्दैछौं...",
  }
};

export function getText(key: keyof typeof translations.en, lang: Language) {
  return translations[lang][key] || translations.en[key];
}