import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Map, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { timeAgo } from "@/lib/civic";

import L from "leaflet";

// Fix leaflet default icon paths in bundlers (needed even for CircleMarker due to shared L instance)
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// ─── Types ───────────────────────────────────────────────────────────────────

type PinRow = {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "resolved";
  lat: number;
  lng: number;
  created_at: string;
  upvotes_count: number | null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pinColor(status: PinRow["status"]) {
  if (status === "pending") return "#EF4444";
  if (status === "in_progress") return "#F59E0B";
  return "#10B981";
}

function statusLabel(status: PinRow["status"]) {
  if (status === "pending") return "Pending";
  if (status === "in_progress") return "In Progress";
  return "Resolved";
}

// ─── Component ───────────────────────────────────────────────────────────────

export function IssueHeatmap() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  function isAbortLike(err: unknown): boolean {
    if (err instanceof DOMException && err.name === "AbortError") return true;
    const m = err instanceof Error ? err.message : String(err ?? "");
    return /aborted|network_io_suspended|Failed to fetch|The user aborted|request to .* failed/i.test(m);
  }

  const { data: pins = [], isLoading, error } = useQuery<PinRow[]>({
    queryKey: ["issue-map-pins"],
    queryFn: async () => {
      try {
        const { data, error: qErr } = await supabase
          .from("grievances")
          .select("id, title, status, lat, lng, created_at, upvotes_count")
          .order("created_at", { ascending: false })
          .limit(300);
        if (qErr) {
          if (isAbortLike(qErr)) return [];
          throw qErr;
        }
        // Filter rows with valid coordinates
        return (data ?? []).filter(
          (r) => r.lat != null && r.lng != null && r.lat !== 0 && r.lng !== 0,
        ) as PinRow[];
      } catch (e) {
        if (isAbortLike(e)) return [];
        throw e;
      }
    },
    refetchInterval: 60_000,
  });

  // Determine map centre: average of pins or fallback to India centre
  const centre: [number, number] =
    pins.length > 0
      ? [
        pins.reduce((s, p) => s + p.lat, 0) / pins.length,
        pins.reduce((s, p) => s + p.lng, 0) / pins.length,
      ]
      : [30.7333, 76.7794]; // Chandigarh default

  return (
    <section className="bg-white dark:bg-[#0F1A2E] rounded-[18px] border border-[#E2E8F0] dark:border-[#1B2B48] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] p-5 sm:p-[22px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D1FAE5]">
            <Map className="h-[18px] w-[18px] text-[#10B981]" strokeWidth={2.2} />
          </span>
          <h3 className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
            Issue Map
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-semibold">
          {(["pending", "in_progress", "resolved"] as const).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: pinColor(s) }}
              />
              {statusLabel(s)}
            </span>
          ))}
          {pins.length > 0 && (
            <span className="ml-1 text-[10.5px] font-bold bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 rounded-full px-2 py-0.5">
              {pins.length} pins
            </span>
          )}
        </div>
      </div>

      {/* Map area */}
      <div className="relative h-[260px] sm:h-[300px] w-full overflow-hidden rounded-[14px] border border-[#DBEAFE] dark:border-[#1B3D7A]/60">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30 animate-pulse">
            <p className="text-sm text-muted-foreground">Loading map…</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/20">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <p className="text-[12px] text-muted-foreground">Could not load map data.</p>
          </div>
        ) : !mounted ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20 animate-pulse">
            <p className="text-sm text-muted-foreground">Loading map…</p>
          </div>
        ) : (
          <MapContainer
            center={centre}
            zoom={pins.length === 0 ? 11 : 13}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
            scrollWheelZoom={false}
            attributionControl={false}
          >
            {/* OpenStreetMap tile layer — no API key needed */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {pins.length === 0 && (
              // Overlay when no real pins yet
              <></>
            )}

            {pins.map((pin) => (
              <CircleMarker
                key={pin.id}
                center={[pin.lat, pin.lng]}
                radius={pin.upvotes_count != null && pin.upvotes_count > 5 ? 10 : 7}
                pathOptions={{
                  color: "#fff",
                  weight: 2,
                  fillColor: pinColor(pin.status),
                  fillOpacity: 0.92,
                }}
              >
                <Popup className="leaflet-popup-civic">
                  <div className="p-1 min-w-[160px]">
                    <p className="font-bold text-[13px] leading-snug text-slate-900">{pin.title}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: pinColor(pin.status) }}
                      />
                      <span className="text-[11px] font-semibold text-slate-600">
                        {statusLabel(pin.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-[10.5px] text-slate-400">{timeAgo(pin.created_at)}</p>
                    {pin.upvotes_count != null && pin.upvotes_count > 0 && (
                      <p className="mt-0.5 text-[10.5px] text-slate-400">
                        ▲ {pin.upvotes_count} upvote{pin.upvotes_count !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {/* Attribution override */}
            <div
              style={{
                position: "absolute",
                bottom: 4,
                right: 6,
                fontSize: 9,
                color: "#999",
                zIndex: 1000,
                pointerEvents: "none",
              }}
            >
              © OpenStreetMap contributors
            </div>
          </MapContainer>
        )}

        {/* Empty state overlay */}
        {!isLoading && !error && pins.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
            <div className="bg-white/90 dark:bg-[#0F1A2E]/90 rounded-2xl px-5 py-4 text-center shadow-lg border border-slate-200 dark:border-[#1B2B48]">
              <AlertCircle className="mx-auto h-6 w-6 text-slate-300 mb-2" />
              <p className="text-[13px] font-semibold text-slate-700 dark:text-white">
                No grievances yet
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Reported issues will appear as pins on the map.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
