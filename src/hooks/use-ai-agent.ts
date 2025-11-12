"use client";

import { useCallback, useMemo, useState } from "react";
import { aiQuickPrompts } from "@/lib/mock-data";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
  status?: "streaming" | "error" | "complete";
};

const SYSTEM_PROMPT =
  "Eres AthleteAI, un coach híbrido de entrenamiento y nutrición. Responde en español, tono profesional cercano, entregando recomendaciones accionables basadas en métricas HRV, carga de entrenamiento, sueño y nutrición. Aclara supuestos y ofrece datos cuando sea posible.";

const createMessageId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `msg_${Math.random().toString(36).slice(2, 11)}`;
};

export function useAIAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system",
      role: "system",
      content: SYSTEM_PROMPT,
      createdAt: new Date(),
    },
    {
      id: "assistant-initial",
      role: "assistant",
      content:
        "Hola, soy tu coach AthleteAI. Tengo tus métricas de readiness, sueño y entrenamientos. ¿Qué quieres optimizar hoy?",
      createdAt: new Date(),
      status: "complete",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const id = createMessageId();
    const timestamp = new Date();

    setMessages((prev) => [
      ...prev,
      { id, role: "user", content, createdAt: timestamp, status: "complete" },
      {
        id: `${id}-assistant`,
        role: "assistant",
        content: "Procesando insights con AthleteAI Pro...",
        createdAt: new Date(),
        status: "streaming",
      },
    ]);

    setIsLoading(true);

    try {
      // Preparar historial de conversación (sin mensajes system)
      const conversationHistory = messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Llamar a la API route de Next.js
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();
      const aiResponse = data.response || "No pude generar una respuesta.";

      setMessages((prev) =>
        prev.map((message) =>
          message.id === `${id}-assistant`
            ? {
                ...message,
                content: aiResponse,
                status: "complete",
                createdAt: new Date(),
              }
            : message
        )
      );
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === `${id}-assistant`
            ? {
                ...message,
                content:
                  "No pude conectar con AthleteAI ahora mismo. Verifica que OPENAI_API_KEY esté configurada en .env.local.",
                status: "error",
              }
            : message
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const lastAssistantMessage = messages
    .slice()
    .reverse()
    .find((message) => message.role === "assistant");

  return useMemo(
    () => ({
      messages,
      isLoading,
      sendMessage,
      quickPrompts: aiQuickPrompts,
      lastAssistantMessage,
    }),
    [messages, isLoading, sendMessage, lastAssistantMessage]
  );
}

