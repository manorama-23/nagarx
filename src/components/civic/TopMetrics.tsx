import { Trophy, CheckCircle2, Timer, Users, ArrowUpRight, ArrowDownRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Metric = {
  label: string;
  value: string;
  sub: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  iconBg: string;
  iconColor: string;
  trendDir: "up" | "down";
  trendValue: string;
  good: boolean;
};

const metrics: Metric[] = [
  {
    label: "Resolution Rate",
    sub: "",
    value: "98%",
    icon: CheckCircle2,
    iconBg: "bg-[#D1FAE5]",
    iconColor: "text-[#10B981]",
    trendDir: "up",
    trendValue: "2%",
    good: true,
  },
  {
    label: "Avg. Resolution Time",
    sub: "",
    value: "2.4 Days",
    icon: Timer,
    iconBg: "bg-[#EDE9FE]",
    iconColor: "text-[#8B5CF6]",
    trendDir: "down",
    trendValue: "1.2%",
    good: true,
  },
  {
    label: "New Grievances",
    sub: "",
    value: "1,248",
    icon: Users,
    iconBg: "bg-[#DBEAFE]",
    iconColor: "text-[#3B82F6]",
    trendDir: "up",
    trendValue: "14%",
    good: true,
  },
];

export function TopMetrics({
  newCount,
  resolutionRate,
}: {
  newCount?: number;
  resolutionRate?: number;
}) {
  const [range, setRange] = useState("This Month");
  const [open, setOpen] = useState(false);

  const ranges = ["This Month", "Last Month", "Last 3 Months", "This Year"];

  const display: Metric[] = metrics.map((m, i) => {
    if (i === 2 && newCount != null) return { ...m, value: newCount.toLocaleString() };
    if (i === 0 && resolutionRate != null) return { ...m, value: `${resolutionRate}%` };
    return m;
  });

  return (
    <section className="bg-white dark:bg-[#0F1A2E] rounded-[18px] border border-[#E2E8F0] dark:border-[#1B2B48] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] p-5 sm:p-[22px] flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FEF3C7]">
            <Trophy className="h-4.5 w-4.5 text-[#F59E0B]" strokeWidth={2.2} />
          </span>
          <h3 className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
            Top Metrics
          </h3>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full border border-[#E2E8F0] dark:border-[#1B2B48] bg-white dark:bg-[#0F1A2E] hover:bg-slate-50 dark:hover:bg-white/5 px-3 py-1.5 text-[11.5px] font-semibold text-slate-700 dark:text-white transition-colors"
          >
            {range}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} strokeWidth={2.4} />
          </button>
          {open && (
            <div
              onMouseLeave={() => setOpen(false)}
              className="absolute right-0 mt-1.5 z-20 w-40 rounded-2xl border border-[#E2E8F0] dark:border-[#1B2B48] bg-white dark:bg-[#0F1A2E] shadow-xl p-1 animate-in fade-in"
            >
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRange(r);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl text-[11.5px] font-semibold transition-colors",
                    r === range
                      ? "bg-[#EEF2FF] text-[#001F5C] dark:bg-white/10 dark:text-[#38BDF8]"
                      : "text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ul className="flex-1 space-y-2.5 min-h-0">
        {display.map((m) => {
          const Icon = m.icon;
          const trendIsUp = m.trendDir === "up";
          const trendColor =
            (m.good && trendIsUp) || (!m.good && !trendIsUp)
              ? "text-[#10B981] bg-[#D1FAE5]"
              : "text-[#EF4444] bg-[#FEE2E2]";
          return (
            <li
              key={m.label}
              className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all"
            >
              <span
                className={cn(
                  "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full",
                  m.iconBg,
                )}
              >
                <Icon className={cn("h-[22px] w-[22px]", m.iconColor)} strokeWidth={2.2} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[15px] font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {m.value}
                  </p>
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10.5px] font-extrabold",
                      trendColor,
                    )}
                  >
                    {trendIsUp ? (
                      <ArrowUpRight className="h-3 w-3 -ml-0.5" strokeWidth={2.7} />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 -ml-0.5" strokeWidth={2.7} />
                    )}
                    {m.trendValue}
                  </span>
                </div>
                <div className="mt-0.5 flex items-baseline justify-between gap-3">
                  <p className="text-[11.5px] text-muted-foreground font-medium">
                    {m.label}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
