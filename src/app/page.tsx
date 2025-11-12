"use client";

import { ArrowRight, Flame, HeartPulse, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/cards/metric-card";
import { MiniAreaChart } from "@/components/charts/mini-area";
import { MultiLineChart } from "@/components/charts/multi-line";
import { Button } from "@/components/ui/button";
import { cn, formatPercentage } from "@/lib/utils";
import {
  useUserMetrics,
  useTrainingPlan,
  useNutritionPlan,
  useAIAgent,
} from "@/hooks";

function TrainingList() {
  const { week } = useTrainingPlan();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Semana de carga</h3>
        <Button variant="ghost" size="sm" className="text-neutral-500">
          Ver calendario
        </Button>
      </div>
      <div className="space-y-3">
        {week.map((session) => (
          <div
            key={session.id}
            className={cn(
              "flex items-center justify-between rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/5 dark:bg-neutral-900/60",
              session.status === "completed" && "border-primary/20"
            )}
          >
            <div>
              <p className="text-xs uppercase text-neutral-400">
                {new Date(session.date).toLocaleDateString("es-ES", {
                  weekday: "short",
                })}
              </p>
              <p className="text-base font-semibold">{session.title}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {session.focus}
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              <span>{session.tss} TSS</span>
              <span>{session.duration} min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NutritionSummary() {
  const nutrition = useNutritionPlan();
  const proteinPct =
    (nutrition.macrosConsumed.protein / nutrition.macrosTarget.protein) * 100;
  const carbsPct =
    (nutrition.macrosConsumed.carbs / nutrition.macrosTarget.carbs) * 100;
  const fatsPct =
    (nutrition.macrosConsumed.fats / nutrition.macrosTarget.fats) * 100;

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-orange p-6 text-white shadow-soft dark:border-white/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80">Nutrición · Hoy</p>
          <p className="text-3xl font-semibold">
            {nutrition.caloriesConsumed} / {nutrition.caloriesTarget} kcal
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 rounded-full bg-white/10 px-4 text-white hover:bg-white/20"
        >
          Ajustar macros
        </Button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          { label: "Proteínas", value: proteinPct },
          { label: "Carbohidratos", value: carbsPct },
          { label: "Grasas", value: fatsPct },
        ].map((macro) => (
          <div key={macro.label} className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-white/70">{macro.label}</p>
            <p className="text-2xl font-semibold">
              {formatPercentage(macro.value)}
            </p>
            <div className="mt-3 h-2 rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${Math.min(100, macro.value)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {nutrition.meals.map((meal) => (
          <div
            key={meal.id}
            className="flex items-center justify-between rounded-2xl bg-white/15 px-4 py-3 text-sm"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60">
                {meal.time}
              </p>
              <p className="text-base font-semibold">{meal.title}</p>
            </div>
            <div className="text-right text-sm text-white/80">
              <p>{meal.calories} kcal</p>
              <p className="text-xs">
                {meal.macros.protein}P · {meal.macros.carbs}C · {meal.macros.fats}
                G
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIAgentPreview() {
  const { quickPrompts, lastAssistantMessage } = useAIAgent();

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-white/70 p-6 shadow-md dark:border-white/5 dark:bg-neutral-950/60">
      <div>
        <p className="text-xs uppercase text-neutral-400">AthleteAI</p>
        <h3 className="text-xl font-semibold">Resumen inteligente</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Insights combinados de HRV, sueño y carga para la sesión clave de hoy.
        </p>
      </div>
      <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-primary shadow-soft">
        {lastAssistantMessage?.content}
      </div>
      <div>
        <p className="text-xs uppercase text-neutral-400">Prompts sugeridos</p>
        <div className="mt-3 grid gap-2">
          {quickPrompts.slice(0, 4).map((prompt) => (
            <button
              key={prompt}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white px-4 py-3 text-left text-sm font-medium text-neutral-700 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/5 dark:bg-neutral-900 dark:text-neutral-200"
            >
              {prompt}
              <ArrowRight size={16} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}

function DashboardContent() {
  const { readiness, hrvTrend, sleepTrend, metricsTraces } = useUserMetrics();

  return (
    <div className="grid gap-6">
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Readiness Score"
          value={readiness.score}
          subtitle={readiness.message}
          trend={{ value: "+6%", direction: "up" }}
          variant="gradient"
          icon={<TrendingUp size={20} />}
          className="md:col-span-2 xl:col-span-1"
        >
          <div className="grid grid-cols-2 gap-4 text-sm text-white/90">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60">
                HRV
              </p>
              <p className="text-lg font-semibold">81 ms</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60">
                Sueño profundo
              </p>
              <p className="text-lg font-semibold">2h 12m</p>
            </div>
          </div>
        </MetricCard>
        <MetricCard
          title="Variabilidad cardiaca"
          value="81 ms"
          subtitle="Ventana 7 días"
          icon={<HeartPulse size={20} className="text-primary" />}
        >
          <MiniAreaChart
            data={hrvTrend}
            dataKey="value"
            xKey="day"
            gradientId="hrvGradient"
          />
        </MetricCard>
        <MetricCard
          title="Sueño efectivo"
          value="7h 48m"
          subtitle="Calidad 92%"
          icon={<Flame size={20} className="text-accent" />}
        >
          <MiniAreaChart
            data={sleepTrend}
            dataKey="value"
            xKey="day"
            gradientId="sleepGradient"
            color="#FF6A00"
          />
        </MetricCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1.2fr]">
        <div className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-md dark:border-white/5 dark:bg-neutral-950/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase text-neutral-400">Carga</p>
              <h3 className="text-xl font-semibold">
                Equilibrio CTL / ATL semanal
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Mantén el ATL por debajo de 95 para maximizar supercompensación.
              </p>
            </div>
            <Button variant="outline" size="sm" className="h-9 rounded-full">
              Exportar
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
        </div>
        <AIAgentPreview />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-md dark:border-white/5 dark:bg-neutral-950/60">
          <TrainingList />
        </div>
        <NutritionSummary />
      </section>
    </div>
  );
}
