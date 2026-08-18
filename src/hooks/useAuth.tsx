import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;

type AuthValue = {
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  isAuthority: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue>({
  session: null,
  loading: true,
  profile: null,
  isAuthority: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileReady, setProfileReady] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (event === "SIGNED_OUT") {
        queryClient.clear();
      } else if (event === "USER_UPDATED") {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      // Defer marking ready past StrictMode double-effect window
      setTimeout(() => setProfileReady(true), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [queryClient]);

  function isAbortLike(err: unknown): boolean {
    if (err instanceof DOMException && err.name === "AbortError") return true;
    const m = err instanceof Error ? err.message : String(err ?? "");
    return /aborted|network_io_suspended|Failed to fetch|The user aborted|request to .* failed/i.test(m);
  }

  const userId = session?.user.id;
  const { data: profile } = useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId && profileReady,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId!)
          .maybeSingle();
        if (error) {
          if (isAbortLike(error)) return null;
          throw error;
        }
        return data;
      } catch (e) {
        if (isAbortLike(e)) return null;
        throw e;
      }
    },
    staleTime: 120_000,
    retry: 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const value: AuthValue = {
    session,
    loading,
    profile: profile ?? null,
    isAuthority:
      profile?.role === "institute_admin" || profile?.role === "municipality_admin",
    signOut: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
