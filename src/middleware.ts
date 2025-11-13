/* eslint-disable prefer-const */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Creamos una respuesta base (usando NextResponse)
  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });

  // Instancia del cliente de Supabase en el middleware (SSR)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // 🔧 Configuramos opciones para producción
            response.cookies.set(name, value, {
              ...options,
              domain: ".iancamps.dev", // importante para que persista en Vercel
              sameSite: "none",
              secure: true,
            });
          });
        },
      },
    }
  );

  // Obtenemos la sesión actual del usuario
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/auth");

  // 🔐 Redirigir si no hay sesión y trata de entrar a una página protegida
  if (!user && !isAuthPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth";
    return NextResponse.redirect(redirectUrl);
  }

  // 🚪 Si ya está autenticado y va a /auth, mandarlo al dashboard
  if (user && isAuthPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

// Rutas protegidas / accesibles por el middleware
export const config = {
  matcher: [
    "/",
    "/auth",
    "/dashboard/:path*",
    "/perfil/:path*",
    "/account/:path*",
  ],
};
