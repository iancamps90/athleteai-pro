"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce", // necesario para producción
  },
});

// ⚙️ Forzar cookie manual al iniciar sesión
export async function signInWithSession(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  if (data.session) {
    // Forzamos almacenamiento local del token (persistencia)
    localStorage.setItem("sb-auth-token", JSON.stringify(data.session));
  }

  return data;
}

// Recuperar sesión si se recarga la página
export function restoreSession() {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("sb-auth-token");
  if (!raw) return null;

  const session = JSON.parse(raw);
  if (session) {
    supabaseClient.auth.setSession(session);
  }
  return session;
}

