"use client";

import { useEffect, useState, useMemo } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import { trainingPlan, type TrainingSession } from "@/lib/mock-data";

export function useTrainingPlan() {
  const [week, setWeek] = useState<TrainingSession[]>(trainingPlan);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrainingPlan() {
      try {
        // Obtener usuario actual
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Obtener sesiones de la semana actual
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lunes
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo

        const { data, error } = await supabaseClient
          .from("training_sessions")
          .select("*")
          .eq("user_id", user.id)
          .gte("date", startOfWeek.toISOString().split("T")[0])
          .lte("date", endOfWeek.toISOString().split("T")[0])
          .order("date", { ascending: true });

        if (!error && data && data.length > 0) {
          const sessions: TrainingSession[] = data.map((item) => ({
            id: item.id,
            title: item.title,
            modality: item.modality as "cycling" | "strength" | "run" | "recovery",
            date: item.date,
            focus: item.focus || "",
            tss: item.tss || 0,
            duration: item.duration || 0,
            zones: (item.zones as Array<{ zone: string; minutes: number }>) || [],
            status: (item.status as "planned" | "completed" | "skipped") || "planned",
          }));
          setWeek(sessions);
        }
      } catch (error) {
        console.error("Error fetching training plan:", error);
        // Mantener datos mock en caso de error
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrainingPlan();
  }, []);

  return useMemo(() => ({ week, isLoading }), [week, isLoading]);
}

