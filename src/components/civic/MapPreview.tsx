import { MapPin } from "lucide-react";

export function MapPreview({
  lat,
  lng,
  address,
}: {
  lat: number | null;
  lng: number | null;
  address?: string | null;
}) {
  if (lat == null || lng == null) {
    return (
      <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
        No coordinates captured yet
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="relative h-24 overflow-hidden rounded-md border border-border bg-muted">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <MapPin className="size-4" />
          </span>
        </div>
        <span className="absolute bottom-1.5 right-2 rounded bg-card/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </span>
      </div>
      {address && (
        <p className="truncate text-xs text-muted-foreground">
          <MapPin className="mr-1 inline size-3 align-middle" />
          {address}
        </p>
      )}
    </div>
  );
}
