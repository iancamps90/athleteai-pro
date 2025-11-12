"use client";

import { useEffect, useState, useMemo } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import {
  readinessSummary,
  hrvTrend,
  sleepTrend,
  metricsTraces,
  type ReadinessSummary,
} from "@/lib/mock-data";

type HRVDataPoint = { day: string; value: number };
type SleepDataPoint = { day: string; value: number };

export function useUserMetrics() {
  const [readiness, setReadiness] = useState<ReadinessSummary>(readinessSummary);
  const [hrvTrendData, setHrvTrend] = useState<HRVDataPoint[]>(hrvTrend);
  const [sleepTrendData, setSleepTrend] = useState<SleepDataPoint[]>(sleepTrend);
  const [metricsTracesData, setMetricsTraces] = useState(metricsTraces);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // Obtener usuario actual
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Obtener métricas del día actual
        const today = new Date().toISOString().split("T")[0];
        const { data: todayMetrics, error: todayError } = await supabaseClient
          .from("user_metrics")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", today)
          .single();

        if (!todayError && todayMetrics) {
          setReadiness({
            score: todayMetrics.readiness_score || 82,
            trend: (todayMetrics.readiness_trend as "up" | "down" | "steady") || "up",
            message: todayMetrics.readiness_message || "Métricas actualizadas",
          });
        }

        // Obtener tendencia HRV (últimos 7 días)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const { data: hrvData, error: hrvError } = await supabaseClient
          .from("user_metrics")
          .select("date, hrv_value")
          .eq("user_id", user.id)
          .gte("date", sevenDaysAgo.toISOString().split("T")[0])
          .order("date", { ascending: true });

        if (!hrvError && hrvData && hrvData.length > 0) {
          const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Hoy"];
          const hrvTrendData: HRVDataPoint[] = hrvData.map((item, idx) => ({
            day: days[idx] || new Date(item.date).toLocaleDateString("es-ES", { weekday: "short" }),
            value: Number(item.hrv_value) || 0,
          }));
          setHrvTrend(hrvTrendData);
        }

        // Obtener tendencia de sueño (últimos 7 días)
        const { data: sleepData, error: sleepError } = await supabaseClient
          .from("user_metrics")
          .select("date, sleep_hours")
          .eq("user_id", user.id)
          .gte("date", sevenDaysAgo.toISOString().split("T")[0])
          .order("date", { ascending: true });

        if (!sleepError && sleepData && sleepData.length > 0) {
          const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Hoy"];
          const sleepTrendData: SleepDataPoint[] = sleepData.map((item, idx) => ({
            day: days[idx] || new Date(item.date).toLocaleDateString("es-ES", { weekday: "short" }),
            value: Number(item.sleep_hours) || 0,
          }));
          setSleepTrend(sleepTrendData);
        }

        // Obtener métricas históricas (FTP, CTL, ATL)
        const { data: ftpData } = await supabaseClient
          .from("metrics_history")
          .select("*")
          .eq("user_id", user.id)
          .eq("metric_type", "ftp")
          .eq("period_type", "month")
          .order("period_label", { ascending: true })
          .limit(7);

        const { data: stressData } = await supabaseClient
          .from("metrics_history")
          .select("*")
          .eq("user_id", user.id)
          .eq("metric_type", "ctl")
          .eq("period_type", "week")
          .order("period_label", { ascending: true })
          .limit(7);

        if (ftpData && ftpData.length > 0) {
          setMetricsTraces((prev) => ({
            ...prev,
            ftp: ftpData.map((item) => ({
              month: item.period_label || "",
              value: Number(item.value) || 0,
            })),
          }));
        }

        if (stressData && stressData.length > 0) {
          setMetricsTraces((prev) => ({
            ...prev,
            stressBalance: stressData.map((item) => ({
              week: item.period_label || "",
              ctl: Number(item.value) || 0,
              atl: Number(item.secondary_value) || 0,
            })),
          }));
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
        // Mantener datos mock en caso de error
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return useMemo(
    () => ({
      readiness,
      hrvTrend: hrvTrendData,
      sleepTrend: sleepTrendData,
      metricsTraces: metricsTracesData,
      isLoading,
    }),
    [readiness, hrvTrendData, sleepTrendData, metricsTracesData, isLoading]
  );
}

