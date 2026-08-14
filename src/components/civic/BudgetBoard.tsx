import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Coins, Vote } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { scopeClass, scopeLabel, type Scope } from "@/lib/civic";
import { cn } from "@/lib/utils";
import type { ScopeFilter } from "@/components/civic/Header";

export function BudgetBoard({ scopeFilter }: { scopeFilter: ScopeFilter }) {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const { data: proposals = [] } = useQuery({
    queryKey: ["budget-proposals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budget_proposals")
        .select("*")
        .order("votes_count", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: myVotes = [] } = useQuery({
    queryKey: ["my-budget-votes", session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budget_votes")
        .select("proposal_id")
        .eq("user_id", session!.user.id);
      if (error) throw error;
      return data.map((v) => v.proposal_id);
    },
  });

  const vote = useMutation({
    mutationFn: async (proposalId: string) => {
      if (!session) throw new Error("Sign in to vote on proposals.");
      if (myVotes.includes(proposalId)) {
        const { error } = await supabase
          .from("budget_votes")
          .delete()
          .eq("proposal_id", proposalId)
          .eq("user_id", session.user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("budget_votes")
          .insert({ proposal_id: proposalId, user_id: session.user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-proposals"] });
      queryClient.invalidateQueries({ queryKey: ["my-budget-votes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const visible = proposals.filter((p) => scopeFilter === "all" || p.scope === scopeFilter);
  const totalVotes = Math.max(
    1,
    visible.reduce((sum, p) => sum + (p.votes_count ?? 0), 0),
  );

  if (visible.length === 0) {
    return (
      <p className="surface p-10 text-center text-sm text-muted-foreground">
        No proposals in this scope yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {visible.map((p) => {
        const voted = myVotes.includes(p.id);
        const share = Math.round(((p.votes_count ?? 0) / totalVotes) * 100);
        return (
          <article key={p.id} className="surface flex flex-col p-5">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                  scopeClass[p.scope as Scope],
                )}
              >
                {scopeLabel[p.scope as Scope]}
              </span>
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {p.category}
              </span>
            </div>
            <h3 className="mt-3 text-base font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {p.description}
            </p>

            <div className="mt-4 flex items-center gap-1.5 text-sm font-medium">
              <Coins className="size-4 text-muted-foreground" />
              ₹{Number(p.estimated_cost).toLocaleString("en-IN")}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Community support</span>
                <span>{share}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${share}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{p.votes_count ?? 0} votes</span>
              <Button
                size="sm"
                variant={voted ? "default" : "outline"}
                className="gap-1.5"
                disabled={vote.isPending}
                onClick={() => vote.mutate(p.id)}
              >
                {voted ? <Check className="size-4" /> : <Vote className="size-4" />}
                {voted ? "Voted" : "Vote"}
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
