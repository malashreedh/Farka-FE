export type DomainOption = {
  key: string;
  titleEn: string;
  titleNe: string;
  introEn: string;
  introNe: string;
  samplePromptEn: string;
  samplePromptNe: string;
};

export const DOMAIN_OPTIONS: DomainOption[] = [
  {
    key: "construction",
    titleEn: "Construction & Site Work",
    titleNe: "निर्माण तथा साइट काम",
    introEn: "Formwork, concrete, plumbing, masonry, and on-site supervision.",
    introNe: "फर्मवर्क, कंक्रिट, प्लम्बिङ, गारो र साइट सुपरभिजन।",
    samplePromptEn: "I worked in construction and site work.",
    samplePromptNe: "म निर्माण तथा साइट काममा थिएँ।",
  },
  {
    key: "hospitality",
    titleEn: "Hospitality & Hotels",
    titleNe: "हस्पिटालिटी तथा होटल",
    introEn: "Front desk, housekeeping, food service, and kitchen prep.",
    introNe: "फ्रन्ट डेस्क, हाउसकिपिङ, फुड सर्भिस र किचन प्रेप।",
    samplePromptEn: "I worked in hospitality and hotel operations.",
    samplePromptNe: "म हस्पिटालिटी र होटल क्षेत्रमा काम गर्थें।",
  },
  {
    key: "manufacturing",
    titleEn: "Manufacturing & Factory",
    titleNe: "उत्पादन तथा फ्याक्ट्री",
    introEn: "Machine operation, welding, fabrication, and assembly lines.",
    introNe: "मेसिन अपरेशन, वेल्डिङ, फ्याब्रिकेसन र असेंब्ली लाइन।",
    samplePromptEn: "I worked in manufacturing and factory operations.",
    samplePromptNe: "म फ्याक्ट्री र उत्पादन क्षेत्रमा काम गर्थें।",
  },
  {
    key: "agriculture",
    titleEn: "Agriculture & Livelihood",
    titleNe: "कृषि तथा जीविकोपार्जन",
    introEn: "Farming, livestock, irrigation, harvesting, and greenhouse work.",
    introNe: "खेती, पशुपालन, सिंचाइ, कटानी र ग्रीनहाउस काम।",
    samplePromptEn: "I worked in agriculture and farming.",
    samplePromptNe: "म कृषि र खेतीमा काम गर्थें।",
  },
  {
    key: "transport",
    titleEn: "Transport & Logistics",
    titleNe: "यातायात तथा लजिस्टिक्स",
    introEn: "Driving, cargo handling, route planning, and fleet operations.",
    introNe: "ड्राइभिङ, कार्गो ह्यान्डलिङ, रुट प्लानिङ र फ्लीट अपरेशन।",
    samplePromptEn: "I worked in transport and logistics.",
    samplePromptNe: "म यातायात र लजिस्टिक्स क्षेत्रमा काम गर्थें।",
  },
  {
    key: "domestic",
    titleEn: "Domestic & Care Work",
    titleNe: "घरेलु तथा हेरचाह",
    introEn: "Childcare, elder care, cooking, cleaning, and home management.",
    introNe: "बाल हेरचाह, वृद्ध हेरचाह, खाना पकाउने, सफाइ र घर व्यवस्थापन।",
    samplePromptEn: "I worked in domestic and care work.",
    samplePromptNe: "म घरेलु र हेरचाहको काम गर्थें।",
  },
];

export const PATH_ACTIONS = {
  en: ["I want a job in Nepal", "I want to start my own business"],
  ne: ["म नेपालमा जागिर चाहन्छु", "म आफ्नै व्यवसाय सुरु गर्न चाहन्छु"],
};

export const DISTRICT_ACTIONS = {
  en: ["Kathmandu", "Lalitpur", "Pokhara", "Chitwan", "Butwal", "Biratnagar"],
  ne: ["Kathmandu", "Lalitpur", "Pokhara", "Chitwan", "Butwal", "Biratnagar"],
};

export const SAVINGS_ACTIONS = {
  en: ["Under 5 lakh", "5 to 20 lakh", "20 to 50 lakh", "Above 50 lakh"],
  ne: ["५ लाखभन्दा कम", "५ देखि २० लाख", "२० देखि ५० लाख", "५० लाखभन्दा माथि"],
};
