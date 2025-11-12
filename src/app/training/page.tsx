"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useTrainingPlan } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Activity, Timer, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TrainingPage(): React.ReactElement {
  return (
    <AppShell>
      <TrainingPlanner />
    </AppShell>
  );
}

function TrainingPlanner() {
  const { week } = useTrainingPlan();

  return (
    <div className="flex h-full flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-neutral-400">Plan semanal</p>
          <h1 className="text-2xl font-semibold">Block Build · Semana 6</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            AthleteAI sincroniza tus métricas para ajustar Zonas, TSS y densidad.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full">
            Exportar .FIT
          </Button>
          <Button className="rounded-full bg-gradient-blue px-6 text-white shadow-soft">
            Generar semana adaptativa
          </Button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <TrainingHighlight
          icon={<Activity size={20} />}
          label="Carga planificada"
          primary="451 TSS"
          trend="+7% vs semana anterior"
        />
        <TrainingHighlight
          icon={<TrendingUp size={20} />}
          label="CTL objetivo"
          primary="96 pts"
          trend="+2.8 puntos"
        />
        <TrainingHighlight
          icon={<Timer size={20} />}
          label="Horas totales"
          primary="13h 45m"
          trend="+50m sobre plan"
        />
      </div>

      <div className="grid flex-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {week.map((session) => (
          <article
            key={session.id}
            className={cn(
              "flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/80 p-6 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/5 dark:bg-neutral-950/75",
              session.status === "completed" && "border-primary/30 bg-primary/5"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-neutral-400">
                  {new Date(session.date).toLocaleDateString("es-ES", {
                    weekday: "long",
                  })}
                </p>
                <h2 className="text-xl font-semibold">{session.title}</h2>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {session.modality}
              </span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              {session.focus}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
              <span>{session.tss} TSS</span>
              <span>{session.duration} min</span>
            </div>

            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/60 p-4 text-sm dark:border-white/5 dark:bg-neutral-900/60">
              <p className="text-xs uppercase text-neutral-400">Zonas</p>
              {session.zones.map((zone) => (
                <div key={zone.zone} className="flex items-center justify-between">
                  <span>{zone.zone}</span>
                  <span className="text-neutral-500">{zone.minutes}min</span>
                </div>
              ))}
            </div>

            <Button variant="outline" className="mt-auto rounded-full">
              Ajustar sesión
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}

type HighlightProps = {
  icon: React.ReactNode;
  label: string;
  primary: string;
  trend: string;
};

function TrainingHighlight({ icon, label, primary, trend }: HighlightProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/70 p-5 shadow-md dark:border-white/5 dark:bg-neutral-950/70">
      <div className="flex items-center gap-3 text-primary">
        <div className="grid h-11 w-11 place-content-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            {label}
          </p>
          <p className="text-xl font-semibold text-neutral-900 dark:text-white">
            {primary}
          </p>
          <p className="text-sm text-green-500">{trend}</p>
        </div>
      </div>
    </div>
  );
}

