"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Download, ClipboardList } from "lucide-react";
import { exportMetricsToCSV } from "@/lib/export-csv";
import { useUserMetrics } from "@/hooks";
import { MiniAreaChart } from "@/components/charts/mini-area";
import { MultiLineChart } from "@/components/charts/multi-line";
import { supabaseClient } from "@/lib/supabase-client";
import { useState } from "react";

export default function MetricsPage(): React.ReactElement {
  return (
    <AppShell>
      <MetricsDashboard />
    </AppShell>
  );
}

function MetricsDashboard() {
  const { metricsTraces, hrvTrend, sleepTrend } = useUserMetrics();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (!user) return;

      // Obtener métricas de los últimos 30 días
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: metrics } = await supabaseClient
        .from("user_metrics")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", thirtyDaysAgo.toISOString().split("T")[0])
        .order("date", { ascending: false });

      if (metrics && metrics.length > 0) {
        exportMetricsToCSV(metrics);
      } else {
        alert("No hay métricas para exportar");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Error al exportar métricas");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-neutral-400">Métricas clave</p>
          <h1 className="text-2xl font-semibold">Panel de rendimiento</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Seguimiento de FTP, carga y métricas de recuperación agregadas por AthleteAI.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full">
            <ClipboardList size={16} className="mr-2" />
            Reporte semanal
          </Button>
          <Button
            className="rounded-full bg-gradient-blue px-5 text-white"
            onClick={handleExportCSV}
            disabled={isExporting}
          >
            <Download size={16} className="mr-2" />
            {isExporting ? "Exportando..." : "Exportar CSV"}
          </Button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <article className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-md dark:border-white/5 dark:bg-neutral-950/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-neutral-400">FTP</p>
              <h2 className="text-2xl font-semibold">Evolución FTP</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Últimos 6 meses · tendencia +4.8%
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              312w
            </span>
          </div>
          <div className="mt-6 h-[320px]">
            <MiniAreaChart
              data={metricsTraces.ftp}
              dataKey="value"
              xKey="month"
              gradientId="ftpGradient"
            />
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-md dark:border-white/5 dark:bg-neutral-950/60">
          <p className="text-xs uppercase text-neutral-400">Recuperación</p>
          <h2 className="text-xl font-semibold">Dinámica HRV</h2>
          <div className="mt-4 h-[220px]">
            <MiniAreaChart
              data={hrvTrend}
              dataKey="value"
              xKey="day"
              gradientId="metricHrv"
            />
          </div>
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            AthleteAI detectó correlación positiva con sueño &gt;7h30 y recomienda mantener
            cargas por debajo de 92 TSS en días con HRV {"<"} 70 ms.
          </p>
        </article>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-md dark:border-white/5 dark:bg-neutral-950/60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-neutral-400">Balance carga</p>
            <h2 className="text-xl font-semibold">CTL vs ATL</h2>
          </div>
          <Button variant="ghost" className="rounded-full">
            Añadir comparación
          </Button>
        </div>
        <div className="mt-6">
          <MultiLineChart
            data={metricsTraces.stressBalance}
            xKey="week"
            series={[
              { dataKey: "ctl", color: "#0A84FF", name: "CTL" },
              { dataKey: "atl", color: "#FF6A00", name: "ATL" },
            ]}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-md dark:border-white/5 dark:bg-neutral-950/60">
        <p className="text-xs uppercase text-neutral-400">Sueño</p>
        <h2 className="text-xl font-semibold">Calidad de sueño</h2>
        <div className="mt-4 h-[240px]">
          <MiniAreaChart
            data={sleepTrend}
            dataKey="value"
            xKey="day"
            gradientId="sleepMetrics"
            color="#FF6A00"
          />
        </div>
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          Mantén tu rutina de desconexión 30 minutos antes de dormir y controla la
          ingesta de cafeína para sostener la mejora.
        </p>
      </section>
    </div>
  );
}

