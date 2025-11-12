import { NextRequest, NextResponse } from "next/server";
import { exchangeStravaCode, getStravaActivities, mapStravaActivityToTraining } from "@/lib/strava";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL(`/?error=strava_auth_failed&message=${error}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/?error=strava_no_code", request.url)
      );
    }

    // Intercambiar código por access token
    const tokenData = await exchangeStravaCode(code);
    const { access_token, athlete } = tokenData;

    // Obtener usuario actual
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Guardar token en Supabase (necesitarías una tabla user_integrations)
    // Por ahora, solo redirigimos

    // Obtener actividades recientes (últimas 7 días)
    const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
    const activities = await getStravaActivities(access_token, sevenDaysAgo);

    // Convertir actividades a sesiones de entrenamiento
    for (const activity of activities) {
      const trainingSession = mapStravaActivityToTraining(activity);

      // Insertar en Supabase
      await supabase.from("training_sessions").upsert({
        user_id: user.id,
        ...trainingSession,
        external_id: activity.id.toString(),
      });
    }

    return NextResponse.redirect(
      new URL("/training?strava_sync=success", request.url)
    );
  } catch (error) {
    console.error("Error en callback de Strava:", error);
    return NextResponse.redirect(
      new URL("/?error=strava_sync_failed", request.url)
    );
  }
}

