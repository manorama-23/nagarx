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

function Dashboard() {
  const { session, isAuthority } = useAuth();
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
                    {tab === "grievances" ? "Grievance Triage" : "Participatory Budgeting"}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tab === "grievances"
                      ? "All recent reports — upvote what you care about and track resolutions."
                      : "Vote on proposals that shape your neighbourhood and campus budget."}
                    {error ? (
                      <span className="ml-2 text-[#EF4444] font-medium">
                        (Unable to reach the server — showing offline mode.)
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>

              <div className="inline-flex rounded-2xl border dark:border-[#1B2B48] border-[#E2E8F0] bg-card p-1 shadow-sm mb-6">
                {(
                  [
                    ["grievances", "Active Grievances"],
                    ["budget", "Participatory Budgeting"],
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
                    <p className="text-sm text-muted-foreground">Loading reports…</p>
                  </div>
                ) : visible.length === 0 ? (
                  <div className="surface p-14 text-center">
                    <p className="text-sm text-muted-foreground">
                      No reports in this scope yet.
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
              <p className="text-sm text-muted-foreground font-medium">Have feedback or need help?</p>
              <a
                href="mailto:feedback@nagarx.in"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#001F5C] dark:text-[#38BDF8] hover:underline"
              >
                Send us feedback →
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
