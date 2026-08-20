import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { BudgetBoard } from "@/components/civic/BudgetBoard";
import { DashboardHero } from "@/components/civic/DashboardHero";
import { DepartmentLoad } from "@/components/civic/DepartmentLoad";
import { GrievanceCard, type GrievanceRow } from "@/components/civic/GrievanceCard";
import { Header } from "@/components/civic/Header";
import { IssueHeatmap } from "@/components/civic/IssueHeatmap";
import { KpiCards } from "@/components/civic/KpiCards";
import { LeftSidebar } from "@/components/civic/LeftSidebar";
import { RecentGrievances } from "@/components/civic/RecentGrievances";
import { ReportIssueDialog } from "@/components/civic/ReportIssueDialog";
import { RightSidebar } from "@/components/civic/RightSidebar";
import { TopMetrics } from "@/components/civic/TopMetrics";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getPosition } from "@/lib/civic";
import { cn } from "@/lib/utils";
import { useLanguage, type Language } from "@/lib/language";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "NagarX — Your Voice • Our Responsibility" },
      {
        name: "description",
        content:
          "Jan Madad — A transparent civic platform to report, track and resolve grievances across campus and your city.",
      },
      { property: "og:title", content: "Jan Madad — Civic Grievance Portal" },
      {
        property: "og:description",
        content:
          "Transparent reporting for campus and city problems. Raise grievances, track progress, resolve together.",
      },
    ],
  }),
  component: Dashboard,
});

const INDEX_TRANSLATIONS: Record<Language, {
  titleGrievances: string;
  titleBudget: string;
  descGrievances: string;
  descBudget: string;
  offlineMode: string;
  tabActiveGrievances: string;
  tabBudgeting: string;
  loadingReports: string;
  noReports: string;
  haveFeedback: string;
  sendFeedback: string;
}> = {
  en: {
    titleGrievances: "Grievance Triage",
    titleBudget: "Participatory Budgeting",
    descGrievances: "All recent reports — upvote what you care about and track resolutions.",
    descBudget: "Vote on proposals that shape your neighbourhood and campus budget.",
    offlineMode: "(Unable to reach the server — showing offline mode.)",
    tabActiveGrievances: "Active Grievances",
    tabBudgeting: "Participatory Budgeting",
    loadingReports: "Loading reports…",
    noReports: "No reports in this scope yet.",
    haveFeedback: "Have feedback or need help?",
    sendFeedback: "Send us feedback →",
  },
  hi: {
    titleGrievances: "शिकायत समाधान",
    titleBudget: "भागीदारी बजट",
    descGrievances: "सभी हालिया रिपोर्ट — जिन्हें आप महत्वपूर्ण मानते हैं उन्हें वोट दें और समाधान ट्रैक करें।",
    descBudget: "उन प्रस्तावों पर वोट करें जो आपके पड़ोस और परिसर के बजट को आकार देते हैं।",
    offlineMode: "(सर्वर तक पहुँचने में असमर्थ — ऑफ़लाइन मोड दिखा रहा है।)",
    tabActiveGrievances: "सक्रिय शिकायतें",
    tabBudgeting: "भागीदारी बजट",
    loadingReports: "रिपोर्ट लोड हो रही हैं...",
    noReports: "इस क्षेत्र में अभी तक कोई रिपोर्ट नहीं है।",
    haveFeedback: "क्या आपके पास कोई प्रतिक्रिया है या मदद चाहिए?",
    sendFeedback: "हमें प्रतिक्रिया भेजें →",
  },
  ta: {
    titleGrievances: "குடிமை முறையீடுகள்",
    titleBudget: "பங்குபெறும் பட்ஜெட்",
    descGrievances: "அனைத்து சமீபத்திய புகார்கள் — நீங்கள் விரும்பும் புகாருக்கு வாக்களித்து தீர்வைக் கண்காணிக்கவும்.",
    descBudget: "உங்கள் பகுதி மற்றும் வளாக பட்ஜெட்டை வடிவமைக்கும் திட்டங்களுக்கு வாக்களிக்கவும்.",
    offlineMode: "(சேவையகத்தை இணைக்க முடியவில்லை — ஆஃப்லைன் பயன்முறை காட்டப்படுகிறது.)",
    tabActiveGrievances: "செயலில் உள்ள முறையீடுகள்",
    tabBudgeting: "பங்குபெறும் பட்ஜெட்",
    loadingReports: "புகார்கள் ஏற்றப்படுகின்றன...",
    noReports: "இந்த வரம்பில் இன்னும் புகார்கள் எதுவும் இல்லை.",
    haveFeedback: "உங்களுக்கு கருத்துக்கள் அல்லது உதவி தேவையா?",
    sendFeedback: "எங்களுக்கு கருத்துக்களை அனுப்பவும் →",
  },
  te: {
    titleGrievances: "విన్నపాల పరిష్కారం",
    titleBudget: "భాగస్వామ్య బడ్జెట్",
    descGrievances: "అన్ని ఇటీవలి నివేదికలు — మీరు శ్రద్ధ వహించే వాటికి ఓటు వేయండి మరియు పరిష్కారాలను ట్రాక్ చేయండి.",
    descBudget: "మీ పరిసరాలు మరియు క్యాంపస్ బడ్జెట్‌ను రూపొందించే ప్రతిపాదనలపై ఓటు వేయండి.",
    offlineMode: "(సర్వర్‌ను సంప్రదించలేకపోయింది — ఆఫ్‌లైన్ మోడ్ చూపుతోంది.)",
    tabActiveGrievances: "క్రియాశీల విన్నపాలు",
    tabBudgeting: "భాగస్వామ్య బడ్జెట్",
    loadingReports: "నివేదికలు లోడ్ అవుతున్నాయి...",
    noReports: "ఈ పరిధిలో ఇంకా ఎలాంటి నివేదికలు లేవు.",
    haveFeedback: "సలహాలు ఉన్నాయा లేదా సహాయం కావాలా?",
    sendFeedback: "మాకు సలహాలు పంపండి →",
  },
  or: {
    titleGrievances: "ଅଭିଯୋଗ ସମାଧାନ",
    titleBudget: "ସହଭାଗୀ ବଜେଟ୍",
    descGrievances: "ସମସ୍ତ ସମ୍ପ୍ରତି ରିପୋର୍ଟ — ଆପଣ ଗୁରୁତ୍ଵ ଦେଉଥିବା ସମସ୍ୟାକୁ ଭୋଟ୍ ଦିଅନ୍ତୁ ଏବଂ ସମାଧାନ ଟ୍ରାକ୍ କରନ୍ତୁ।",
    descBudget: "ଆପଣଙ୍କ ଅଞ୍ଚଳ ଏବଂ କ୍ୟାମ୍ପସ ବଜେଟ୍ ନିର୍ଣ୍ଣୟ କରୁଥିବା ପ୍ରସ୍ତାବଗୁଡ଼ିକ ଉପରେ ଭୋଟ୍ ଦିଅନ୍ତୁ।",
    offlineMode: "(ସର୍ଭର ସହ ସଂଯୋଗ ହୋଇପାରିଲା ନାହିଁ — ଅଫଲାଇନ୍ ମୋଡ୍ ଦେଖାଉଛି।)",
    tabActiveGrievances: "ସକ୍ରିୟ ଅଭିଯୋଗ",
    tabBudgeting: "ସହଭାଗୀ ବଜେଟ୍",
    loadingReports: "ରିପୋର୍ଟ ଲୋଡ୍ ହେଉଛି...",
    noReports: "ଏହି କ୍ଷେତ୍ରରେ କୌଣସି ରିପୋର୍ଟ ନାହିଁ।",
    haveFeedback: "ମତାମତ ଅଛି କିମ୍ବା ସାହାଯ୍ୟ ଦରକାର କି?",
    sendFeedback: "ଆମକୁ ମତାମତ ପଠାନ୍ତୁ →",
  },
  mr: {
    titleGrievances: "तक्रार निवारण",
    titleBudget: "सहभागी अर्थसंकल्प",
    descGrievances: "सर्व अलीकडील अहवाल — आपल्या आवडीच्या तक्रारींना मत द्या आणि निवारणांचा मागोवा घ्या.",
    descBudget: "आपल्या परिसर आणि कॅम्पसच्या बजेटला आकार देणाऱ्या प्रस्तावांवर मत द्या.",
    offlineMode: "(सर्व्हरशी संपर्क होऊ शकला नाही — ऑफलाइन मोड दाखवत आहे.)",
    tabActiveGrievances: "सक्रिय तक्रारी",
    tabBudgeting: "सहभागी अर्थसंकल्प",
    loadingReports: "अहवाल लोड होत आहेत...",
    noReports: "या क्षेत्रात अद्याप कोणतेही अहवाल नाहीत.",
    haveFeedback: "प्रतिक्रिया आहे किंवा मदत हवी आहे?",
    sendFeedback: "आम्हाला प्रतिक्रिया पाठवा →",
  },
  bn: {
    titleGrievances: "অভিযোগ সমাধান",
    titleBudget: "অংশগ্রহণমূলক বাজেট",
    descGrievances: "সব সাম্প্রতিক রিপোর্ট — যেগুলি আপনার কাছে গুরুত্বপূর্ণ সেগুলিতে ভোট দিন এবং সমাধান ট্র্যাক করুন।",
    descBudget: "আপনার প্রতিবেশী এবং ক্যাম্পাসের বাজেট নির্ধারণ করে এমন প্রস্তাবগুলিতে ভোট দিন।",
    offlineMode: "(সার্ভারে পৌঁছানো যাচ্ছে না — অফলাইন মোড দেখানো হচ্ছে।)",
    tabActiveGrievances: "সক্রিয় অভিযোগ",
    tabBudgeting: "অংশগ্রহণমূলক বাজেট",
    loadingReports: "রিপোর্ট লোড হচ্ছে...",
    noReports: "এই পরিধিতে এখনও কোনও রিপোর্ট নেই।",
    haveFeedback: "মতামত আছে বা সাহায্য প্রয়োজন?",
    sendFeedback: "আমাদের মতামত পাঠান →",
  },
  gu: {
    titleGrievances: "ફરિયાદ નિવારણ",
    titleBudget: "ભાગીદારી બજેટિંગ",
    descGrievances: "તમામ તાજેતરના અહેવાલો — જે સમસ્યા તમારા માટે મહત્વની હોય તેને વોટ આપો અને ઉકેલ ટ્રેક કરો.",
    descBudget: "તમારા પડોશ અને કેમ્પસના બજેટને આકાર આપતી દરખાસ્તો પર વોટ કરો.",
    offlineMode: "(સર્વર સાથે કનેક્ટ થઈ શક્યું નથી — ઑફલાઇન મોડ બતાવે છે.)",
    tabActiveGrievances: "સક્રિય ફરિયાદો",
    tabBudgeting: "ભાગીદારી બજેટિંગ",
    loadingReports: "અહેવાલો લોડ થઈ રહ્યા છે...",
    noReports: "આ ક્ષેત્રમાં હજુ સુધી કોઈ અહેવાલ નથી.",
    haveFeedback: "પ્રતિસાદ છે કે મદદની જરૂર છે?",
    sendFeedback: "અમને પ્રતિસાદ મોકલો →",
  },
  pa: {
    titleGrievances: "ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਣ",
    titleBudget: "ਭਾਗੀਦਾਰੀ ਬਜਟ",
    descGrievances: "ਸਾਰੀਆਂ ਹਾਲੀਆ ਰਿਪੋਰਟਾਂ — ਜੋ ਤੁਹਾਡੇ ਲਈ ਮਹੱਤਵਪੂਰਨ ਹਨ ਉਨ੍ਹਾਂ ਨੂੰ ਵੋਟ ਦਿਓ ਅਤੇ ਹੱਲ ਟ੍ਰੈਕ ਕਰੋ ਭਾਈਚਾਰਾ ਲਓ।",
    descBudget: "ਉਨ੍ਹਾਂ ਪ੍ਰਸਤਾਵਾਂ 'ਤੇ ਵੋਟ ਪਾਓ ਜੋ ਤੁਹਾਡੇ ਆਂਢ-ਗੁਆਂਢ ਅਤੇ ਕੈਂਪਸ ਦੇ ਬਜਟ ਨੂੰ ਨਿਰਧਾਰਤ ਕਰਦੇ ਹਨ।",
    offlineMode: "(ਸਰਵਰ ਨਾਲ ਸੰਪਰਕ ਨਹੀਂ ਹੋ ਸਕਿਆ — ਔਫਲਾਈਨ ਮੋਡ ਦਿਖਾ ਰਿਹਾ ਹੈ।)",
    tabActiveGrievances: "ਸਰਗਰਮ ਸ਼ਿਕਾਇਤਾਂ",
    tabBudgeting: "ਭਾਗੀਦਾਰੀ ਬਜਟ",
    loadingReports: "ਰਿਪੋਰਟਾਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ...",
    noReports: "ਇਸ ਖੇਤਰ ਵਿੱਚ ਅਜੇ ਕੋਈ ਰਿਪੋਰਟ ਨਹੀਂ ਹੈ।",
    haveFeedback: "ਕੋਈ ਪ੍ਰਤੀਕਿਰਿਆ ਹੈ ਜਾਂ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    sendFeedback: "ਸਾਨੂੰ ਪ੍ਰਤੀਕਿਰਿਆ ਭੇਜੋ →",
  },
};

function Dashboard() {
  const { session, isAuthority } = useAuth();
  const { language } = useLanguage();
  const t = INDEX_TRANSLATIONS[language];
  const [tab, setTab] = useState<"grievances" | "budget">("grievances");
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const navigate = Route.useNavigate();

  useEffect(() => {
    getPosition()
      .then(setOrigin)
      .catch(() => setOrigin(null));
  }, []);

  const { data: grievances = [], isLoading, error } = useQuery({
    queryKey: ["grievances"],
    queryFn: async () => {
      try {
        const { data, error: qError } = await supabase
          .from("grievances")
          .select("*, author:profiles!grievances_user_id_fkey(full_name)")
          .order("created_at", { ascending: false })
          .limit(200);
        if (qError) {
          const m = String(qError?.message ?? "");
          if (/aborted|network_io_suspended|Failed to fetch|user aborted/i.test(m)) {
            return [] as unknown as GrievanceRow[];
          }
          throw qError;
        }
        return (data ?? []) as unknown as GrievanceRow[];
      } catch (e) {
        const m = e instanceof Error ? e.message : String(e ?? "");
        if (/aborted|network_io_suspended|Failed to fetch|user aborted/i.test(m)) {
          return [] as unknown as GrievanceRow[];
        }
        throw e;
      }
    },
  });

  const { data: profilesCount = 0 } = useQuery({
    queryKey: ["profiles-count"],
    queryFn: async () => {
      try {
        const { count, error: pcError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });
        if (pcError) {
          const m = String(pcError?.message ?? "");
          if (/aborted|network_io_suspended|Failed to fetch|user aborted/i.test(m)) {
            return 0;
          }
          throw pcError;
        }
        return count ?? 0;
      } catch (e) {
        const m = e instanceof Error ? e.message : String(e ?? "");
        if (/aborted|network_io_suspended|Failed to fetch|user aborted/i.test(m)) {
          return 0;
        }
        throw e;
      }
    },
  });

  const { data: myVotes = [] } = useQuery({
    queryKey: ["my-votes", session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      try {
        const { data: vData, error: vError } = await supabase
          .from("votes")
          .select("grievance_id")
          .eq("user_id", session!.user.id);
        if (vError) {
          const m = String(vError?.message ?? "");
          if (/aborted|network_io_suspended|Failed to fetch|user aborted/i.test(m)) {
            return [];
          }
          throw vError;
        }
        return (vData ?? []).map((v) => v.grievance_id);
      } catch (e) {
        const m = e instanceof Error ? e.message : String(e ?? "");
        if (/aborted|network_io_suspended|Failed to fetch|user aborted/i.test(m)) {
          return [];
        }
        throw e;
      }
    },
  });

  const visible = grievances;
  const total = grievances.length;
  const resolved = grievances.filter((g) => g.status === "resolved").length;
  const inProgress = grievances.filter((g) => g.status === "in_progress").length;
  const rate = total > 0 ? Math.round((resolved / total) * 100) : 98;

  const raiseGrievance = () => {
    if (!session) {
      window.location.href = "/login";
      return;
    }
    if (isAuthority) {
      navigate({ to: "/authority" });
      return;
    }
    setReportOpen(true);
  };

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground flex flex-col">
      <Header />

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="mx-auto flex h-full max-w-[1600px] w-full">
          <LeftSidebar onRaiseGrievance={raiseGrievance} grievances={grievances} isAuthority={isAuthority} />

          <main id="main-scroll" className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6 lg:py-8 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div id="section-top"><DashboardHero /></div>

            <div id="section-reports" className="mt-6">
              <KpiCards
                totalOverride={total}
                resolvedOverride={resolved}
                inProgressOverride={inProgress}
                activeUsersOverride={profilesCount}
              />
            </div>

            <div id="section-departments" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
              <RecentGrievances grievances={grievances} onRaise={raiseGrievance} isAuthority={isAuthority} />
              <DepartmentLoad />
            </div>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
              <IssueHeatmap />
              <TopMetrics newCount={total} resolutionRate={rate} />
            </div>

            <section id="section-grievances" className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                    {tab === "grievances" ? t.titleGrievances : t.titleBudget}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tab === "grievances"
                      ? t.descGrievances
                      : t.descBudget}
                    {error ? (
                      <span className="ml-2 text-[#EF4444] font-medium">
                        {t.offlineMode}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>

              <div className="inline-flex rounded-2xl border dark:border-[#1B2B48] border-[#E2E8F0] bg-card p-1 shadow-sm mb-6">
                {(
                  [
                    ["grievances", t.tabActiveGrievances],
                    ["budget", t.tabBudgeting],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={cn(
                      "rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-200",
                      tab === key
                        ? "bg-[#EEF2FF] text-[#0A2558] dark:bg-white/10 dark:text-[#38BDF8] shadow-inner"
                        : "text-muted-foreground hover:text-card-foreground",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {tab === "grievances" ? (
                isLoading ? (
                  <div className="surface p-14 text-center">
                    <p className="text-sm text-muted-foreground">{t.loadingReports}</p>
                  </div>
                ) : visible.length === 0 ? (
                  <div className="surface p-14 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t.noReports}
                    </p>
                  </div>
                ) : (
                  <GrievancesGrid
                    grievances={visible}
                    votedIds={new Set(myVotes)}
                    origin={origin}
                  />
                )
              ) : (
                <BudgetBoard scopeFilter="all" />
              )}
            </section>
            <div id="section-feedback" className="mt-10 pb-6 text-center">
              <p className="text-sm text-muted-foreground font-medium">{t.haveFeedback}</p>
              <a
                href="mailto:feedback@nagarx.in"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#001F5C] dark:text-[#38BDF8] hover:underline"
              >
                {t.sendFeedback}
              </a>
            </div>
          </main>

          <RightSidebar grievances={grievances} />
        </div>
      </div>

      <ReportIssueDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        trigger={false}
      />
    </div>
  );
}

function GrievancesGrid({
  grievances,
  votedIds,
  origin,
}: {
  grievances: GrievanceRow[];
  votedIds: Set<string>;
  origin?: { lat: number; lng: number } | null;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {grievances.map((g) => (
        <GrievanceCard
          key={g.id}
          grievance={g}
          votedIds={votedIds}
          origin={origin ?? null}
        />
      ))}
    </div>
  );
}
