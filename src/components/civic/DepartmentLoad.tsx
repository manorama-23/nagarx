import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const DEPT_META = [
  { label: "Public Works", bar: "from-[#3B82F6] to-[#60A5FA]", color: "#3B82F6" },
  { label: "Sanitation", bar: "from-[#10B981] to-[#34D399]", color: "#10B981" },
  { label: "Electrical", bar: "from-[#8B5CF6] to-[#A78BFA]", color: "#8B5CF6" },
  { label: "Water Utility", bar: "from-[#06B6D4] to-[#22D3EE]", color: "#06B6D4" },
  { label: "Parks", bar: "from-[#F97316] to-[#FB923C]", color: "#F97316" },
  { label: "Others", bar: "from-[#64748B] to-[#94A3B8]", color: "#64748B" },
];

export function DepartmentLoad() {
  function isAbortLike(err: unknown): boolean {
    if (err instanceof DOMException && err.name === "AbortError") return true;
    const m = err instanceof Error ? err.message : String(err ?? "");
    return /aborted|network_io_suspended|Failed to fetch|The user aborted|request to .* failed/i.test(m);
  }

  const { data: counts, isLoading } = useQuery<Record<string, number>>({
    queryKey: ["dept-load"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("grievances")
          .select("category")
          .neq("status", "resolved");
        if (error) {
          if (isAbortLike(error)) return {};
          throw error;
        }
        const map: Record<string, number> = {};
        for (const row of (data ?? []) as unknown as { category: string }[]) {
          const key = row.category ?? "Others";
          map[key] = (map[key] ?? 0) + 1;
        }
        return map;
      } catch (e) {
        if (isAbortLike(e)) return {};
        throw e;
      }
    },
    refetchInterval: 60_000, // refresh every minute
  });

  const departments = DEPT_META.map((d) => ({
    ...d,
    value: counts?.[d.label] ?? 0,
  }));

  const max = Math.max(...departments.map((d) => d.value), 1);
  // round up topTick dynamically to render a compact, clean graph
  let topTick = 5;
  if (max <= 2) {
    topTick = 2;
  } else if (max <= 5) {
    topTick = 5;
  } else {
    topTick = Math.ceil(max / 5) * 5;
  }

  const yTicks: number[] = [];
  if (topTick <= 5) {
    for (let i = 0; i <= topTick; i++) {
      yTicks.push(i);
    }
  } else {
    for (let i = 0; i <= 4; i++) {
      const v = Math.round((topTick / 4) * i);
      if (yTicks.length === 0 || yTicks[yTicks.length - 1] !== v) yTicks.push(v);
    }
    if (yTicks[yTicks.length - 1] !== topTick) yTicks.push(topTick);
  }

  return (
    <section className="bg-white dark:bg-[#0F1A2E] rounded-[18px] border border-[#E2E8F0] dark:border-[#1B2B48] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] p-5 sm:p-[22px] flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DBEAFE]">
              <BarChart3 className="h-4.5 w-4.5 text-[#3B82F6]" strokeWidth={2.2} />
            </span>
            <h3 className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
              Department Load
            </h3>
          </div>
          <p className="mt-1.5 text-[12px] text-muted-foreground font-medium">
            Current Active Grievances by Department
          </p>
        </div>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-[11.5px] font-bold text-[#001F5C] dark:text-[#38BDF8] hover:underline shrink-0 mt-1"
        >
          View Details
        </a>
      </div>

      {isLoading ? (
        <div className="relative flex-1 pl-7 pr-1 mt-5 flex flex-col justify-end">
          <div className="relative flex-1 min-h-[140px] w-full grid grid-cols-6 items-end gap-1.5 sm:gap-2">
            {DEPT_META.map((d) => (
              <div key={d.label} className="relative h-full flex items-end justify-center px-0.5">
                <div className="w-full max-w-[44px] rounded-t-[10px] bg-muted animate-pulse" style={{ height: `${Math.random() * 60 + 20}%` }} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2 mt-3.5">
            {DEPT_META.map((d) => (
              <div key={d.label} className="h-8 flex flex-col justify-start">
                <p className="text-[9.5px] font-semibold leading-tight text-muted-foreground/50 text-center line-clamp-2">
                  {d.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative flex-1 pl-7 pr-1 mt-5 flex flex-col justify-end">
          {/* Chart Plot Area */}
          <div className="relative flex-1 min-h-[140px] w-full">
            {/* Y-Axis Grid Lines */}
            <div className="absolute inset-0">
              {yTicks
                .slice()
                .reverse()
                .map((t, i, arr) => {
                  const topPct = (i / (arr.length - 1)) * 100;
                  return (
                    <div
                      key={`yt-${i}-${t}`}
                      className={cn(
                        "absolute left-0 right-0 border-t border-dashed flex",
                        i === arr.length - 1
                          ? "border-t border-[#E2E8F0] dark:border-[#1B2B48]"
                          : "border-[#E2E8F0]/70 dark:border-[#1B2B48]/70",
                      )}
                      style={{ top: `${topPct}%` }}
                    >
                      <span className="-translate-x-full pr-2 -translate-y-1/2 text-[10px] font-mono font-semibold text-muted-foreground/80 absolute left-0">
                        {t}
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* Bars Graphic */}
            <div className="absolute inset-x-0 bottom-0 top-[11px] grid grid-cols-6 items-end gap-1.5 sm:gap-2">
              {departments.map((d) => {
                const hPct = (d.value / topTick) * 100;
                return (
                  <div key={d.label} className="relative h-full flex items-end justify-center px-0.5">
                    <div
                      className={cn(
                        "relative w-full max-w-[44px] rounded-t-[10px] bg-gradient-to-t transition-[height] duration-700 ease-out",
                        d.bar,
                        "shadow-[0_-2px_16px_-4px_var(--tw-shadow-color)]",
                      )}
                      style={{
                        height: `${Math.max(hPct, d.value > 0 ? 4 : 0)}%`,
                        // @ts-ignore CSS var
                        "--tw-shadow-color": `${d.color}55`,
                      }}
                    >
                      {/* Value labels floating on top of the bar */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[11px] font-extrabold text-slate-900 dark:text-white leading-none font-mono">
                        {d.value}
                      </span>
                      <div className="absolute inset-x-1 top-1 h-2 rounded-full bg-white/25" aria-hidden />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-Axis Labels Row */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2 mt-3.5">
            {departments.map((d) => (
              <div key={`lbl-${d.label}`} className="h-8 flex flex-col justify-start">
                <p className="text-[9.5px] font-semibold leading-tight text-muted-foreground dark:text-slate-400 text-center line-clamp-2">
                  {d.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
