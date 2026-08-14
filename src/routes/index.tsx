import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { BudgetBoard } from "@/components/civic/BudgetBoard";
import { GrievanceCard, type GrievanceRow } from "@/components/civic/GrievanceCard";
import { Header, type ScopeFilter } from "@/components/civic/Header";
import { ReportIssueDialog } from "@/components/civic/ReportIssueDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getPosition } from "@/lib/civic";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Civic Triage S36 — Campus & City Grievance Platform" },
      {
        name: "description",
        content:
          "Report campus and civic issues, upvote what matters, track resolutions with photo proof, and vote on participatory budget proposals.",
      },
      { property: "og:title", content: "Civic Triage S36 — Grievance Triage Platform" },
      {
        property: "og:description",
        content:
          "Report, upvote and track campus and city grievances with transparent resolution proof.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { session } = useAuth();
  const [scope, setScope] = useState<ScopeFilter>("all");
  const [tab, setTab] = useState<"grievances" | "budget">("grievances");
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    getPosition()
      .then(setOrigin)
      .catch(() => setOrigin(null));
  }, []);

  const { data: grievances = [], isLoading } = useQuery({
    queryKey: ["grievances"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grievances")
        .select("*, author:profiles!grievances_user_id_fkey(full_name)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as unknown as GrievanceRow[];
    },
  });

  const { data: myVotes = [] } = useQuery({
    queryKey: ["my-votes", session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("votes")
        .select("grievance_id")
        .eq("user_id", session!.user.id);
      if (error) throw error;
      return data.map((v) => v.grievance_id);
    },
  });

  const visible = grievances.filter((g) => scope === "all" || g.scope === scope);

  return (
    <div className="min-h-screen bg-background">
      <Header scope={scope} onScopeChange={setScope} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Grievance triage</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Transparent reporting for campus and city problems.
            </p>
          </div>
          {session ? (
            <ReportIssueDialog />
          ) : (
            <Button asChild size="sm">
              <Link to="/login">Sign in to report</Link>
            </Button>
          )}
        </div>

        <div className="mt-6 inline-flex rounded-md border border-border p-0.5">
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
                "rounded-[5px] px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors",
                tab === key && "bg-secondary text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <section className="mt-6">
          {tab === "grievances" ? (
            isLoading ? (
              <p className="surface p-10 text-center text-sm text-muted-foreground">
                Loading reports…
              </p>
            ) : visible.length === 0 ? (
              <p className="surface p-10 text-center text-sm text-muted-foreground">
                No reports in this scope yet.
              </p>
            ) : (
              <div className="grid gap-4">
                {visible.map((g) => (
                  <GrievanceCard
                    key={g.id}
                    grievance={g}
                    votedIds={new Set(myVotes)}
                    origin={origin}
                  />
                ))}
              </div>
            )
          ) : (
            <BudgetBoard scopeFilter={scope} />
          )}
        </section>
      </main>
    </div>
  );
}
