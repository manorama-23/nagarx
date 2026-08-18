import { Megaphone, CheckCircle2, Clock3, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const display: Kpi[] = kpis.map((k, i) => {
    if (i === 0 && totalOverride != null)
      return { ...k, value: totalOverride.toLocaleString() };
    if (i === 1 && resolvedOverride != null)
      return { ...k, value: resolvedOverride.toLocaleString() };
    if (i === 2 && inProgressOverride != null)
      return { ...k, value: inProgressOverride.toLocaleString() };
    if (i === 3 && activeUsersOverride != null)
      return { ...k, value: activeUsersOverride.toLocaleString() };
    return k;
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
                  this month
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
