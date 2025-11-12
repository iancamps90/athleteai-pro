"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useAIAgent } from "@/hooks";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function AICoachPage(): React.ReactElement {
  return (
    <AppShell>
      <CoachChat />
    </AppShell>
  );
}

function CoachChat() {
  const { messages, sendMessage, isLoading, quickPrompts } = useAIAgent();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">AthleteAI Coach</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Ajusta entrenamientos y nutrición combinando tus métricas en tiempo
            real.
          </p>
        </div>
        <Button variant="outline" className="rounded-full">
          Exportar conversación
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt)}
            className="rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-left text-sm font-medium text-neutral-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/5 dark:bg-neutral-900/60 dark:text-neutral-200"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-white/10 bg-white/70 p-6 dark:border-white/5 dark:bg-neutral-950/60">
        {messages
          .filter((message) => message.role !== "system")
          .map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-3xl rounded-2xl border px-5 py-3 text-sm shadow-sm",
                message.role === "assistant"
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "ml-auto border-neutral-200 bg-white text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              )}
            >
              <p>{message.content}</p>
              <p className="mt-2 text-xs text-neutral-500">
                {message.createdAt.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/70 p-3 shadow-sm dark:border-white/5 dark:bg-neutral-950/60">
        <input
          placeholder="Pide ajustes a tu plan..."
          className="flex-1 rounded-xl border border-transparent bg-white px-4 py-3 text-sm text-neutral-700 outline-none focus:border-primary/40 dark:bg-neutral-900 dark:text-neutral-100"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading}
          className="rounded-2xl px-4 py-2"
        >
          Enviar
          <SendHorizontal size={16} />
        </Button>
      </div>
    </div>
  );
}

