export type Scope = "institute" | "civic";
export type Status = "pending" | "in_progress" | "resolved";

export function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(m: number): string {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export const statusLabel: Record<Status, string> = {
  pending: "Pending",
  in_progress: "In progress",
  resolved: "Resolved",
};

export const statusClass: Record<Status, string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  in_progress: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  resolved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
};

export const scopeLabel: Record<Scope, string> = {
  institute: "Campus",
  civic: "Civic",
};

export const scopeClass: Record<Scope, string> = {
  institute: "bg-campus-soft text-campus border-campus/20",
  civic: "bg-civic-soft text-civic border-civic/20",
};

export function levelFor(points: number) {
  if (points >= 200) return { level: 4, title: "Civic Steward" };
  if (points >= 100) return { level: 3, title: "Community Builder" };
  if (points >= 40) return { level: 2, title: "Engaged Resident" };
  return { level: 1, title: "Active Citizen" };
}

export function getPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(new Error(err.message)),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
}
