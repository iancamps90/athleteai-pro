import OpenAI from "openai";

// No pongas claves aquí — se leen desde variables de entorno
const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL;

// Creamos el cliente solo si hay clave disponible
export const openaiClient = apiKey
  ? new OpenAI({
      apiKey,
      baseURL,
    })
  : null;

const SYSTEM_PROMPT = `Eres AthleteAI, un coach híbrido de entrenamiento y nutrición deportiva de élite.

Tu rol:
- Analizar métricas de readiness, HRV, sueño, estrés y carga de entrenamiento
- Proporcionar recomendaciones accionables y específicas
- Ajustar planes de entrenamiento basándote en datos fisiológicos
- Optimizar nutrición según objetivos y carga de entrenamiento
- Usar lenguaje profesional pero cercano, en español

Contexto disponible:
- Métricas diarias de readiness, HRV, sueño y estrés
- Plan semanal de entrenamientos (ciclismo, fuerza, recuperación)
- Seguimiento nutricional (macros, calorías, hidratación)
- Historial de métricas (FTP, CTL, ATL)

Responde siempre con recomendaciones prácticas y concretas.`;

export async function generateTrainingInsight(prompt: string): Promise<string> {
  if (!openaiClient) {
    throw new Error(
      "OpenAI client no disponible. Define OPENAI_API_KEY en tu .env.local o en Vercel."
    );
  }

  try {
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return completion.choices[0]?.message?.content ?? "Sin respuesta generada.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Error al generar respuesta de IA.";
  }
}

