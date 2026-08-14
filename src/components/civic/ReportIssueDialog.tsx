import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ImageUp, Loader2, LocateFixed, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { MapPreview } from "@/components/civic/MapPreview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { distanceMeters, getPosition, type Scope } from "@/lib/civic";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().trim().min(6, "Give the issue a clear title").max(120),
  description: z.string().trim().min(15, "Add a little more detail").max(1000),
});

export function ReportIssueDialog() {
  const { session, profile } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [anonymous, setAnonymous] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    profile?.lat != null && profile?.lng != null
      ? { lat: profile.lat, lng: profile.lng }
      : null,
  );
  const canChooseScope = profile?.role === "student" || profile?.role === "institute_admin";
  const [scope, setScope] = useState<Scope>(canChooseScope ? "institute" : "civic");

  const { data: openIssues } = useQuery({
    queryKey: ["open-grievances-dedupe"],
    enabled: open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grievances")
        .select("id,title,lat,lng,status,scope")
        .neq("status", "resolved")
        .limit(500);
      if (error) throw error;
      return data;
    },
  });

  const nearby = useMemo(() => {
    if (!coords || !openIssues) return null;
    return (
      openIssues.find(
        (g) => g.scope === scope && distanceMeters(coords, { lat: g.lat, lng: g.lng }) <= 150,
      ) ?? null
    );
  }, [coords, openIssues, scope]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setAnonymous(false);
  };

  const submit = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error("Sign in to report an issue.");
      const parsed = schema.safeParse({ title, description });
      if (!parsed.success) throw new Error(parsed.error.issues[0].message);
      const point = coords ?? (await getPosition());

      let imageUrl: string | null = null;
      if (file) {
        const path = `${session.user.id}/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
        const { error: upErr } = await supabase.storage
          .from("grievance-images")
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        imageUrl = supabase.storage.from("grievance-images").getPublicUrl(path).data.publicUrl;
      }

      const { error } = await supabase.from("grievances").insert({
        user_id: session.user.id,
        scope,
        institution_name: scope === "institute" ? (profile?.institution_name ?? null) : null,
        title: parsed.data.title,
        description: parsed.data.description,
        image_url: imageUrl,
        lat: point.lat,
        lng: point.lng,
        is_anonymous: anonymous,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Issue reported. Thanks for flagging it.");
      queryClient.invalidateQueries({ queryKey: ["grievances"] });
      reset();
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-4" /> Report Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Report an issue</DialogTitle>
          <DialogDescription>
            Reports are public and routed to the responsible authority.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {canChooseScope && (
            <div className="inline-flex rounded-md border border-border p-0.5">
              {(["institute", "civic"] as Scope[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScope(s)}
                  className={cn(
                    "rounded-[5px] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors",
                    scope === s && "bg-secondary text-foreground",
                  )}
                >
                  {s === "institute" ? "Campus Issue" : "City / Civic Issue"}
                </button>
              ))}
            </div>
          )}

          {nearby && (
            <div className="flex gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>
                A similar issue was recently reported nearby (&ldquo;{nearby.title}&rdquo;). You
                can upvote the existing report to boost its priority.
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Broken streetlight near Gate 3"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is wrong, since when, and who is affected?"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="photo">Photo</Label>
            <label
              htmlFor="photo"
              className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-4 text-sm text-muted-foreground transition-colors hover:bg-accent"
            >
              <ImageUp className="size-4" />
              {file ? file.name : "Drop or choose an image"}
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Location</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={async () => {
                  try {
                    setCoords(await getPosition());
                  } catch (err) {
                    toast.error((err as Error).message);
                  }
                }}
              >
                <LocateFixed className="size-3.5" /> Detect
              </Button>
            </div>
            <MapPreview lat={coords?.lat ?? null} lng={coords?.lng ?? null} />
          </div>

          <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">Post anonymously</p>
              <p className="text-xs text-muted-foreground">Your name stays hidden publicly.</p>
            </div>
            <Switch checked={anonymous} onCheckedChange={setAnonymous} />
          </div>

          <Button
            className="w-full"
            disabled={submit.isPending}
            onClick={() => submit.mutate()}
          >
            {submit.isPending && <Loader2 className="size-4 animate-spin" />}
            Submit report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
