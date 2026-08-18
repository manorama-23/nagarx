import { AlertTriangle, ArrowRight, Droplets, Trash2, Zap, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GrievanceRow } from "@/components/civic/GrievanceCard";
import {
  statusLabel as statusLabelFn,
  statusClass,
  timeAgo,
  type Status,
} from "@/lib/civic";
import { cn } from "@/lib/utils";

type Department = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  bg: string;
  iconColor: string;
};

const departments: Department[] = [
  { key: "water", label: "Water Utility", icon: Droplets, bg: "bg-[#E0F2FE]", iconColor: "text-[#06B6D4]" },
  { key: "sanitation", label: "Sanitation", icon: Trash2, bg: "bg-[#D1FAE5]", iconColor: "text-[#10B981]" },
  { key: "electrical", label: "Electrical", icon: Zap, bg: "bg-[#EDE9FE]", iconColor: "text-[#8B5CF6]" },
  { key: "roads", label: "Public Works", icon: Construction, bg: "bg-[#FEE2E2]", iconColor: "text-[#EF4444]" },
];

const DEFAULT_DEPT: Department = departments[3] as Department;

function getDept(key: string): Department {
  return departments.find((x) => x.key === key) ?? DEFAULT_DEPT;
}

const fallbackItems: Array<{ title: string; ward: string; status: Status; when: string; dept: Department["key"] }> = [
  { title: "Water Leakage on Main Road", ward: "Ward 5, Riverbend District", status: "in_progress", when: "2h ago", dept: "water" },
  { title: "Garbage Not Collected", ward: "Ward 8, Riverbend District", status: "resolved", when: "1d ago", dept: "sanitation" },
  { title: "Street Light Not Working", ward: "Ward 3, Riverbend District", status: "in_progress", when: "2d ago", dept: "electrical" },
  { title: "Road Damage", ward: "Ward 10, Riverbend District", status: "pending", when: "3d ago", dept: "roads" },
];

function deptFor(title: string): Department {
  const t = title.toLowerCase();
  if (t.includes("water") || t.includes("leak") || t.includes("drain")) return departments[0] as Department;
  if (t.includes("garbage") || t.includes("trash") || t.includes("waste") || t.includes("bin")) return departments[1] as Department;
  if (t.includes("light") || t.includes("electric") || t.includes("power") || t.includes("streetlight")) return departments[2] as Department;
  return DEFAULT_DEPT;
}

export function RecentGrievances({
  grievances,
  onRaise,
  isAuthority = false,
}: {
  grievances?: GrievanceRow[];
  onRaise?: () => void;
  isAuthority?: boolean;
}) {
  const hasReal = grievances && grievances.length > 0;

  const items = hasReal
    ? grievances.slice(0, 4).map((g) => ({
      title: g.title,
      ward: g.institution_name
        ? `${g.institution_name}`
        : `Ward · ${g.scope === "institute" ? "Campus" : "Civic"} · Riverbend District`,
      status: g.status as Status,
      when: timeAgo(g.created_at),
      dept: deptFor(g.title).key,
    }))
    : fallbackItems;

  return (
    <section className="bg-white dark:bg-[#0F1A2E] rounded-[18px] border border-[#E2E8F0] dark:border-[#1B2B48] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] p-5 sm:p-[22px] flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FEE2E2]">
            <AlertTriangle className="h-4.5 w-4.5 text-[#EF4444]" strokeWidth={2.2} />
          </span>
          <h3 className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
            Recent Grievances
          </h3>
        </div>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-[11.5px] font-bold text-[#001F5C] dark:text-[#38BDF8] hover:underline"
        >
          View All
        </a>
      </div>

      <ul className="flex-1 space-y-2.5 min-h-0">
        {items.map((it, i) => {
          const d = getDept(it.dept);
          const Icon = d.icon;
          return (
            <li
              key={hasReal ? (grievances?.[i]?.id ?? String(i)) : String(i)}
              className="group flex items-start gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all"
            >
              <span
                className={cn(
                  "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full",
                  d.bg,
                )}
              >
                <Icon className={cn("h-5 w-5", d.iconColor)} strokeWidth={2.1} />
              </span>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h4 className="text-[13.5px] font-semibold leading-snug text-slate-900 dark:text-white line-clamp-1">
                    {it.title}
                  </h4>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold",
                      statusClass[it.status],
                    )}
                  >
                    {it.status === "pending" ? "Under Review" : statusLabelFn[it.status]}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-3 text-[11.5px] text-muted-foreground dark:text-slate-400">
                  <span className="truncate font-medium">{it.ward}</span>
                  <span className="shrink-0 font-semibold">{it.when}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <Button
        onClick={onRaise}
        className="mt-4 w-full rounded-full bg-[#001F5C] hover:bg-[#001A4D] dark:bg-[#00296B] dark:hover:bg-[#001F5C] text-white font-semibold shadow-[0_8px_22px_-10px_rgba(0,31,92,0.55)] transition-all h-[42px] text-[13px]"
      >
        {isAuthority ? "See the Grievance" : "Raise a Grievance"}
        <ArrowRight className="h-4 w-4 ml-1.5" strokeWidth={2.3} />
      </Button>
    </section>
  );
}
