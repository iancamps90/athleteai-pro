import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Crear cliente de Supabase
  const supabase = createMiddlewareClient({ req, res });

  // Obtener sesión actual
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;
  const isAuthPage = pathname.startsWith("/auth");

  // Si no hay sesión y la ruta no es /auth → redirigir al login
  if (!session && !isAuthPage) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth";
    return NextResponse.redirect(redirectUrl);
  }

  // Si hay sesión y va a /auth → redirigir al dashboard
  if (session && isAuthPage) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// ✅ Rutas donde se aplica el middleware
export const config = {
  matcher: [
    "/",
    "/auth",
    "/dashboard/:path*",
    "/profile/:path*",
    // Agrega aquí las rutas que quieras proteger
  ],
};

