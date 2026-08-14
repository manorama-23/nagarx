import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ImageUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GrievanceCard, type GrievanceRow } from "@/components/civic/GrievanceCard";
import { Header } from "@/components/civic/Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { statusClass, statusLabel, type Status } from "@/lib/civic";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/authority")({
  head: () => ({
    meta: [
      { title: "Authority resolution dashboard — Civic Triage S36" },
      {
        name: "description",
        content: "Triage assigned grievances and close them with mandatory photo proof.",
      },
      { property: "og:title", content: "Authority dashboard — Civic Triage S36" },
      { property: "og:description", content: "Resolve reports with verifiable evidence." },
    ],
  }),
  component: AuthorityPage,
});

function AuthorityPage() {
  const { profile, session, isAuthority } = useAuth();
  const queryClient = useQueryClient();
  const [target, setTarget] = useState<GrievanceRow | null>(null);
  const [proof, setProof] = useState<File | null>(null);

  const scope = profile?.role === "institute_admin" ? "institute" : "civic";

  const { data: queue = [], isLoading } = useQuery({
    queryKey: ["grievances", "authority", scope],
    enabled: isAuthority,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grievances")
        .select("*, author:profiles!grievances_user_id_fkey(full_name)")
        .eq("scope", scope)
        .order("upvotes_count", { ascending: false });
      if (error) throw error;
      return data as unknown as GrievanceRow[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("grievances").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["grievances"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const resolve = useMutation({
    mutationFn: async () => {
      if (!target || !proof || !session) throw new Error("Upload a proof image first.");
      const path = `${session.user.id}/${crypto.randomUUID()}-${proof.name.replace(/[^\w.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage
        .from("resolution-proofs")
        .upload(path, proof);
      if (upErr) throw upErr;
      const url = supabase.storage.from("resolution-proofs").getPublicUrl(path).data.publicUrl;
      const { error } = await supabase
        .from("grievances")
        .update({
          status: "resolved",
          resolution_proof_url: url,
          resolved_by: session.user.id,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", target.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Marked resolved. Reporter points awarded.");
      queryClient.invalidateQueries({ queryKey: ["grievances"] });
      setTarget(null);
      setProof(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!isAuthority) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Authority access only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This dashboard is limited to institute and municipality authorities.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Resolution dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {scope === "institute" ? "Campus" : "Civic"} reports assigned to your office, ranked by
          community support.
        </p>

        <div className="mt-6 grid gap-4">
          {isLoading ? (
            <p className="surface p-10 text-center text-sm text-muted-foreground">Loading queue…</p>
          ) : queue.length === 0 ? (
            <p className="surface p-10 text-center text-sm text-muted-foreground">
              Nothing in your queue.
            </p>
          ) : (
            queue.map((g) => (
              <GrievanceCard
                key={g.id}
                grievance={g}
                votedIds={new Set()}
                action={
                  g.status === "resolved" ? (
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-medium",
                        statusClass.resolved,
                      )}
                    >
                      {statusLabel.resolved}
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      {g.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setStatus.mutate({ id: g.id, status: "in_progress" })
                          }
                        >
                          Start work
                        </Button>
                      )}
                      <Button size="sm" onClick={() => setTarget(g)}>
                        Mark Resolved
                      </Button>
                    </div>
                  )
                }
              />
            ))
          )}
        </div>
      </main>

      <Dialog
        open={!!target}
        onOpenChange={(o) => {
          if (!o) {
            setTarget(null);
            setProof(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resolve with proof</DialogTitle>
            <DialogDescription>
              Evidence is mandatory — it is published beside the original report.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm font-medium">{target?.title}</p>
            <div className="space-y-1.5">
              <Label htmlFor="proof">Resolution photo</Label>
              <label
                htmlFor="proof"
                className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-4 text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                <ImageUp className="size-4" />
                {proof ? proof.name : "Choose evidence image"}
              </label>
              <input
                id="proof"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProof(e.target.files?.[0] ?? null)}
              />
            </div>
            <Button
              className="w-full"
              disabled={!proof || resolve.isPending}
              onClick={() => resolve.mutate()}
            >
              {resolve.isPending && <Loader2 className="size-4 animate-spin" />} Confirm resolution
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
