import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Home, MessageSquare, Landmark, BarChart3, Info, LogOut, Moon, ShieldCheck, Sun, User, MapPin, CloudSun, Languages } from "lucide-react";

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
import { useLanguage, LANGUAGES, type Language } from "@/lib/language";

export type ScopeFilter = "all" | "institute" | "civic";

import { useQuery } from "@tanstack/react-query";

const NAV_TRANSLATIONS: Record<Language, {
  home: string;
  grievances: string;
  departments: string;
  reports: string;
  about: string;
  all: string;
  institute: string;
  civic: string;
  responsibility: string;
  subtitle: string;
  signin: string;
  profile: string;
  authorityCount: string;
  signout: string;
}> = {
  en: {
    home: "Home",
    grievances: "Grievances",
    departments: "Departments",
    reports: "Reports",
    about: "About",
    all: "All",
    institute: "Campus",
    civic: "Civic",
    responsibility: "Civic Responsibility",
    subtitle: "Your Voice • Our Responsibility",
    signin: "Sign in",
    profile: "Profile",
    authorityCount: "Authority Dashboard",
    signout: "Sign Out",
  },
  hi: {
    home: "होम",
    grievances: "शिकायतें",
    departments: "विभाग",
    reports: "रिपोर्ट",
    about: "हमारे बारे में",
    all: "सभी",
    institute: "कैंपस",
    civic: "नागरिक",
    responsibility: "नागरिक जिम्मेदारी",
    subtitle: "आपकी आवाज़ • हमारी ज़िम्मेदारी",
    signin: "साइन इन करें",
    profile: "प्रोफ़ाइल",
    authorityCount: "प्राधिकरण डैशबोर्ड",
    signout: "साइन आउट",
  },
  ta: {
    home: "முகப்பு",
    grievances: "புகார்கள்",
    departments: "துறைகள்",
    reports: "அறிக்கைகள்",
    about: "பற்றி",
    all: "அனைத்தும்",
    institute: "வளாகம்",
    civic: "குடிமை",
    responsibility: "குடிமைப் பொறுப்பு",
    subtitle: "உங்கள் குரல் • எங்கள் கடமை",
    signin: "உள்நுழைக",
    profile: "சுயவிவரம்",
    authorityCount: "அதிகாரப் பலகை",
    signout: "வெளியேறு",
  },
  te: {
    home: "హోమ్",
    grievances: "ఫిర్యాదులు",
    departments: "విభాగాలు",
    reports: "নিవేదికలు",
    about: "గురించి",
    all: "అన్నీ",
    institute: "క్యాంపస్",
    civic: "పౌర",
    responsibility: "పౌర బాధ్యత",
    subtitle: "మీ குரలు • మా బాధ్యత",
    signin: "సైన్ ఇన్",
    profile: "ప్రొఫైల్",
    authorityCount: "అధికార డాష్‌బోర్డ్",
    signout: "సైన్ అవుట్",
  },
  or: {
    home: "ମୁଖ୍ୟ ପୃଷ୍ଠା",
    grievances: "ଅଭିଯୋଗ",
    departments: "ବିଭାଗ",
    reports: "ରିପୋର୍ଟ",
    about: "ଆମ ବିଷୟରେ",
    all: "ସମସ୍ତ",
    institute: "କ୍ୟାମ୍ପସ",
    civic: "ନାଗରିକ",
    responsibility: "ନାଗରିକ ଦାୟିତ୍ୱ",
    subtitle: "ଆପଣଙ୍କ ସ୍ୱର • ଆମ ଦାୟିତ୍ୱ",
    signin: "ସାଇନ ଇନ",
    profile: "ପ୍ରୋଫାଇଲ୍",
    authorityCount: "କର୍ତ୍ତୃପକ୍ଷ ଡ୍ୟାସବୋର୍ଡ",
    signout: "ସାଇନ ଆଉଟ",
  },
  mr: {
    home: "मुख्यपृष्ठ",
    grievances: "तक्रारी",
    departments: "विभाग",
    reports: "अहवाल",
    about: "बद्दल",
    all: "सर्व",
    institute: "कॅम्पस",
    civic: "नागरी",
    responsibility: "नागरी जबाबदारी",
    subtitle: "तुमचा आवाज • आमची जबाबदारी",
    signin: "साइन इन करा",
    profile: "प्रोफाइल",
    authorityCount: "प्राधिकरण डॅशबोर्ड",
    signout: "साइन आउट करा",
  },
  bn: {
    home: "হোম",
    grievances: "অভিযোগ",
    departments: "বিভাগ",
    reports: "প্রতিবেদন",
    about: "আমাদের সম্পর্কে",
    all: "সব",
    institute: "ক্যাম্পাস",
    civic: "নাগরিক",
    responsibility: "নাগরিক দায়িত্ব",
    subtitle: "আপনার কণ্ঠস্বর • আমাদের দায়িত্ব",
    signin: "সাইন ইন",
    profile: "প্রোফাইল",
    authorityCount: "কর্তৃপক্ষ ড্যাশবোর্ড",
    signout: "সাইন আউট",
  },
  gu: {
    home: "હોમ",
    grievances: "ફરિયાદો",
    departments: "વિભાગો",
    reports: "અહેવાલો",
    about: "અમારા વિશે",
    all: "બધા",
    institute: "કેમ્પસ",
    civic: "નાગરિક",
    responsibility: "નાગરિક જવાબદારી",
    subtitle: "તમારો અવાજ • અમારી જવાબદારી",
    signin: "સાઇન ઇન",
    profile: "પ્રોફાઇલ",
    authorityCount: "સત્તાધિકારી ડેશબોર્ડ",
    signout: "સાઇન આઉਟ",
  },
  pa: {
    home: "ਹੋਮ",
    grievances: "ਸ਼ਿਕਾਇਤਾਂ",
    departments: "ਵਿਭਾਗ",
    reports: "ਰਿਪੋਰਟਾਂ",
    about: "ਬਾਰੇ",
    all: "ਸਭ",
    institute: "ਕੈਂਪਸ",
    civic: "ਨਾਗਰਿਕ",
    responsibility: "ਨਾਗਰਿਕ ਜ਼ਿੰਮੇਵਾਰੀ",
    subtitle: "ਤੁਹਾਡੀ ਆਵਾਜ਼ • ਸਾਡੀ ਜ਼ਿੰਮੇਵਾਰੀ",
    signin: "ਸਾਈਨ ਇਨ ਕਰੋ",
    profile: "ਪ੍ਰੋਫਾਈਲ",
    authorityCount: "ਅਥਾਰਟੀ ਡੈਸ਼ਬੋਰਡ",
    signout: "ਸਾਈਨ ਆਊਟ",
  },
};

const navItems = [
  { key: "home", Icon: Home, to: "/" },
  { key: "grievances", Icon: MessageSquare, to: "/", hash: "section-grievances" },
  { key: "departments", Icon: Landmark, to: "/", hash: "section-departments" },
  { key: "reports", Icon: BarChart3, to: "/", hash: "section-reports" },
  { key: "about", Icon: Info, to: "/about" },
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
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const navT = NAV_TRANSLATIONS[language];

  const translatedNavItems = navItems.map((item) => ({
    ...item,
    label: navT[item.key as keyof typeof navT],
  }));

  const tabs: { key: ScopeFilter; label: string }[] = [
    { key: "all", label: navT.all },
    { key: "institute", label: navT.institute },
    { key: "civic", label: navT.civic },
  ];

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
              {navT.subtitle}
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5 mx-auto">
          {translatedNavItems.map((item) => {
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
                  {navT.responsibility}
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Language selection"
                className="rounded-full h-9 w-9 text-white/80 hover:bg-white/10"
              >
                <Languages className="h-4.5 w-4.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto w-40 rounded-2xl">
              {LANGUAGES.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  className={cn(
                    "cursor-pointer",
                    language === l.code && "bg-accent font-semibold"
                  )}
                  onClick={() => setLanguage(l.code as Language)}
                >
                  {l.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
                  <User className="h-4 w-4 mr-2" /> {navT.profile}
                </DropdownMenuItem>
                {isAuthority && (
                  <DropdownMenuItem onClick={() => navigate({ to: "/authority" })}>
                    <ShieldCheck className="h-4 w-4 mr-2" /> {navT.authorityCount}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    navigate({ to: "/login", replace: true });
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" /> {navT.signout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="rounded-full bg-white text-[#001F5C] hover:bg-white/90">
              <Link to="/login">{navT.signin}</Link>
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
