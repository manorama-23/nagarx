import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

// Fix leaflet default icon paths
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

export function MapPreview({
  lat,
  lng,
  address,
}: {
  lat: number | null;
  lng: number | null;
  address?: string | null;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (lat == null || lng == null) {
    return (
      <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground bg-slate-50/50 dark:bg-slate-900/10">
        No coordinates captured yet
      </div>
    );
  }

  return (
    <div className="space-y-1.5 mt-2">
      <div className="relative h-28 overflow-hidden rounded-md border border-border bg-muted">
        {mounted ? (
          <MapContainer
            key={`${lat}-${lng}`}
            center={[lat, lng]}
            zoom={15}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
            scrollWheelZoom={false}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]} />
          </MapContainer>
        ) : (
          <div className="h-full w-full bg-muted animate-pulse" />
        )}
        <span className="absolute bottom-1.5 right-2 rounded bg-card/85 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-700 dark:text-slate-300 z-[1000] border border-border/50 shadow-sm">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </span>
      </div>
      {address && (
        <p className="text-xs text-muted-foreground leading-normal flex items-start gap-1 mt-1.5">
          <MapPin className="size-3.5 text-[#EF4444] shrink-0 mt-0.5" />
          <span className="break-words">{address}</span>
        </p>
      )}
    </div>
  );
}

