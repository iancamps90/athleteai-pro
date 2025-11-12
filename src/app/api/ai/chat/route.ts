import { NextRequest, NextResponse } from "next/server";
import { generateTrainingInsight } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Construir el prompt con contexto de la conversación
    let fullPrompt = message;
    if (conversationHistory && conversationHistory.length > 0) {
      const historyContext = conversationHistory
        .slice(-5) // Últimos 5 mensajes para contexto
        .map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`)
        .join("\n");
      fullPrompt = `Contexto de la conversación:\n${historyContext}\n\nUsuario: ${message}`;
    }

    const response = await generateTrainingInsight(fullPrompt);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in AI chat route:", error);
    return NextResponse.json(
      { error: "Error generating AI response" },
      { status: 500 }
    );
  }
}

