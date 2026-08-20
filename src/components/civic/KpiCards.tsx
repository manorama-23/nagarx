import { Megaphone, CheckCircle2, Clock3, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage, type Language } from "@/lib/language";

type Trend = { dir: "up" | "down"; value: string };

type Kpi = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  iconBg: string;
  iconColor: string;
  cardBg: string;
  trend: Trend;
};

const kpis: Kpi[] = [
  {
    label: "Total Grievances",
    value: "1,248",
    icon: Megaphone,
    iconBg: "bg-[#FEE2E2]",
    iconColor: "text-[#EF4444]",
    cardBg: "bg-[#FFF5F5] dark:bg-[#1f1420]",
    trend: { dir: "up", value: "12%" },
  },
  {
    label: "Resolved",
    value: "892",
    icon: CheckCircle2,
    iconBg: "bg-[#D1FAE5]",
    iconColor: "text-[#10B981]",
    cardBg: "bg-[#ECFDF5] dark:bg-[#0e2a20]",
    trend: { dir: "up", value: "18%" },
  },
  {
    label: "In Progress",
    value: "256",
    icon: Clock3,
    iconBg: "bg-[#EDE9FE]",
    iconColor: "text-[#8B5CF6]",
    cardBg: "bg-[#F5F3FF] dark:bg-[#1d1a34]",
    trend: { dir: "down", value: "6%" },
  },
  {
    label: "Active Users",
    value: "5,432",
    icon: Users,
    iconBg: "bg-[#DBEAFE]",
    iconColor: "text-[#3B82F6]",
    cardBg: "bg-[#EFF6FF] dark:bg-[#11243f]",
    trend: { dir: "up", value: "14%" },
  },
];

const KPI_TRANSLATIONS: Record<Language, {
  totalGrievances: string;
  resolved: string;
  inProgress: string;
  activeUsers: string;
  thisMonth: string;
}> = {
  en: {
    totalGrievances: "Total Grievances",
    resolved: "Resolved",
    inProgress: "In Progress",
    activeUsers: "Active Users",
    thisMonth: "this month",
  },
  hi: {
    totalGrievances: "कुल शिकायतें",
    resolved: "समाधानित",
    inProgress: "प्रगति पर",
    activeUsers: "सक्रिय उपयोगकर्ता",
    thisMonth: "इस महीने",
  },
  ta: {
    totalGrievances: "மொத்த புகார்கள்",
    resolved: "தீர்க்கப்பட்டது",
    inProgress: "செயல்பாட்டில்",
    activeUsers: "செயலில் உள்ள பயனர்கள்",
    thisMonth: "இந்த மாதம்",
  },
  te: {
    totalGrievances: "మొత్తం ఫిర్యాదులు",
    resolved: "పరిష్కరించబడింది",
    inProgress: "ప్రగతిలో ఉంది",
    activeUsers: "క్రియాశీల వినియోగదారులు",
    thisMonth: "ఈ నెల",
  },
  or: {
    totalGrievances: "ସମୁଦାୟ ଅଭିଯୋଗ",
    resolved: "ସମାଧାନ ହୋଇଛି",
    inProgress: "ପ୍ରକ୍ରିୟାଧୀନ",
    activeUsers: "ସକ୍ରିୟ ବ୍ୟବହାରକାରୀ",
    thisMonth: "ଏହି ମାସ",
  },
  mr: {
    totalGrievances: "एकूण तक्रारी",
    resolved: "निवारण झाले",
    inProgress: "प्रगतीत",
    activeUsers: "सक्रिय वापरकर्ते",
    thisMonth: "या महिन्यात",
  },
  bn: {
    totalGrievances: "মোট অভিযোগ",
    resolved: "মীমাংসিত",
    inProgress: "চলমান",
    activeUsers: "সক্রিয় ব্যবহারকারী",
    thisMonth: "এই মাস",
  },
  gu: {
    totalGrievances: "કુલ ફરિયાદો",
    resolved: "નિવારણ થયેલ",
    inProgress: "પ્રક્રિયા ચાલુ",
    activeUsers: "સક્રિય વપરાશકર્તાઓ",
    thisMonth: "આ મહિને",
  },
  pa: {
    totalGrievances: "ਕੁੱਲ ਸ਼ਿਕਾਇਤਾਂ",
    resolved: "ਹੱਲ ਕੀਤਾ",
    inProgress: "ਚੱਲ ਰਿਹਾ ਹੈ",
    activeUsers: "ਸਰਗਰਮ ਉਪਭੋਗਤਾ",
    thisMonth: "ਇਸ ਮਹੀਨੇ",
  },
};

export function KpiCards({
  totalOverride,
  resolvedOverride,
  inProgressOverride,
  activeUsersOverride,
}: {
  totalOverride?: number;
  resolvedOverride?: number;
  inProgressOverride?: number;
  activeUsersOverride?: number;
}) {
  const { language } = useLanguage();
  const t = KPI_TRANSLATIONS[language];

  const display = kpis.map((k, i) => {
    let val = k.value;
    if (i === 0 && totalOverride != null) val = totalOverride.toLocaleString();
    if (i === 1 && resolvedOverride != null) val = resolvedOverride.toLocaleString();
    if (i === 2 && inProgressOverride != null) val = inProgressOverride.toLocaleString();
    if (i === 3 && activeUsersOverride != null) val = activeUsersOverride.toLocaleString();

    let label = k.label;
    if (i === 0) label = t.totalGrievances;
    if (i === 1) label = t.resolved;
    if (i === 2) label = t.inProgress;
    if (i === 3) label = t.activeUsers;

    return { ...k, value: val, label };
  });

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {display.map((k) => {
        const Icon = k.icon;
        const up = k.trend.dir === "up";
        return (
          <div
            key={k.label}
            className={cn(
              "rounded-[18px] border border-white/80 dark:border-white/5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] p-5 overflow-hidden relative",
              k.cardBg,
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full shrink-0",
                  k.iconBg,
                )}
              >
                <Icon className={cn("h-[22px] w-[22px]", k.iconColor)} strokeWidth={2.2} />
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-[11.5px] font-semibold",
                  up
                    ? "text-[#10B981]"
                    : "text-[#EF4444]",
                )}
              >
                {up ? (
                  <ArrowUpRight className="h-3.5 w-3.5 -ml-0.5" strokeWidth={2.6} />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 -ml-0.5" strokeWidth={2.6} />
                )}
                <span className="font-bold">{k.trend.value}</span>
                <span className="text-muted-foreground/80 dark:text-white/50 ml-0.5">
                  {t.thisMonth}
                </span>
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[11.5px] font-bold uppercase tracking-[0.04em] text-muted-foreground dark:text-slate-400">
                {k.label}
              </p>
              <p className="mt-1 text-[28px] sm:text-[30px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                {k.value}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
