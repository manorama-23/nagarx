import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowBigUp, MapPin, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";
import {
  distanceMeters,
  formatDistance,
  scopeClass,
  scopeLabel,
  statusClass,
  statusLabel,
  timeAgo,
  type Scope,
  type Status,
} from "@/lib/civic";
import { cn } from "@/lib/utils";

export type GrievanceRow = Tables<"grievances"> & {
  author?: { full_name: string } | null;
};

export function GrievanceCard({
  grievance,
  votedIds,
  origin,
  action,
}: {
  grievance: GrievanceRow;
  votedIds: Set<string>;
  origin?: { lat: number; lng: number } | null;
  action?: React.ReactNode;
}) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const voted = votedIds.has(grievance.id);

  const vote = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error("Sign in to upvote this report.");
      if (voted) {
        const { error } = await supabase
          .from("votes")
          .delete()
          .eq("grievance_id", grievance.id)
          .eq("user_id", session.user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("votes")
          .insert({ grievance_id: grievance.id, user_id: session.user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grievances"] });
      queryClient.invalidateQueries({ queryKey: ["my-votes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const dist =
    origin && grievance.lat != null
      ? distanceMeters(origin, { lat: grievance.lat, lng: grievance.lng })
      : null;

  return (
    <article className="surface p-5 transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
          <UserRound className="size-3.5" />
          {grievance.is_anonymous ? "Anonymous" : (grievance.author?.full_name ?? "Resident")}
        </span>
        <span aria-hidden>·</span>
        <span>{timeAgo(grievance.created_at)}</span>
        <span
          className={cn(
            "ml-auto rounded-full border px-2 py-0.5 text-[11px] font-medium",
            scopeClass[grievance.scope as Scope],
          )}
        >
          {scopeLabel[grievance.scope as Scope]}
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-medium",
            statusClass[grievance.status as Status],
          )}
        >
          {statusLabel[grievance.status as Status]}
        </span>
      </div>

      <h3 className="mt-3 text-base font-semibold tracking-tight">{grievance.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {grievance.description}
      </p>

      {grievance.status === "resolved" && grievance.resolution_proof_url ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <figure>
            <figcaption className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              Before
            </figcaption>
            {grievance.image_url ? (
              <img
                src={grievance.image_url}
                alt={`Reported issue: ${grievance.title}`}
                loading="lazy"
                className="h-40 w-full rounded-md border border-border object-cover"
              />
            ) : (
              <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                No photo
              </div>
            )}
          </figure>
          <figure>
            <figcaption className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              After
            </figcaption>
            <img
              src={grievance.resolution_proof_url}
              alt={`Resolution proof: ${grievance.title}`}
              loading="lazy"
              className="h-40 w-full rounded-md border border-border object-cover"
            />
          </figure>
        </div>
      ) : grievance.image_url ? (
        <img
          src={grievance.image_url}
          alt={`Reported issue: ${grievance.title}`}
          loading="lazy"
          className="mt-4 h-48 w-full rounded-md border border-border object-cover"
        />
      ) : null}

      <div className="mt-4 flex items-center gap-3">
        <Button
          variant={voted ? "default" : "outline"}
          size="sm"
          disabled={vote.isPending}
          onClick={() => vote.mutate()}
          className="gap-1.5"
        >
          <ArrowBigUp
            className={cn("size-4 transition-transform", voted && "scale-125 fill-current")}
          />
          {grievance.upvotes_count ?? 0}
        </Button>
        {dist != null && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" /> {formatDistance(dist)} away
          </span>
        )}
        <div className="ml-auto">{action}</div>
      </div>
    </article>
  );
}
