import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "en" | "hi" | "ta" | "te" | "or" | "mr" | "bn" | "gu" | "pa";

export const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "ta", name: "தமிழ் (Tamil)" },
    { code: "te", name: "తెలుగు (Telugu)" },
    { code: "or", name: "ଓଡ଼ିଆ (Odia)" },
    { code: "mr", name: "मराठी (Marathi)" },
    { code: "bn", name: "বাংলা (Bengali)" },
    { code: "gu", name: "ગુજરાતી (Gujarati)" },
    { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
] as const;

interface LanguageContextProps {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
    language: "en",
    setLanguage: () => { },
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLangState] = useState<Language>("en");

    useEffect(() => {
        const stored = localStorage.getItem("ct-language") as Language | null;
        if (stored && LANGUAGES.some((l) => l.code === stored)) {
            setLangState(stored);
        }
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLangState(lang);
        localStorage.setItem("ct-language", lang);
    }, []);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);

// ─── Reusable Global Translations ────────────────────────────────────────────

export const STATUS_LABELS: Record<Language, Record<string, string>> = {
    en: { pending: "Pending", in_progress: "In progress", resolved: "Resolved" },
    hi: { pending: "लंबित", in_progress: "प्रगति पर", resolved: "समाधानित" },
    ta: { pending: "நிலுவையில்", in_progress: "செயல்பாட்டில்", resolved: "தீர்க்கப்பட்டது" },
    te: { pending: "పెండింగ్", in_progress: "ప్రగతిలో ఉంది", resolved: "పరిష్కరించబడింది" },
    or: { pending: "ପେଣ୍ଡିଂ", in_progress: "ପ୍ରକ୍ରିୟାଧୀନ", resolved: "ସମାଧାନ ହୋଇଛି" },
    mr: { pending: "लंबित", in_progress: "प्रगतीत", resolved: "निवारण झाले" },
    bn: { pending: "অমীমাংসিত", in_progress: "চলমান", resolved: "মীমাংসিত" },
    gu: { pending: "બાકી", in_progress: "પ્રક્રિયા ચાલુ", resolved: "નિવારણ થયેલ" },
    pa: { pending: "ਲੰਬਿਤ", in_progress: "ਚੱਲ ਰਿਹਾ ਹੈ", resolved: "ਹੱล ਕੀਤਾ" }
};

export const SCOPE_LABELS: Record<Language, Record<string, string>> = {
    en: { institute: "Campus", civic: "Civic" },
    hi: { institute: "परिसर", civic: "नागरिक" },
    ta: { institute: "வளாகம்", civic: "குடிமை" },
    te: { institute: "క్యాంపస్", civic: "పౌర" },
    or: { institute: "କ୍ୟାମ୍ପସ", civic: "ନାଗରିକ" },
    mr: { institute: "कॅम्पस", civic: "नागरी" },
    bn: { institute: "ক্যাম্পাস", civic: "নাগরিক" },
    gu: { institute: "કેમ્પસ", civic: "નાગરિક" },
    pa: { institute: "ਕੈਂਪਸ", civic: "ਨਾਗਰਿਕ" }
};

export const CATEGORY_NAMES: Record<Language, Record<string, string>> = {
    en: {
        "Public Works": "Public Works",
        "Sanitation": "Sanitation",
        "Electrical": "Electrical",
        "Water Utility": "Water Utility",
        "Parks": "Parks",
        "Others": "Others"
    },
    hi: {
        "Public Works": "सार्वजनिक निर्माण",
        "Sanitation": "सफाई व्यवस्था",
        "Electrical": "बिजली",
        "Water Utility": "जल आपूर्ति",
        "Parks": "पार्क / उद्यान",
        "Others": "अन्य"
    },
    ta: {
        "Public Works": "பொதுப்பணி",
        "Sanitation": "துப்புரவு",
        "Electrical": "மின்सாரம்",
        "Water Utility": "குடிநீர் வழங்கல்",
        "Parks": "பூங்காக்கள்",
        "Others": "இதர"
    },
    te: {
        "Public Works": "పబ్లిక్ వర్క్స్",
        "Sanitation": "పారిశుధ్యం",
        "Electrical": "విద్యుత్",
        "Water Utility": "నీటి సదుపాయం",
        "Parks": "పార్కులు",
        "Others": "ఇతరాలు"
    },
    or: {
        "Public Works": "କୋଠବାଡ଼ି ନିର୍ମାଣ",
        "Sanitation": "ସଫେଇ ବ୍ୟବସ୍ଥା",
        "Electrical": "ବିଦ୍ୟୁତ ବିଭାଗ",
        "Water Utility": "ଜଳ ଯୋଗାଣ",
        "Parks": "ଉଦ୍ୟାନ",
        "Others": "ଅନ୍ୟାନ୍ୟ"
    },
    mr: {
        "Public Works": "सार्वजनिक बांधकाम",
        "Sanitation": "स्वच्छता विभाग",
        "Electrical": "विद्युत विभाग",
        "Water Utility": "पाणी पुरवठा",
        "Parks": "उद्याने",
        "Others": "इतर"
    },
    bn: {
        "Public Works": "পূর্ত কাজ",
        "Sanitation": "জনস্বাস্থ্য ও পরিচ্ছন্নতা",
        "Electrical": "বিদ্যুৎ বিভাগ",
        "Water Utility": "জল সরবরাহ",
        "Parks": "উদ্যান",
        "Others": "অন্যান্য"
    },
    gu: {
        "Public Works": "માર્ગ મકાન",
        "Sanitation": "સ્વચ્છતા મંત્રાલય",
        "Electrical": "વીજળી વિભાગ",
        "Water Utility": "પાણી વિતરણ",
        "Parks": "બગીચા શણગાર",
        "Others": "બીજા"
    },
    pa: {
        "Public Works": "ਲੋਕ ਨਿਰਮਾਣ ਵਿਭਾਗ",
        "Sanitation": "ਸਫ਼ਾਈ ਪ੍ਰਬੰਧ",
        "Electrical": "ਬਿਜਲੀ ਵਿਭਾਗ",
        "Water Utility": "ਜਲ ਸਪਲਾਈ",
        "Parks": "ਪਾਰਕ ਅਤੇ ਬਾਗ਼",
        "Others": "ਹੋਰ"
    }
};

export const GRIEVANCE_CARD_TRANSLATIONS: Record<Language, {
    anonymous: string;
    resident: string;
    before: string;
    after: string;
    noPhoto: string;
    away: string;
    toastLoginToUpvote: string;
}> = {
    en: {
        anonymous: "Anonymous",
        resident: "Resident",
        before: "Before",
        after: "After",
        noPhoto: "No photo",
        away: "away",
        toastLoginToUpvote: "Sign in to upvote this report."
    },
    hi: {
        anonymous: "अनाम",
        resident: "निवासी",
        before: "पहले",
        after: "बाद में",
        noPhoto: "कोई फोटो नहीं",
        away: "दूर",
        toastLoginToUpvote: "इस रिपोर्ट को अपवोट करने के लिए साइन इन करें।"
    },
    ta: {
        anonymous: "அநாமதேயர்",
        resident: "குடியிருப்பாளர்",
        before: "முன்பு",
        after: "பின்பு",
        noPhoto: "புகைப்படம் இல்லை",
        away: "தொலைவில்",
        toastLoginToUpvote: "இந்த அறிக்கைக்கு வாக்களிக்க உள்நுழையவும்."
    },
    te: {
        anonymous: "అజ్ఞాత",
        resident: "నివాసి",
        before: "ముందు",
        after: "తరువాత",
        noPhoto: "ఫోటో లేదు",
        away: "దూరంగా",
        toastLoginToUpvote: "ఈ నివేదికకు ఓటు వేయడానికి సైన్ ఇన్ చేయండి."
    },
    or: {
        anonymous: "ଅଜ୍ଞାତ",
        resident: "ନିବାସୀ",
        before: "ପୂର୍ବରୁ",
        after: "ପରେ",
        noPhoto: "ଫଟୋ ନାହିଁ",
        away: "ଦୂରରେ",
        toastLoginToUpvote: "ଏହି ଅଭିଯୋଗକୁ ଅପ୍‌ଭୋଟ୍ କରିବା ପାଇଁ ଲଗ୍ ଇନ୍ କରନ୍ତୁ।"
    },
    mr: {
        anonymous: "अनामित",
        resident: "रहवासी",
        before: "पूर्वी",
        after: "नंतर",
        noPhoto: "फोटो नाही",
        away: "लांब",
        toastLoginToUpvote: "या तक्रारीला मत देण्यासाठी साईन इन करा."
    },
    bn: {
        anonymous: "নাম প্রকাশে অনিচ্ছুক",
        resident: "অধিবাসী",
        before: "আগে",
        after: "পরে",
        noPhoto: "কোন ছবি নেই",
        away: "দূরে",
        toastLoginToUpvote: "এই রিপোর্টে ভোট দেওয়ার জন্য সাইন ইন করুন।"
    },
    gu: {
        anonymous: "અજ્ઞાત",
        resident: "રહેવાસી",
        before: "પહેલાં",
        after: "પછી",
        noPhoto: "ફોટો નથી",
        away: "દૂર",
        toastLoginToUpvote: "આ ફરિયાદને અપવોટ કરવા સાઇન ઇન કરો."
    },
    pa: {
        anonymous: "ਅਗਿਆਤ",
        resident: "ਨਿਵਾਸੀ",
        before: "ਪਹਿਲਾਂ",
        after: "ਬਾਅਦ ਵਿੱਚ",
        noPhoto: "ਕੋਈ ਫੋਟੋ ਨਹੀਂ",
        away: "ਦੂਰ",
        toastLoginToUpvote: "ਇਸ ਰਿਪੋਰਟ ਨੂੰ ਅਪਵੋਟ ਕਰਨ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ।"
    }
};

