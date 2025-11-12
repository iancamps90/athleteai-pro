"use client";

import { useState, useEffect, useMemo } from "react";
import { useUserMetrics } from "./use-user-metrics";
import { useTrainingPlan } from "./use-training-plan";

type AdaptiveRecommendation = {
  type: "increase" | "decrease" | "maintain" | "recovery";
  message: string;
  reason: string;
  suggestedTSS?: number;
  suggestedDuration?: number;
};

export function useAdaptivePlan() {
  const { readiness, hrvTrend, sleepTrend } = useUserMetrics();
  const { week } = useTrainingPlan();
  const [recommendations, setRecommendations] = useState<AdaptiveRecommendation[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (!isEnabled) {
      // Usar setTimeout para evitar setState síncrono en effect
      setTimeout(() => setRecommendations([]), 0);
      return;
    }

    // Calcular recomendaciones basadas en métricas
    const newRecommendations: AdaptiveRecommendation[] = [];

    // Análisis de readiness
    if (readiness.score < 60) {
      newRecommendations.push({
        type: "recovery",
        message: "Readiness bajo - Día de recuperación recomendado",
        reason: `Tu readiness está en ${readiness.score}/100. Considera reducir la intensidad o tomar un día de descanso.`,
        suggestedTSS: 30,
        suggestedDuration: 45,
      });
    } else if (readiness.score > 85) {
      newRecommendations.push({
        type: "increase",
        message: "Readiness excelente - Ideal para entrenamiento intenso",
        reason: `Tu readiness está en ${readiness.score}/100. Puedes aumentar la carga o intensidad hoy.`,
      });
    }

    // Análisis de HRV
    if (hrvTrend.length >= 2) {
      const latestHRV = hrvTrend[hrvTrend.length - 1].value;
      const previousHRV = hrvTrend[hrvTrend.length - 2].value;
      const hrvChange = ((latestHRV - previousHRV) / previousHRV) * 100;

      if (hrvChange < -10) {
        newRecommendations.push({
          type: "decrease",
          message: "HRV en descenso - Reduce la carga",
          reason: `Tu HRV bajó ${Math.abs(hrvChange).toFixed(1)}% vs ayer. Considera reducir TSS en 20-30%.`,
        });
      } else if (hrvChange > 10) {
        newRecommendations.push({
          type: "increase",
          message: "HRV mejorando - Puedes aumentar carga",
          reason: `Tu HRV subió ${hrvChange.toFixed(1)}% vs ayer. Buena señal de recuperación.`,
        });
      }
    }

    // Análisis de sueño
    if (sleepTrend.length > 0) {
      const latestSleep = sleepTrend[sleepTrend.length - 1].value;
      if (latestSleep < 6) {
        newRecommendations.push({
          type: "decrease",
          message: "Sueño insuficiente - Ajusta entrenamiento",
          reason: `Dormiste ${latestSleep.toFixed(1)}h. Considera reducir intensidad o duración.`,
        });
      }
    }

    // Análisis de carga semanal
    const weeklyTSS = week.reduce((sum, session) => sum + (session.tss || 0), 0);
    if (weeklyTSS > 500 && readiness.score < 70) {
      newRecommendations.push({
        type: "recovery",
        message: "Carga semanal alta - Día de descanso recomendado",
        reason: `Has acumulado ${weeklyTSS} TSS esta semana. Con readiness bajo, considera descanso.`,
      });
    }

    setRecommendations(newRecommendations);
  }, [isEnabled, readiness, hrvTrend, sleepTrend, week]);

  const applyRecommendation = async (recommendation: AdaptiveRecommendation, sessionId: string) => {
    if (!recommendation.suggestedTSS || !recommendation.suggestedDuration) return;

    try {
      const session = week.find((s) => s.id === sessionId);
      if (!session) return;

      const newTSS = Math.max(30, Math.floor(session.tss * 0.7)); // Reducir 30%
      const newDuration = Math.max(30, Math.floor(session.duration * 0.8)); // Reducir 20%

      const response = await fetch("/api/training", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sessionId,
          tss: recommendation.type === "decrease" ? newTSS : session.tss,
          duration: recommendation.type === "decrease" ? newDuration : session.duration,
        }),
      });

      if (response.ok) {
        // Recargar página o actualizar estado
        window.location.reload();
      }
    } catch (error) {
      console.error("Error applying recommendation:", error);
    }
  };

  return {
    recommendations,
    isEnabled,
    setIsEnabled,
    applyRecommendation,
  };
}

