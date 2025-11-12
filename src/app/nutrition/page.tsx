"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useNutritionPlan } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Salad, Droplets, Flame } from "lucide-react";
import { formatPercentage } from "@/lib/utils";

export default function NutritionPage(): React.ReactElement {
  return (
    <AppShell>
      <NutritionPlanner />
    </AppShell>
  );
}

function NutritionPlanner() {
  const nutrition = useNutritionPlan();

  const hydrationPercent =
    (nutrition.hydrationLiters / nutrition.hydrationTarget) * 100;

  return (
    <div className="flex h-full flex-col gap-5">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-neutral-400">
            Nutrición personalizada
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full">
            Exportar a Notion
          </Button>
          <Button className="rounded-full bg-gradient-orange px-6 text-white shadow-soft">
            Nueva pauta AI
          </Button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <article className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-md dark:border-white/5 dark:bg-neutral-950/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-neutral-400">Calorías</p>
              <h2 className="text-3xl font-semibold">
                {nutrition.caloriesConsumed} / {nutrition.caloriesTarget} kcal
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Ajusta en función de la carga planificada y HRV promedio.
              </p>
            </div>
            <div className="grid h-12 w-12 place-content-center rounded-2xl bg-orange-100 text-orange-500 dark:bg-orange-500/20">
              <Flame size={22} />
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Proteínas",
                consumed: nutrition.macrosConsumed.protein,
                target: nutrition.macrosTarget.protein,
              },
              {
                label: "Carbohidratos",
                consumed: nutrition.macrosConsumed.carbs,
                target: nutrition.macrosTarget.carbs,
              },
              {
                label: "Grasas",
                consumed: nutrition.macrosConsumed.fats,
                target: nutrition.macrosTarget.fats,
              },
            ].map((macro) => {
              const percent = (macro.consumed / macro.target) * 100;
              return (
                <div
                  key={macro.label}
                  className="rounded-2xl border border-white/10 bg-white/70 p-4 dark:border-white/5 dark:bg-neutral-900/60"
                >
                  <p className="text-sm text-neutral-400">{macro.label}</p>
                  <p className="text-2xl font-semibold">
                    {macro.consumed}g
                    <span className="text-sm text-neutral-400">
                      {" "}
                      / {macro.target}g
                    </span>
                  </p>
                  <div className="mt-3 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-gradient-blue"
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs uppercase text-green-500">
                    {formatPercentage(percent)}
                  </p>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-gradient-blue p-6 text-white shadow-lg dark:border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Hidratación</h2>
            <div className="grid h-12 w-12 place-content-center rounded-2xl bg-white/15">
              <Droplets size={22} />
            </div>
          </div>
          <p className="mt-2 text-sm text-white/80">
            Basamos tu pauta en sudoración estimada y carga planificada de 2
            sesiones.
          </p>
          <p className="mt-4 text-3xl font-semibold">
            {nutrition.hydrationLiters.toFixed(1)} L
            <span className="text-base font-normal text-white/70">
              {" "}
              / {nutrition.hydrationTarget.toFixed(1)} L
            </span>
          </p>
          <div className="mt-4 h-2 rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${Math.min(100, hydrationPercent)}%` }}
            />
          </div>
          <Button
            variant="ghost"
            className="mt-5 h-10 w-full justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            Generar plan de hidratación
          </Button>
        </article>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-md dark:border-white/5 dark:bg-neutral-950/60">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Comidas planeadas</h2>
          <Button variant="outline" className="rounded-full">
            Ver historial
          </Button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {nutrition.meals.map((meal) => (
            <article
              key={meal.id}
              className="rounded-2xl border border-white/10 bg-white/80 p-4 shadow-sm dark:border-white/5 dark:bg-neutral-900/70"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300">
                  {meal.time}
                </span>
                <Salad size={18} className="text-primary" />
              </div>
              <h3 className="mt-3 text-lg font-semibold">{meal.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {meal.calories} kcal
              </p>
              <p className="mt-3 text-xs text-neutral-400">
                {meal.macros.protein}g proteína · {meal.macros.carbs}g carbs ·{" "}
                {meal.macros.fats}g grasas
              </p>
              <Button variant="ghost" size="sm" className="mt-4 w-full rounded-xl">
                Ajustar con IA
              </Button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

