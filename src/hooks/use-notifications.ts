"use client";

import { useState, useEffect, useCallback } from "react";
import { useUserMetrics } from "./use-user-metrics";
import { useTrainingPlan } from "./use-training-plan";
import { useNutritionPlan } from "./use-nutrition-plan";

export type Notification = {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { readiness, hrvTrend } = useUserMetrics();
  const { week } = useTrainingPlan();
  const nutrition = useNutritionPlan();

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Máximo 50 notificaciones
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Monitorear métricas y generar notificaciones
  useEffect(() => {
    // Usar setTimeout para evitar setState síncrono en effect
    const timeoutId = setTimeout(() => {
      // Readiness bajo
      if (readiness.score < 65) {
        addNotification({
          type: "warning",
          title: "Readiness bajo",
          message: `Tu readiness está en ${readiness.score}/100. Considera reducir la carga de entrenamiento.`,
        });
      }

    // HRV bajo
    if (hrvTrend.length > 0) {
      const latestHRV = hrvTrend[hrvTrend.length - 1].value;
      if (latestHRV < 60) {
        addNotification({
          type: "warning",
          title: "HRV bajo",
          message: `Tu HRV está en ${latestHRV}ms. Puede indicar fatiga acumulada.`,
        });
      }
    }

    // Carga alta
    const weeklyTSS = week.reduce((sum, session) => sum + (session.tss || 0), 0);
    if (weeklyTSS > 500 && readiness.score < 70) {
      addNotification({
        type: "warning",
        title: "Carga semanal alta",
        message: `Has acumulado ${weeklyTSS} TSS esta semana. Con readiness bajo, considera un día de descanso.`,
      });
    }

    // Nutrición incompleta
    const nutritionProgress = (nutrition.caloriesConsumed / nutrition.caloriesTarget) * 100;
    if (nutritionProgress < 80) {
      addNotification({
        type: "info",
        title: "Nutrición incompleta",
        message: `Has consumido ${nutritionProgress.toFixed(0)}% de tus calorías objetivo.`,
      });
    }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [readiness, hrvTrend, week, nutrition, addNotification]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}

