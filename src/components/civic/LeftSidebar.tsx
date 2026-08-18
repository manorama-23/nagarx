import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ChevronRight,
  Zap,
  Megaphone,
  Trash2,
  Droplets,
  TreeDeciduous,
  HardHat,
  X,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import type { GrievanceRow } from "@/components/civic/GrievanceCard";
import { statusClass, statusLabel, timeAgo, type Status } from "@/lib/civic";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─── Department definitions ─────────────────────────────────────────────────

type NavItem = {
  label: string;
  Icon: React.ElementType;
  color: string;
  bg: string;
};

const navItems: NavItem[] = [
  { label: "Public Works", Icon: HardHat, color: "#3B82F6", bg: "bg-[#3B82F6]" },
  { label: "Sanitation", Icon: Trash2, color: "#10B981", bg: "bg-[#10B981]" },
  { label: "Electrical", Icon: Zap, color: "#8B5CF6", bg: "bg-[#8B5CF6]" },
  { label: "Water Utility", Icon: Droplets, color: "#06B6D4", bg: "bg-[#06B6D4]" },
  { label: "Parks", Icon: TreeDeciduous, color: "#F97316", bg: "bg-[#F97316]" },
  { label: "Others", Icon: HelpCircle, color: "#64748B", bg: "bg-[#64748B]" },
];

// ─── Category panel ──────────────────────────────────────────────────────────

function CategoryPanel({
  item,
  grievances,
  onClose,
}: {
  item: NavItem;
  grievances: GrievanceRow[];
  onClose: () => void;
}) {
  const filtered = grievances.filter(
    (g) => ((g as any).category ?? "") === item.label,
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <span className={`flex items-center justify-center h-9 w-9 rounded-full ${item.bg} text-white shrink-0 shadow-sm`}>
          <item.Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-bold text-slate-900 dark:text-white leading-tight">{item.label}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {filtered.length} complaint{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={onClose}
          className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-700 dark:text-white">No complaints yet</p>
              <p className="text-[12px] text-slate-400 mt-0.5">No problems registered in this category.</p>
            </div>
          </div>
        ) : (
          filtered.map((g) => (
            <div
              key={g.id}
              className="bg-white dark:bg-[#0F1A2E] rounded-xl border border-[#E2E8F0] dark:border-[#1B2B48] p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[12.5px] font-semibold text-slate-800 dark:text-white leading-snug flex-1">
                  {g.title}
                </p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0",
                    statusClass[g.status as Status],
                  )}
                >
                  {statusLabel[g.status as Status]}
                </span>
              </div>
              {g.description ? (
                <p className="mt-1 text-[11.5px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                  {g.description}
                </p>
              ) : null}
              <p className="mt-1.5 text-[10.5px] text-slate-400 font-medium">{timeAgo(g.created_at)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface LeftSidebarProps {
  onRaiseGrievance?: () => void;
  grievances?: GrievanceRow[];
  isAuthority?: boolean;
}

export function LeftSidebar({ onRaiseGrievance, grievances = [], isAuthority = false }: LeftSidebarProps) {
  const [selected, setSelected] = useState<NavItem | null>(null);

  const handleNav = (item: NavItem) => {
    setSelected((prev) => (prev?.label === item.label ? null : item));
  };

  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col h-full overflow-hidden gap-4 py-5 pl-3 pr-2">

      {/* ── Quick Navigation (or category panel) ─────────────────────── */}
      <section className="bg-white dark:bg-[#0F1A2E] rounded-[18px] border border-[#E2E8F0] dark:border-[#1B2B48] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] p-5 flex flex-col min-h-0 flex-1">
        {selected ? (
          <CategoryPanel
            item={selected}
            grievances={grievances}
            onClose={() => setSelected(null)}
          />
        ) : (
          <>
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white mb-4 tracking-tight flex items-center gap-2 shrink-0">
              <Zap className="h-[18px] w-[18px] text-[#3B82F6]" strokeWidth={2.2} />
              Quick Navigation
            </h3>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const count = grievances.filter(
                  (g) => ((g as any).category ?? "") === item.label,
                ).length;
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => handleNav(item)}
                      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors group text-left"
                    >
                      <span className={`flex items-center justify-center h-9 w-9 rounded-full ${item.bg} text-white shrink-0 shadow-sm`}>
                        <item.Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                      </span>
                      <span className="flex-1 text-[13.5px] font-semibold text-slate-800 dark:text-white">
                        {item.label}
                      </span>
                      {count > 0 && (
                        <span className="text-[10.5px] font-bold bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 rounded-full px-2 py-0.5 shrink-0">
                          {count}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      {/* ── Raise a Grievance card ────────────────────────────────────── */}
      <div className="px-0 pb-0 shrink-0">
        <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-b from-[#F2F6FF] to-white dark:from-[#0E1726] dark:to-[#0A0E1A] border border-[#DEE7FF] dark:border-[#1E2B48] shadow-[0_8px_24px_-12px_rgba(0,31,92,0.15)] flex flex-col p-5 gap-4">

          {/* Top Illustration Box */}
          <div className="relative h-[90px] w-[90px] mx-auto rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center border border-blue-100/50 dark:border-blue-900/20">
            <svg viewBox="0 0 200 110" fill="none" className="w-[140px] h-[90px]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="rearGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#CDE0FF" />
                  <stop offset="100%" stopColor="#E5EEFF" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="megaBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>
                <linearGradient id="leafGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              <circle cx="100" cy="55" r="42" fill="url(#rearGlow)" />

              {/* Leaves */}
              <path d="M 85 75 C 65 60 62 40 76 33 C 84 45 88 65 85 75 Z" fill="url(#leafGreen)" />
              <path d="M 125 78 C 142 66 145 46 133 39 C 126 49 120 66 125 78 Z" fill="#10B981" />

              {/* Megaphone Handle */}
              <path d="M 98 62 L 102 78" stroke="#1E40AF" strokeWidth="5.5" strokeLinecap="round" />

              {/* Megaphone Cone */}
              <path d="M 91 48 L 118 60 C 120 61, 122 59, 121 56 L 108 30 C 107 27, 103 27, 101 30 L 91 48 Z" fill="url(#megaBlue)" />

              {/* Megaphone Front */}
              <ellipse cx="114" cy="46" rx="6" ry="15" transform="rotate(25 114 46)" fill="#93C5FD" />
              <ellipse cx="114" cy="46" rx="3.5" ry="10" transform="rotate(25 114 46)" fill="#1D4ED8" />

              {/* Sound Waves */}
              <path d="M 130 33 A 10 10 0 0 1 133 46" stroke="#60A5FA" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 136 27 A 18 18 0 0 1 141 50" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 142 21 A 26 26 0 0 1 149 54" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
            </svg>
          </div>

          {/* Text details */}
          <div className="flex flex-col items-center text-center gap-1.5">
            <h4 className="text-[15.5px] font-extrabold text-[#0B1E43] dark:text-white leading-tight tracking-tight">
              Together for a Better Tomorrow
            </h4>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[210px]">
              Report local civic issues, monitor department reviews, and track resolutions.
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={onRaiseGrievance}
            className="w-full rounded-[14px] bg-[#001F5C] text-white hover:bg-[#001A4D] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] py-4.5 px-5 text-[13px] font-bold shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            {isAuthority ? "See the Grievance" : "Raise a Grievance"}
            <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.3} />
          </Button>

        </div>
      </div>
    </aside>
  );
}
