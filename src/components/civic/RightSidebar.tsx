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

function RecentUpdates() {
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
          Recent Updates
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
            <p className="text-[12px] text-slate-400 font-medium">No authority updates yet.</p>
            <p className="text-[11px] text-slate-400">Updates appear when issues are resolved by authorities.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {data.map((u) => {
              const dot = DOT_COLOR[u.category] ?? "bg-[#64748B]";
              return (
                <li key={u.id} className="flex gap-3">
                  <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${dot} shrink-0 ring-2 ring-white dark:ring-[#0F1A2E]`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-slate-800 dark:text-white leading-snug font-semibold line-clamp-2">
                      {u.title} {u.is_announcement ? "— Announcement" : "— marked resolved"}
                    </p>
                    {u.is_announcement && u.content && (
                      <p className="text-[11.5px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {u.content}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {u.created_at ? timeAgo(u.created_at) : ""}
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
        Feedback
      </h3>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
          <div className="h-11 w-11 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Send className="h-5 w-5 text-green-600 dark:text-green-400" strokeWidth={2.2} />
          </div>
          <p className="text-[13px] font-semibold text-slate-800 dark:text-white">Thank you!</p>
          <p className="text-[11.5px] text-slate-500 dark:text-slate-400">Your feedback helps us improve NagarX.</p>
          <button
            onClick={() => { setSubmitted(false); setRating(0); setMessage(""); }}
            className="text-[11.5px] font-semibold text-[#001F5C] dark:text-[#38BDF8] hover:underline mt-1"
          >
            Submit another →
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Star rating */}
          <div>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium mb-2">
              How would you rate your experience?
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
                  {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts or suggestions…"
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
            Send Feedback
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

