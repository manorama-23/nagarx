import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Home, MessageSquare, Landmark, BarChart3, Info, LogOut, Moon, ShieldCheck, Sun, User, MapPin, CloudSun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export type ScopeFilter = "all" | "institute" | "civic";

const tabs: { key: ScopeFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "institute", label: "Campus" },
  { key: "civic", label: "Civic" },
];

import { useQuery } from "@tanstack/react-query";

const navItems = [
  { key: "home", label: "Home", Icon: Home, to: "/" },
  { key: "grievances", label: "Grievances", Icon: MessageSquare, to: "/", hash: "section-grievances" },
  { key: "departments", label: "Departments", Icon: Landmark, to: "/", hash: "section-departments" },
  { key: "reports", label: "Reports", Icon: BarChart3, to: "/", hash: "section-reports" },
  { key: "about", label: "About", Icon: Info, to: "/about" },
];

function useWeather(lat?: number | null, lon?: number | null, locationName?: string) {
  return useQuery({
    queryKey: ["weather", lat, lon, locationName],
    queryFn: async () => {
      let latitude = lat;
      let longitude = lon;

      // If coordinates are not directly provided, resolve locationName via geocoding
      if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
        if (!locationName) return null;
        latitude = 28.6139;
        longitude = 77.2090; // Default fallback to Delhi coordinates

        try {
          // 1. Geocode location name
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1&format=json`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.results && geoData.results.length > 0) {
              latitude = geoData.results[0].latitude;
              longitude = geoData.results[0].longitude;
            }
          }
        } catch (err) {
          // Ignore and fallback
        }
      }

      // 2. Fetch current weather
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      if (!weatherRes.ok) return null;
      const weatherData = await weatherRes.json();

      const cw = weatherData.current_weather;
      if (!cw) return null;

      // Map WMO weather codes to simple descriptions
      let condition = "Clear";
      if (cw.weathercode >= 1 && cw.weathercode <= 3) condition = "Cloudy";
      else if (cw.weathercode >= 45 && cw.weathercode <= 48) condition = "Foggy";
      else if (cw.weathercode >= 51 && cw.weathercode <= 67) condition = "Rainy";
      else if (cw.weathercode >= 71 && cw.weathercode <= 77) condition = "Snowy";
      else if (cw.weathercode >= 95) condition = "Thunderstorm";

      return {
        temp: Math.round(cw.temperature),
        condition
      };
    },
    enabled: (lat !== undefined && lat !== null) || !!locationName,
    staleTime: 15 * 60 * 1000, // 15 mins
  });
}

export function Header({
  scope,
  onScopeChange,
  className,
}: {
  scope?: ScopeFilter;
  onScopeChange?: (s: ScopeFilter) => void;
  className?: string;
}) {
  const { theme, toggle } = useTheme();
  const { session, profile, isAuthority, signOut } = useAuth();
  const navigate = useNavigate();

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [resolvedLoc, setResolvedLoc] = useState<string | null>(null);

  // Profile-based location fallback
  const profileLocation = (session?.user?.user_metadata?.['location_name'] as string) || "Riverbend District";

  useEffect(() => {
    // 1. Check if coordinates and names are already saved in sessionStorage
    const cachedCoords = sessionStorage.getItem("nagarx_user_coords");
    const cachedLoc = sessionStorage.getItem("nagarx_user_location");
    if (cachedCoords && cachedLoc) {
      try {
        setCoords(JSON.parse(cachedCoords));
        setResolvedLoc(cachedLoc);
        return;
      } catch (e) {
        // Parse error, query again
      }
    }

    // 2. Otherwise get exact location via HTML5 Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });
          sessionStorage.setItem("nagarx_user_coords", JSON.stringify({ lat, lng }));

          try {
            // Reverse geocode via free Nominatim API
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const name = addr.suburb || addr.neighbourhood || addr.city_district || addr.city || addr.town || addr.village || addr.county || addr.state || "Current Location";
              setResolvedLoc(name);
              sessionStorage.setItem("nagarx_user_location", name);
            } else {
              setResolvedLoc(profileLocation);
              sessionStorage.setItem("nagarx_user_location", profileLocation);
            }
          } catch (e) {
            setResolvedLoc(profileLocation);
            sessionStorage.setItem("nagarx_user_location", profileLocation);
          }
        },
        (error) => {
          console.warn("Geolocation permission or execution failed:", error);
          setResolvedLoc(profileLocation);
          sessionStorage.setItem("nagarx_user_location", profileLocation);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      setResolvedLoc(profileLocation);
      sessionStorage.setItem("nagarx_user_location", profileLocation);
    }
  }, [profileLocation]);

  const userLocation = resolvedLoc || profileLocation;

  // Real weather based on coordinates if we have them, else fallback to location name
  const { data: weather, isLoading: weatherLoading } = useWeather(
    coords?.lat,
    coords?.lng,
    userLocation
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "bg-[#001F5C] text-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1680px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/nagarx-n-logo.png"
            alt="NagarX"
            className="h-11 w-11 object-contain shrink-0"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-[22px] font-extrabold tracking-tight text-white leading-none">
              NagarX
            </span>
            <span className="text-[11px] tracking-wide text-white/70 mt-0.5">
              Your Voice • Our Responsibility
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5 mx-auto">
          {navItems.map((item) => {
            const Icon = item.Icon;
            return (
              <Link
                key={item.key}
                to={item.to}
                {...(item.hash ? { hash: item.hash } : {})}
                activeOptions={{ exact: item.to === "/" && !item.hash }}
                className="inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13.5px] font-medium transition-all duration-200 text-white/80 bg-white/5 ring-1 ring-white/10 hover:text-white hover:bg-white/10"
                activeProps={{
                  className: "bg-white/10 text-white shadow-inner ring-1 ring-white/15"
                }}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={2.1} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <div className="hidden lg:flex items-center gap-4 py-1.5 ml-2">
            <div className="flex items-center gap-2.5">
              <MapPin className="h-5 w-5 text-white/80" strokeWidth={1.8} />
              <div className="flex flex-col leading-tight">
                <span className="text-[13px] font-semibold text-white tracking-wide line-clamp-1 max-w-[120px]">
                  {userLocation}
                </span>
                <span className="text-[10.5px] text-white/60 font-medium">
                  Civic Responsibility
                </span>
              </div>
            </div>

            <div className="w-[1px] h-9 bg-white/10 mx-1" />

            <div className="flex items-center gap-2.5">
              <CloudSun className="h-5 w-5 text-white/80" strokeWidth={1.8} />
              <div className="flex flex-col leading-tight min-w-[70px]">
                {weatherLoading ? (
                  <span className="text-[12px] text-white/60 animate-pulse">Loading...</span>
                ) : (
                  <>
                    <span className="text-[13px] font-semibold text-white tracking-wide">
                      {weather ? `${weather.temp}°C` : "--°C"}
                    </span>
                    <span className="text-[10.5px] text-white/60 font-medium">
                      {weather ? weather.condition : "Unknown"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-full h-9 w-9 text-white/80 hover:bg-white/10"
          >
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </Button>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Account"
                  className="rounded-full h-9 w-9 bg-white/5 ring-1 ring-white/10 border-0 text-white hover:bg-white/10 hover:text-white"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                <DropdownMenuLabel className="truncate">
                  {profile?.full_name ?? session.user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                  <User className="h-4 w-4 mr-2" /> Profile
                </DropdownMenuItem>
                {isAuthority && (
                  <DropdownMenuItem onClick={() => navigate({ to: "/authority" })}>
                    <ShieldCheck className="h-4 w-4 mr-2" /> Authority Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    navigate({ to: "/login", replace: true });
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="rounded-full bg-white text-[#001F5C] hover:bg-white/90">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>

      {onScopeChange && (
        <>
          <div className="hidden sm:flex items-center gap-1 border-t border-white/10 px-4 py-2 max-w-[1680px] mx-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => onScopeChange(t.key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium text-white/60 transition-colors",
                  scope === t.key && "bg-white/15 text-white",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex sm:hidden items-center gap-1 border-t border-white/10 px-4 py-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => onScopeChange(t.key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium text-white/60",
                  scope === t.key && "bg-white/15 text-white",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}
    </header>
  );
}
