import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Obtener access_token de user_integrations
    // Por ahora, retornamos error indicando que necesita conectar primero
    return NextResponse.json(
      {
        error: "Strava no conectado",
        message: "Conecta tu cuenta de Strava primero desde Settings",
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error sincronizando Strava" },
      { status: 500 }
    );
  }
}

