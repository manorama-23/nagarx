import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Award, Download, ShieldCheck, Sparkles } from "lucide-react";

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
  const { profile, session } = useAuth();
  const points = profile?.points ?? 0;
  const tier = levelFor(points);

  const { data: stats } = useQuery({
    queryKey: ["profile-stats", session?.user.id],
    enabled: !!session,
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

  function downloadCertificate() {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Citizen Certificate</title>
<style>body{font-family:Inter,system-ui,sans-serif;margin:0;padding:64px;color:#0f172a}
.card{border:1px solid #e2e8f0;border-radius:12px;padding:56px;text-align:center}
h1{letter-spacing:.2em;text-transform:uppercase;font-size:14px;color:#64748b}
h2{font-size:34px;margin:16px 0 8px}p{color:#475569}</style></head>
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
      </main>
    </div>
  );
}
