"use client";

import { useEffect, useState } from "react";
import { supabaseClient, signInWithSession, restoreSession } from "@/lib/supabase-client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;

    const init = async () => {
      // Restaurar sesión desde localStorage
      const restored = restoreSession();
      if (mounted && restored) {
        setSession(restored);
        setUser(restored.user);
        setIsLoading(false);
      }

      // Obtener sesión actual de supabase
      const { data } = await supabaseClient.auth.getSession();
      if (mounted) {
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setIsLoading(false);
      }

      // Escuchar cambios
      const {
        data: { subscription },
      } = supabaseClient.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session) {
          localStorage.setItem("sb-auth-token", JSON.stringify(session));
        } else {
          localStorage.removeItem("sb-auth-token");
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    };

    init();
  }, []);

  const signUp = async (email: string, password: string) => {
    return await supabaseClient.auth.signUp({ email, password });
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { session } = await signInWithSession(email, password);

      if (session) {
        setSession(session);
        setUser(session.user);
      }

      return { data: { session }, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    localStorage.removeItem("sb-auth-token");
    return { error };
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };
}
