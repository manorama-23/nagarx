import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, LocateFixed } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Header } from "@/components/civic/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getPosition } from "@/lib/civic";
import { cn } from "@/lib/utils";

type Role = "student" | "citizen" | "institute_admin" | "municipality_admin";

const roles: { key: Role; label: string }[] = [
  { key: "student", label: "Student" },
  { key: "citizen", label: "Citizen" },
  { key: "institute_admin", label: "Institute Authority" },
  { key: "municipality_admin", label: "Municipality Authority" },
];

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — Civic Triage S36" },
      {
        name: "description",
        content: "Join Civic Triage as a student, citizen, institute or municipality authority.",
      },
      { property: "og:title", content: "Create account — Civic Triage S36" },
      { property: "og:description", content: "Report and resolve campus and civic issues." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [role, setRole] = useState<Role>("citizen");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const needsInstitution = role === "student" || role === "institute_admin";

  useEffect(() => {
    if (session) navigate({ to: "/", replace: true });
  }, [session, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ full_name: fullName, email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: parsed.data.full_name,
          role,
          institution_name: needsInstitution ? institution.trim() || null : null,
          lat: coords?.lat ?? null,
          lng: coords?.lng ?? null,
        },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      navigate({ to: "/", replace: true });
    } else {
      toast.success("Account created. Check your email to confirm your address.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto flex max-w-md flex-col justify-center px-4 py-12">
        <div className="surface p-7">
          <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pick the role that fits you.</p>

          <div className="mt-5 grid grid-cols-2 gap-1 rounded-md border border-border p-1">
            {roles.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={cn(
                  "rounded-[5px] px-2 py-2 text-xs font-medium text-muted-foreground transition-colors",
                  role === r.key && "bg-secondary text-foreground",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                maxLength={100}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {needsInstitution && (
              <div className="space-y-1.5">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  maxLength={120}
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Sector 36 Institute of Technology"
                />
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={async () => {
                  try {
                    setCoords(await getPosition());
                    toast.success("Location captured");
                  } catch (err) {
                    toast.error((err as Error).message);
                  }
                }}
              >
                <LocateFixed className="size-3.5" /> Detect My Location
              </Button>
              <span className="font-mono text-xs text-muted-foreground">
                {coords ? `${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}` : "not set"}
              </span>
            </div>

            <Button className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />} Create account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
