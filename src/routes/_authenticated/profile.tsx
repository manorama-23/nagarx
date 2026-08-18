import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Award, Download, ShieldCheck, Sparkles, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Header } from "@/components/civic/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { levelFor } from "@/lib/civic";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your civic profile — Civic Triage S36" },
      {
        name: "description",
        content: "Track your civic points, resolved reports and citizen level tier.",
      },
      { property: "og:title", content: "Your civic profile — Civic Triage S36" },
      { property: "og:description", content: "Points, resolved reports and your citizen certificate." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, session, signOut, isAuthority } = useAuth();
  const queryClient = useQueryClient();
  const points = profile?.points ?? 0;
  const tier = levelFor(points);

  const [certifying, setCertifying] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Leaderboard statistics for authorities
  const { data: leaderboard, refetch: refetchLeaderboard } = useQuery({
    queryKey: ["citizens-leaderboard"],
    enabled: !!session && isAuthority,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grievances")
        .select(`
          user_id,
          profiles:user_id (id, full_name, email, points, role)
        `);

      if (error) throw error;

      const citizenMap: Record<string, {
        id: string;
        full_name: string;
        email: string;
        points: number;
        role: string;
        count: number;
      }> = {};

      data?.forEach((g: any) => {
        if (!g.profiles) return;
        if (g.profiles.role === "municipality_admin" || g.profiles.role === "institute_admin") return;

        const uid = g.profiles.id;
        if (!citizenMap[uid]) {
          citizenMap[uid] = {
            id: g.profiles.id,
            full_name: g.profiles.full_name,
            email: g.profiles.email,
            points: g.profiles.points ?? 0,
            role: g.profiles.role,
            count: 0,
          };
        }
        citizenMap[uid].count += 1;
      });

      return Object.values(citizenMap).sort((a, b) => b.count - a.count);
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["profile-stats", session?.user.id],
    enabled: !!session && !isAuthority,
    queryFn: async () => {
      const [reported, resolved] = await Promise.all([
        supabase
          .from("grievances")
          .select("id", { count: "exact", head: true })
          .eq("user_id", session!.user.id),
        supabase
          .from("grievances")
          .select("id", { count: "exact", head: true })
          .eq("user_id", session!.user.id)
          .eq("status", "resolved"),
      ]);
      return { reported: reported.count ?? 0, resolved: resolved.count ?? 0 };
    },
  });

  const handleCertify = async (citizenId: string, currentPoints: number) => {
    setCertifying(citizenId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ points: currentPoints + 100 } as any)
        .eq("id", citizenId);

      if (error) throw error;

      toast.success("Citizen certified! 100 civic points awarded.");
      await refetchLeaderboard();
    } catch (err: any) {
      toast.error(`Failed to certify: ${err.message}`);
    } finally {
      setCertifying(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!session?.user.id) return;
    setDeleting(true);
    try {
      const userId = session.user.id;

      // 1. Nullify handler links
      await supabase
        .from("grievances")
        .update({ resolved_by: null } as any)
        .eq("resolved_by", userId);

      // 2. Clear votes
      await supabase
        .from("votes")
        .delete()
        .eq("user_id", userId);

      // 3. Clear budget decisions
      await supabase
        .from("budget_votes")
        .delete()
        .eq("user_id", userId);

      // 4. Clear updates
      await supabase
        .from("authority_updates")
        .delete()
        .eq("user_id", userId);

      // 5. Clear grievances
      await supabase
        .from("grievances")
        .delete()
        .eq("user_id", userId);

      // 6. Delete profile row
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      toast.success("Account deleted successfully.");
      await signOut();
      window.location.href = "/";
    } catch (err: any) {
      toast.error(`Error deleting account: ${err.message}`);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  function downloadCertificate() {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Citizen Certificate</title>
<style>body{font-family:Inter,system-ui,sans-serif;margin:0;padding:64px;color:#0f172a}
.card{border:1px solid #e2e8f0;border-radius:12px;padding:56px;text-align:center}
<h1>{letter-spacing:.2em;text-transform:uppercase;font-size:14px;color:#64748b}
<h2>{font-size:34px;margin:16px 0 8px}p{color:#475569}</style></head>
<body><div class="card"><h1>Civic Triage / S36</h1><h2>${profile?.full_name ?? "Citizen"}</h2>
<p>Recognised as <strong>Level ${tier.level}: ${tier.title}</strong></p>
<p>${points} civic points · ${stats?.resolved ?? 0} resolved reports</p>
<p>${new Date().toLocaleDateString()}</p></div></body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "civic-triage-certificate.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">{profile?.full_name ?? "Profile"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile?.email} · {profile?.role?.replace("_", " ")}
          {profile?.institution_name ? ` · ${profile.institution_name}` : ""}
        </p>

        {!isAuthority ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="surface p-5">
                <Sparkles className="size-4 text-muted-foreground" />
                <p className="mt-3 text-3xl font-semibold tracking-tight">{points}</p>
                <p className="text-xs text-muted-foreground">Civic points</p>
              </div>
              <div className="surface p-5">
                <ShieldCheck className="size-4 text-muted-foreground" />
                <p className="mt-3 text-3xl font-semibold tracking-tight">{stats?.resolved ?? 0}</p>
                <p className="text-xs text-muted-foreground">
                  Resolved of {stats?.reported ?? 0} reported
                </p>
              </div>
              <div className="surface p-5">
                <Award className="size-4 text-muted-foreground" />
                <p className="mt-3 text-sm font-semibold">Level {tier.level}</p>
                <p className="text-xs text-muted-foreground">{tier.title}</p>
              </div>
            </div>

            <section className="surface mt-6 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Citizen certificate
              </h2>
              <div className="mt-4 rounded-md border border-dashed border-border p-8 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Civic Triage / S36
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-tight">
                  {profile?.full_name ?? "Citizen"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Level {tier.level}: {tier.title} · {points} points
                </p>
              </div>
              <Button className="mt-4 gap-1.5" onClick={downloadCertificate}>
                <Download className="size-4" /> Download Certificate
              </Button>
            </section>
          </>
        ) : (
          <section className="surface mt-6 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Citizen Grievance Tracker & Leaderboard
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Monitor active citizens with the most reports filed and grant official certifications.
            </p>

            <div className="mt-4 overflow-hidden rounded-md border border-border bg-card">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/40 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Citizen</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 text-center">Grievances Filed</th>
                    <th className="px-4 py-3 text-center">Civic Points</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {!leaderboard || leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-xs text-muted-foreground">
                        No citizens found with reported grievances.
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((citizen) => (
                      <tr key={citizen.id} className="hover:bg-secondary/15 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold">{citizen.full_name}</div>
                          <div className="text-xs text-muted-foreground">{citizen.email}</div>
                        </td>
                        <td className="px-4 py-3 capitalize text-xs">{citizen.role}</td>
                        <td className="px-4 py-3 text-center font-bold text-primary">{citizen.count}</td>
                        <td className="px-4 py-3 text-center font-medium">{citizen.points}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1.5"
                            onClick={() => handleCertify(citizen.id, citizen.points)}
                            disabled={certifying === citizen.id}
                          >
                            {certifying === citizen.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <Award className="size-3.5" />
                            )}
                            Certify
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Danger Zone */}
        <section className="mt-8 rounded-lg border border-red-200 bg-red-50/50 p-6 dark:border-red-900/30 dark:bg-red-950/10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
            Danger Zone
          </h2>
          <p className="mt-1 text-xs text-muted-foreground text-red-700/80 dark:text-red-300/80">
            Permanently delete your profile and all associated data, including filed grievances and votes.
          </p>

          {confirmDelete ? (
            <div className="mt-4 rounded-md border border-red-200 bg-destructive/10 p-4 dark:border-red-900/50">
              <p className="text-xs text-red-600 dark:text-red-400 font-semibold mb-3">
                Are you absolutely sure you want to delete your account? This action is irreversible. All of your reported grievances, votes, and user credentials will be permanently erased.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="gap-1.5"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> Deleting...
                    </>
                  ) : (
                    "Yes, permanently delete my account"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="destructive"
              className="mt-4 gap-1.5"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="size-4" /> Delete Account
            </Button>
          )}
        </section>
      </main>
    </div>
  );
}
