"use client";

import { useEffect, useState } from "react";
import {
  supabaseClient,
  signInWithSession,
  restoreSession,
} from "@/lib/supabase-client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      // 🔹 Restaurar sesión desde localStorage (si existe)
      const restored = restoreSession();
      if (isMounted && restored) {
        setSession(restored);
        setUser(restored.user);
        setIsLoading(false);
      }

      // 🔹 Obtener sesión actual desde Supabase
      const { data } = await supabaseClient.auth.getSession();
      if (isMounted) {
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setIsLoading(false);
      }

      // 🔹 Escuchar cambios de autenticación (login / logout)
      const {
        data: { subscription },
      } = supabaseClient.auth.onAuthStateChange((_event, session) => {
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Guardar / limpiar sesión local
        if (session) {
          localStorage.setItem("sb-auth-token", JSON.stringify(session));
        } else {
          localStorage.removeItem("sb-auth-token");
        }
      });

      // Limpieza al desmontar
      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  // 🔹 Registro
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  // 🔹 Inicio de sesión con persistencia local
  const signIn = async (email: string, password: string) => {
    try {
      const { session } = await signInWithSession(email, password);
      if (session) {
        setSession(session);
        setUser(session.user);
      }
      return { data: { session }, error: null };
    } catch (error: unknown) {
      const typedError =
        error instanceof Error ? error : new Error("Error desconocido");
      return { data: null, error: typedError };
    }
  };

  // 🔹 Cierre de sesión
  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    localStorage.removeItem("sb-auth-token");
    return { error };
  };

  return {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}
