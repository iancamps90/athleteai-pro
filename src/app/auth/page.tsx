"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // ✅ Redirección segura si ya hay sesión activa
  useEffect(() => {
    if (authLoading) return; // Espera a que el hook cargue
    if (user) {
      console.log("✅ Usuario detectado, redirigiendo al dashboard...");
      router.replace("/"); // replace evita bucles o historial roto
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        console.log("🟢 Iniciando sesión con:", email);
        const { error: authError } = await signIn(email, password);

        if (authError) {
          console.error("❌ Error login:", authError.message);
          setError(authError.message);
        } else {
          console.log("✅ Login correcto, redirigiendo...");
          router.replace("/");
        }
      } else {
        console.log("🟣 Registrando usuario nuevo:", email);
        const { error: signUpError } = await signUp(email, password);

        if (signUpError) {
          console.error("❌ Error registro:", signUpError.message);
          setError(signUpError.message);
        } else {
          setMessage(
            "✅ Revisa tu correo y confirma tu cuenta para continuar. El enlace te redirigirá automáticamente a AthleteAI Pro."
          );
        }
      }
    } catch (err) {
      console.error("❌ Error inesperado:", err);
      setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Evita render vacío mientras detecta sesión
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-blue">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    );
  }

  // ✅ Si hay sesión, no renderizamos el login (ya redirige arriba)
  if (user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-blue p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/90 p-8 shadow-2xl dark:bg-neutral-900/90">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            AthleteAI Pro
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {isLogin ? "Inicia sesión" : "Crea tu cuenta"} para comenzar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-xl bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? "Iniciando sesión..." : "Creando cuenta..."}
              </>
            ) : isLogin ? (
              "Iniciar sesión"
            ) : (
              "Crear cuenta"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setMessage(null);
            }}
            className="text-primary hover:underline"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
