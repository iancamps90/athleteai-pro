import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "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";

const baseURL = process.env.OPENAI_BASE_URL;

export const openaiClient = apiKey
  ? new OpenAI({
      apiKey,
      baseURL,
    })
  : undefined;

const SYSTEM_PROMPT = `Eres AthleteAI, un coach híbrido de entrenamiento y nutrición deportiva de élite. 

Tu rol:
- Analizar métricas de readiness, HRV, sueño, estrés y carga de entrenamiento
- Proporcionar recomendaciones accionables y específicas
- Ajustar planes de entrenamiento basándote en datos fisiológicos
- Optimizar nutrición según objetivos y carga de entrenamiento
- Usar lenguaje profesional pero cercano, en español

Contexto que tienes disponible:
- Métricas diarias de readiness, HRV, sueño y estrés
- Plan semanal de entrenamientos (ciclismo, fuerza, recuperación)
- Seguimiento nutricional (macros, calorías, hidratación)
- Historial de métricas (FTP, CTL, ATL)

Responde siempre de forma concreta, con datos específicos cuando sea posible, y ofrece recomendaciones prácticas.`;

export async function generateTrainingInsight(prompt: string): Promise<string> {
  if (!openaiClient) {
    throw new Error(
      "OpenAI client no disponible. Asegúrate de definir OPENAI_API_KEY en tu .env.local."
    );
  }

  try {
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return completion.choices[0]?.message?.content ?? "Sin respuesta generada.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Error al generar respuesta de IA");
  }
}

