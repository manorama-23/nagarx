import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Moon, ShieldCheck, Sun, Trophy, User } from "lucide-react";

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

export function Header({
  scope,
  onScopeChange,
}: {
  scope?: ScopeFilter;
  onScopeChange?: (s: ScopeFilter) => void;
}) {
  const { theme, toggle } = useTheme();
  const { session, profile, isAuthority, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-sm font-semibold tracking-[0.18em] uppercase">Civic Triage</span>
          <span className="rounded border border-border px-1 font-mono text-[10px] text-muted-foreground">
            S36
          </span>
        </Link>

        {onScopeChange && (
          <nav className="ml-4 hidden items-center rounded-md border border-border p-0.5 sm:flex">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => onScopeChange(t.key)}
                className={cn(
                  "rounded-[5px] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors",
                  scope === t.key && "bg-secondary text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          {profile && (
            <span className="hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium sm:inline-flex">
              <Trophy className="size-3.5 text-muted-foreground" />
              {profile.points ?? 0} pts
            </span>
          )}
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Account">
                  <User className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  {profile?.full_name ?? session.user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                  <User className="size-4" /> Profile
                </DropdownMenuItem>
                {isAuthority && (
                  <DropdownMenuItem onClick={() => navigate({ to: "/authority" })}>
                    <ShieldCheck className="size-4" /> Authority dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    navigate({ to: "/login", replace: true });
                  }}
                >
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>

      {onScopeChange && (
        <div className="flex items-center gap-1 border-t border-border px-4 py-2 sm:hidden">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => onScopeChange(t.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground",
                scope === t.key && "bg-secondary text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
