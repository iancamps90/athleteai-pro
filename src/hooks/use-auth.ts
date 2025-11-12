"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase-client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ✅ Obtener sesión actual
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // ✅ Escuchar cambios de sesión (login / logout)
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (event === "SIGNED_IN") {
        router.push("/"); // 🔁 redirige al dashboard
      } else if (event === "SIGNED_OUT") {
        router.push("/auth"); // 🔁 redirige al login
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // ✅ Registro con redirección correcta
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        // 👇 Aquí debe coincidir exactamente con tu dominio en producción
        emailRedirectTo: "https://athleteai-pro.iancamps.dev/",
      },
    });
    return { data, error };
  };

  // ✅ Login normal
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  // ✅ Logout
  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
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

