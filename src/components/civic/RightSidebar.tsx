import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Megaphone,
  AlertCircle,
  MessageCircle,
  Send,
  Star,
} from "lucide-react";
import type { GrievanceRow } from "@/components/civic/GrievanceCard";
import { timeAgo } from "@/lib/civic";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useLanguage, type Language, CATEGORY_NAMES } from "@/lib/language";


// dot colour per category for Recent Updates
const DOT_COLOR: Record<string, string> = {
  "Public Works": "bg-[#3B82F6]",
  "Sanitation": "bg-[#10B981]",
  "Electrical": "bg-[#8B5CF6]",
  "Water Utility": "bg-[#06B6D4]",
  "Parks": "bg-[#F97316]",
  "Others": "bg-[#64748B]",
};

// ─── Abort helper ─────────────────────────────────────────────────────────────

function isAbortLike(err: unknown): boolean {
  if (err instanceof DOMException && err.name === "AbortError") return true;
  const m = err instanceof Error ? err.message : String(err ?? "");
  return /aborted|network_io_suspended|Failed to fetch|The user aborted|request to .* failed/i.test(m);
}

// ─── Recent Updates ───────────────────────────────────────────────────────────

type UpdateRow = {
  id: string;
  title: string;
  category: string;
  created_at: string;
  content?: string;
  is_announcement: boolean;
};

const RIGHT_TRANSLATIONS: Record<Language, {
  updatesTitle: string;
  noUpdates: string;
  noUpdatesDesc: string;
  announcement: string;
  markedResolved: string;
  feedbackTitle: string;
  feedbackSubmittedTitle: string;
  feedbackSubmittedDesc: string;
  submitAnother: string;
  rateExperience: string;
  ratingNames: string[];
  placeholderThoughts: string;
  sendFeedback: string;
}> = {
  en: {
    updatesTitle: "Recent Updates",
    noUpdates: "No authority updates yet.",
    noUpdatesDesc: "Updates appear when issues are resolved by authorities.",
    announcement: "— Announcement",
    markedResolved: "— marked resolved",
    feedbackTitle: "Feedback",
    feedbackSubmittedTitle: "Thank you!",
    feedbackSubmittedDesc: "Your feedback helps us improve NagarX.",
    submitAnother: "Submit another →",
    rateExperience: "How would you rate your experience?",
    ratingNames: ["", "Poor", "Fair", "Good", "Great", "Excellent"],
    placeholderThoughts: "Share your thoughts or suggestions…",
    sendFeedback: "Send Feedback",
  },
  hi: {
    updatesTitle: "हाल के अपडेट",
    noUpdates: "अभी तक कोई आधिकारिक अपडेट नहीं है।",
    noUpdatesDesc: "अधिकारियों द्वारा मामलों के समाधान किए जाने पर अपडेट यहां दिखाई देंगे।",
    announcement: "— घोषणा",
    markedResolved: "— समाधानित घोषित",
    feedbackTitle: "प्रतिक्रिया",
    feedbackSubmittedTitle: "धन्यवाद!",
    feedbackSubmittedDesc: "आपकी प्रतिक्रिया नगरएक्स को बेहतर बनाने में मदद करती है।",
    submitAnother: "एक और भेजें →",
    rateExperience: "आप अपने अनुभव को क्या रेटिंग देंगे?",
    ratingNames: ["", "खराब", "सामान्य", "अच्छा", "बहुत अच्छा", "उत्कृष्ट"],
    placeholderThoughts: "अपने विचार या सुझाव साझा करें…",
    sendFeedback: "प्रतिक्रिया भेजें",
  },
  ta: {
    updatesTitle: "சமீபத்திய அறிவிப்புகள்",
    noUpdates: "அதிகாரபூர்வ அறிவிப்புகள் ஏதுமில்லை.",
    noUpdatesDesc: "அதிகாரிகள் பிரச்சனைகளைத் தீர்க்கும்போது அறிவிப்புகள் தோன்றும்.",
    announcement: "— அறிவிப்பு",
    markedResolved: "— தீர்க்கப்பட்டது என குறிக்கப்பட்டது",
    feedbackTitle: "கருத்துகள்",
    feedbackSubmittedTitle: "நன்றி!",
    feedbackSubmittedDesc: "உங்கள் கருத்துக்கள் நகர்எக்ஸ் ஐ மேம்படுத்த உதவும்.",
    submitAnother: "மற்றொன்றை சமர்ப்பிக்கவும் →",
    rateExperience: "உங்கள் अनुभवத்தை எவ்வாறு மதிப்பிடுவீர்கள்?",
    ratingNames: ["", "மோசம்", "திருப்தி", "நல்லது", "மிக நன்று", "சிறந்தது"],
    placeholderThoughts: "உங்கள் எண்ணங்கள் அல்லது பரிந்துரைகளைப் பகிரவும்…",
    sendFeedback: "கருத்தை அனுப்புக",
  },
  te: {
    updatesTitle: "ఇటీవలి నవీకరణలు",
    noUpdates: "ఇంका ఎలాంటి అధికారిక నవీకరణలు లేవు.",
    noUpdatesDesc: "అధికారులు సమస్యలను పరిష్కరించినప్పుడు నవీకరణలు కనిపిస్తాయి.",
    announcement: "— ప్రకటన",
    markedResolved: "— పరిష్కరించబడినట్లు గుర్తించబడింది",
    feedbackTitle: "అభిప్రాయం",
    feedbackSubmittedTitle: "ధన్యవాదాలు!",
    feedbackSubmittedDesc: "మీ అభిప్రాయం నగర్ఎక్స్ మెరుగుపరచడానికి సహాయపడుతుంది.",
    submitAnother: "మరొకటి సమర్పించండి →",
    rateExperience: "మీ అనుభవాన్ని ఎలా రేట్ చేస్తారు?",
    ratingNames: ["", "బాగోలేదు", "సగటు", "బాగుంది", "చాలా బాగుంది", "అద్భుతం"],
    placeholderThoughts: "మీ ఆలోచనలు లేదా సలహాలను పంచుకోండి…",
    sendFeedback: "అభిప్రాయాన్ని పంపండి",
  },
  or: {
    updatesTitle: "ସାମ୍ପ୍ରତିକ ଅଦ୍ୟତନ",
    noUpdates: "କୌଣସି ସରକାରୀ ଅଦ୍ୟତନ ନାହିଁ।",
    noUpdatesDesc: "ଯେତେବେଳେ ଅଧିକାରୀଙ୍କ ଦ୍ୱାରା ସମସ୍ୟାର ସମାଧାନ ହୁଏ, ଏଠାରେ ଅଦ୍ୟତନ ଦେଖାଯାଏ।",
    announcement: "— ଘୋଷଣା",
    markedResolved: "— ସମାਧାନ ହୋଇଥିବା ଚିହ୍ନିତ",
    feedbackTitle: "ମତାମତ",
    feedbackSubmittedTitle: "ଧନ୍ୟବାଦ!",
    feedbackSubmittedDesc: "ଆପଣଙ୍କ ମତାମତ ନଗରଏକ୍ସକୁ ଉନ୍ନତ କରିବାରେ ସାହାଯ୍ୟ କରେ।",
    submitAnother: "ଆଉ ଏକ ଦାଖଲ କରନ୍ତୁ →",
    rateExperience: "ଆପଣ ଆମ ସେବାକୁ କିପରି ମୂଲ୍ୟାଙ୍କନ କରିବେ?",
    ratingNames: ["", "ଖରାପ", "ସାଧାରଣ", "ଭଲ", "ଖୁବ୍ ଭଲ", "ଉତ୍କୃଷ୍ଟ"],
    placeholderThoughts: "ଆପଣଙ୍କ ମତାମତ କିମ୍ବା ପରାମର୍ଶ ବାଣ୍ଟନ୍ତୁ…",
    sendFeedback: "ମତାମତ ପଠାନ୍ତୁ",
  },
  mr: {
    updatesTitle: "अलीकडील अपडेट्स",
    noUpdates: "अद्याप कोणतेही अधिकृत अपडेट्स नाहीत.",
    noUpdatesDesc: "अधिकार्‍यांनी समस्या सोडवल्यावर येथे अपडेट्स दिसतील.",
    announcement: "— घोषणा",
    markedResolved: "— निवारण केले गेले",
    feedbackTitle: "अभिप्राय",
    feedbackSubmittedTitle: "धन्यवाद!",
    feedbackSubmittedDesc: "तुमचा अभिप्राय नगरएक्स सुधारण्यास मदत करतो.",
    submitAnother: "दुसरा सादर करा →",
    rateExperience: "तुम्ही तुमच्या अनुभवाला कसे रेटिंग द्याल?",
    ratingNames: ["", "वाईट", "साधारण", "चांगले", "खूप छान", "उत्कृष्ट"],
    placeholderThoughts: "तुमचे विचार किंवा सूचना सामायिक करा…",
    sendFeedback: "अभिप्राय पाठवा",
  },
  bn: {
    updatesTitle: "সাম্প্রতিক আপডেট",
    noUpdates: "কোনো অফিশিয়াল আপডেট নেই।",
    noUpdatesDesc: "কর্তৃপক্ষ সমস্যা সমাধান করলে এখানে আপডেট দৃশ্যমান হবে।",
    announcement: "— ঘোষণা",
    markedResolved: "— মীমাংসিত চিহ্নিত",
    feedbackTitle: "মতামত",
    feedbackSubmittedTitle: "ধন্যবাদ!",
    feedbackSubmittedDesc: "আপনার মতামত নগরএক্স কে আরও উন্নত করতে সাহায্য করবে।",
    submitAnother: "আরেকটি জমা দিন →",
    rateExperience: "আপনার অভিজ্ঞতা কেমন ছিল?",
    ratingNames: ["", "বাজে", "মোটামুটি", "ভালো", "খুব ভালো", "চমৎকার"],
    placeholderThoughts: "আপনার চিন্তাভাবনা বা পরামর্শ শেয়ার করুন…",
    sendFeedback: "মতামত পাঠান",
  },
  gu: {
    updatesTitle: "તાજેતરના અપડેટ્સ",
    noUpdates: "હજુ સુધી કોઈ સત્તાવાર અપડેટ નથી.",
    noUpdatesDesc: "અધિકારીઓ દ્વારા સમસ્યાઓનું નિરાકરણ લાવવામાં આવે ત્યારે અપડેટ્સ દેખાશે.",
    announcement: "— જાહેરાત",
    markedResolved: "— નિવારણ થયેલ ચિહ્નિત",
    feedbackTitle: "પ્રતિસાદ",
    feedbackSubmittedTitle: "ખૂબ ખૂબ આભાર!",
    feedbackSubmittedDesc: "આપનો પ્રતિસાદ નગરએક્સને વધુ બહેતર બનાવવામાં મદદ કરે છે.",
    submitAnother: "બીજો સબમિટ કરો →",
    rateExperience: "આપ આપના અનુભવને કેવી રીતે રેટ કરશો?",
    ratingNames: ["", "નબળું", "સાધારણ", "સારું", "ખૂબ સારું", "ઉત્કૃષ્ટ"],
    placeholderThoughts: "આપના વિચારો અથવા સૂચનો શેર કરો…",
    sendFeedback: "પ્રતિસાદ મોકલો",
  },
  pa: {
    updatesTitle: "ਤਾਜ਼ਾ ਅਪਡੇਟਸ",
    noUpdates: "ਅਜੇ ਤੱਕ ਕੋਈ ਅਧਿਕਾਰਤ ਅਪਡੇਟ ਨਹੀਂ ਹੈ।",
    noUpdatesDesc: "ਜਦੋਂ ਅਧਿਕਾਰੀਆਂ ਦੁਆਰਾ ਮੁੱਦਿਆਂ ਦਾ ਹੱਲ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਤਾਂ ਇੱਥੇ ਅਪਡੇਟ ਦਿਖਾਈ ਦਿੰਦੇ ਹਨ।",
    announcement: "— ਘੋਸ਼ਣਾ",
    markedResolved: "— ਹੱਲ ਕੀਤਾ ਗਿਆ",
    feedbackTitle: "ਫੀਡਬੈਕ",
    feedbackSubmittedTitle: "ਧੰਨਵਾਦ!",
    feedbackSubmittedDesc: "ਤੁਹਾਡਾ ਫੀਡਬੈਕ ਨਗਰਐਕਸ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
    submitAnother: "ਇੱਕ ਹੋਰ ਭੇਜੋ →",
    rateExperience: "ਤੁਸੀਂ ਆਪਣੇ ਅਨੁਭਵ ਨੂੰ ਕਿਵੇਂ ਰੇਟ ਕਰੋਗੇ?",
    ratingNames: ["", "ਖਰਾਬ", "ਠੀਕ-ਠਾਕ", "ਵਧੀਆ", "ਬਹੁਤ ਵਧੀਆ", "ਸ਼ਾਨਦਾਰ"],
    placeholderThoughts: "ਆਪਣੇ ਵਿਚਾਰ ਜਾਂ ਸੁਝਾਅ ਸਾਂਝੇ ਕਰੋ…",
    sendFeedback: "ਫੀਡਬੈਕ ਭੇਜੋ",
  }
};

function RecentUpdates() {
  const { language } = useLanguage();
  const t = RIGHT_TRANSLATIONS[language];
  const tCat = CATEGORY_NAMES[language];

  const { data, isLoading } = useQuery<UpdateRow[]>({

    queryKey: ["recent-authority-updates"],
    queryFn: async () => {
      try {
        const { data: annData, error: err1 } = await supabase
          .from("authority_updates")
          .select("id, title, category, created_at, content")
          .order("created_at", { ascending: false })
          .limit(5);

        if (err1) {
          console.error("RightSidebar authority_updates query error:", err1);
        }
        if (err1 && !isAbortLike(err1)) throw err1;

        const { data: resolvedData, error: err2 } = await supabase
          .from("grievances")
          .select("id, title, category, resolved_at")
          .eq("status", "resolved")
          .not("resolved_at", "is", null)
          .order("resolved_at", { ascending: false })
          .limit(5);

        if (err2) {
          console.error("RightSidebar grievances query error:", err2);
        }
        if (err2 && !isAbortLike(err2)) throw err2;

        console.log("RightSidebar fetched:", { annData, resolvedData });

        const combined: UpdateRow[] = [];

        if (annData) {
          annData.forEach((x) => {
            combined.push({
              id: x.id,
              title: x.title,
              category: x.category || "Others",
              created_at: x.created_at,
              content: x.content,
              is_announcement: true,
            });
          });
        }

        if (resolvedData) {
          resolvedData.forEach((x) => {
            combined.push({
              id: x.id,
              title: x.title,
              category: (x as any).category || "Others",
              created_at: x.resolved_at!,
              is_announcement: false,
            });
          });
        }

        // Sort by created_at desc
        combined.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        return combined.slice(0, 5);
      } catch (e) {
        if (isAbortLike(e)) return [];
        throw e;
      }
    },
    refetchInterval: 30_000,
  });

  return (
    <section className="flex flex-col flex-1 min-h-0 bg-white dark:bg-[#0F1A2E] rounded-[18px] border border-[#E2E8F0] dark:border-[#1B2B48] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Megaphone className="h-[18px] w-[18px] text-[#001F5C] dark:text-[#38BDF8]" strokeWidth={2.2} />
          {t.updatesTitle}
        </h3>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-muted shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-muted rounded w-4/5" />
                  <div className="h-2.5 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
            <AlertCircle className="h-5 w-5 text-slate-300" />
            <p className="text-[12px] text-slate-400 font-medium">{t.noUpdates}</p>
            <p className="text-[11px] text-slate-400">{t.noUpdatesDesc}</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {data.map((u) => {
              const dot = DOT_COLOR[u.category] ?? "bg-[#64748B]";
              const translatedDeptLabel = tCat[u.category] ?? u.category;
              return (
                <li key={u.id} className="flex gap-3">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 rounded-full ${dot} shrink-0 ring-2 ring-white dark:ring-[#0F1A2E]`}
                    title={translatedDeptLabel}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-slate-800 dark:text-white leading-snug font-semibold line-clamp-2">
                      {u.title} {u.is_announcement ? t.announcement : t.markedResolved}
                    </p>
                    {u.is_announcement && u.content && (
                      <p className="text-[11.5px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {u.content}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {u.created_at ? timeAgo(u.created_at, language) : ""}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

// ─── Feedback Section ─────────────────────────────────────────────────────────

const RATINGS = [1, 2, 3, 4, 5];

function FeedbackSection() {
  const { language } = useLanguage();
  const t = RIGHT_TRANSLATIONS[language];

  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating && !message.trim()) return;
    // In a real app this would POST to an API / Supabase
    setSubmitted(true);
  };

  return (
    <section className="flex flex-col flex-1 min-h-0 bg-white dark:bg-[#0F1A2E] rounded-[18px] border border-[#E2E8F0] dark:border-[#1B2B48] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] p-5">
      <h3 className="text-[14px] font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 mb-4">
        <MessageCircle className="h-[18px] w-[18px] text-[#001F5C] dark:text-[#38BDF8]" strokeWidth={2.2} />
        {t.feedbackTitle}
      </h3>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
          <div className="h-11 w-11 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Send className="h-5 w-5 text-green-600 dark:text-green-400" strokeWidth={2.2} />
          </div>
          <p className="text-[13px] font-semibold text-slate-800 dark:text-white">{t.feedbackSubmittedTitle}</p>
          <p className="text-[11.5px] text-slate-500 dark:text-slate-400">{t.feedbackSubmittedDesc}</p>
          <button
            onClick={() => { setSubmitted(false); setRating(0); setMessage(""); }}
            className="text-[11.5px] font-semibold text-[#001F5C] dark:text-[#38BDF8] hover:underline mt-1"
          >
            {t.submitAnother}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Star rating */}
          <div>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium mb-2">
              {t.rateExperience}
            </p>
            <div className="flex items-center gap-1.5">
              {RATINGS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(r)}
                  onMouseEnter={() => setHovered(r)}
                  onMouseLeave={() => setHovered(0)}
                  className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition-colors",
                      r <= (hovered || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-slate-300 dark:text-slate-600",
                    )}
                    strokeWidth={1.8}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {t.ratingNames[rating]}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.placeholderThoughts}
            rows={3}
            className="w-full resize-none rounded-xl border border-[#E2E8F0] dark:border-[#1B2B48] bg-slate-50 dark:bg-[#060F1E] px-3.5 py-2.5 text-[12.5px] text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 transition-all"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={!rating && !message.trim()}
            className={cn(
              "flex items-center justify-center gap-2 w-full rounded-full py-2.5 text-[12.5px] font-bold transition-all",
              rating || message.trim()
                ? "bg-[#001F5C] text-white hover:bg-[#001A4D] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] shadow-[0_6px_20px_-8px_rgba(0,31,92,0.55)]"
                : "bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed",
            )}
          >
            <Send className="h-3.5 w-3.5" strokeWidth={2.3} />
            {t.sendFeedback}
          </button>
        </form>
      )}
    </section>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RightSidebar({ grievances = [] }: { grievances?: GrievanceRow[] }) {
  return (
    <aside className="hidden xl:flex flex-col w-80 shrink-0 gap-5 py-5 pr-5 pl-2 h-full overflow-hidden">
      <RecentUpdates />
      <FeedbackSection />
    </aside>
  );
}

