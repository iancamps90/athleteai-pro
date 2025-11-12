/**
 * Integración con Strava API
 * 
 * Para usar:
 * 1. Crea una app en https://www.strava.com/settings/api
 * 2. Obtén Client ID y Client Secret
 * 3. Configura redirect URI: https://tu-dominio.com/api/strava/callback
 * 4. Agrega STRAVA_CLIENT_ID y STRAVA_CLIENT_SECRET a .env.local
 */

const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/strava/callback`;

export function getStravaAuthUrl(): string {
  if (!STRAVA_CLIENT_ID) {
    throw new Error("STRAVA_CLIENT_ID no configurado");
  }

  const params = new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
    redirect_uri: STRAVA_REDIRECT_URI,
    response_type: "code",
    scope: "activity:read_all",
    approval_prompt: "force",
  });

  return `https://www.strava.com/oauth/authorize?${params.toString()}`;
}

export async function exchangeStravaCode(code: string) {
  if (!STRAVA_CLIENT_SECRET) {
    throw new Error("STRAVA_CLIENT_SECRET no configurado");
  }

  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error("Error al intercambiar código de Strava");
  }

  return response.json();
}

export async function getStravaActivities(accessToken: string, after?: number) {
  const params = new URLSearchParams();
  if (after) {
    params.append("after", after.toString());
  }
  params.append("per_page", "30");

  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener actividades de Strava");
  }

  return response.json();
}

type StravaActivity = {
  id: number;
  name?: string;
  type?: string;
  start_date_local?: string;
  moving_time?: number;
  average_watts?: number;
};

export function mapStravaActivityToTraining(activity: StravaActivity) {
  return {
    title: activity.name || "Actividad de Strava",
    modality: activity.type?.toLowerCase() === "ride" ? "cycling" : "run",
    date: activity.start_date_local?.split("T")[0],
    duration: activity.moving_time ? Math.round(activity.moving_time / 60) : 0, // minutos
    tss: calculateTSS(activity), // Estimación básica
    focus: `Actividad sincronizada desde Strava`,
    zones: [], // Strava no proporciona zonas directamente
    status: "completed" as const,
    external_id: activity.id.toString(),
  };
}

function calculateTSS(activity: StravaActivity): number {
  // Estimación básica de TSS basada en duración y potencia promedio
  // TSS = (segundos * NP^2) / (FTP^2 * 3600) * 100
  // Para simplificar, usamos una estimación basada en duración
  if (!activity.moving_time) return 0;
  const hours = activity.moving_time / 3600;
  const estimatedTSS = Math.round(hours * 60); // Estimación conservadora
  return estimatedTSS;
}

