"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase-client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleSession = async () => {
      const { data, error } = await supabaseClient.auth.getSession();

      if (error) {
        console.error("Error al obtener sesión:", error);
        router.push("/auth?error=callback");
        return;
      }

      if (data.session) {
        router.push("/");
      } else {
        router.push("/auth");
      }
    };

    handleSession();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-blue text-white">
      <p className="text-lg font-medium">Verificando tu sesión...</p>
    </div>
  );
}
