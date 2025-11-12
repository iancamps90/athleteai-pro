"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdaptivePlan } from "@/hooks/use-adaptive-plan";
import { getStravaAuthUrl } from "@/lib/strava";

export default function SettingsPage(): React.ReactElement {
  return (
    <AppShell>
      <SettingsContent />
    </AppShell>
  );
}

function SettingsContent() {
  return (
    <div className="flex h-full flex-col gap-6">
      <header>
        <p className="text-xs uppercase text-neutral-400">Configuración</p>
        <h1 className="text-2xl font-semibold">Preferencias de AthleteAI</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Ajusta a tu gusto autenticación, integraciones y notificaciones.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <SettingsCard title="Integraciones" description="Conecta servicios externos.">
          <div className="space-y-4">
            <IntegrationRow
              label="Garmin Connect"
              description="Sincroniza métricas de HRV y VO2 máximo."
            />
            <StravaIntegrationRow />
            <IntegrationRow
              label="Apple Health / Google Fit"
              description="Importa métricas de sueño y recuperación."
            />
          </div>
          <Button variant="outline" className="mt-6 rounded-full">
            Conectar nueva integración
          </Button>
        </SettingsCard>

        <SettingsCard
          title="Preferencias IA"
          description="Define tono, idioma y nivel de detalle."
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="tone">Tono</Label>
              <Input id="tone" placeholder="Profesional cercano" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="language">Idioma</Label>
              <Input id="language" placeholder="Español (ES)" className="mt-1" />
            </div>
            <AdaptivePlanToggle />
          </div>
        </SettingsCard>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-md dark:border-white/5 dark:bg-neutral-950/60">
        <h2 className="text-xl font-semibold">Notificaciones</h2>
        <div className="mt-4 space-y-3">
          <NotificationRow label="Readiness bajo" description="Cuando HRV &lt; 65ms." />
          <NotificationRow label="Carga alta" description="ATL supera CTL + 8 puntos." />
          <NotificationRow
            label="Nutrición incompleta"
            description="No completaste el 90% de macros planificados."
          />
        </div>
        <Button variant="ghost" className="mt-6 rounded-full">
          Gestionar canales
        </Button>
      </section>
    </div>
  );
}

type SettingsCardProps = React.PropsWithChildren<{
  title: string;
  description: string;
}>;

function SettingsCard({ title, description, children }: SettingsCardProps) {
  return (
    <article className="flex flex-col rounded-3xl border border-white/10 bg-white/70 p-6 shadow-md dark:border-white/5 dark:bg-neutral-950/60">
      <header className="mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
      </header>
      {children}
    </article>
  );
}

type IntegrationRowProps = {
  label: string;
  description: string;
};

function IntegrationRow({ label, description }: IntegrationRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-sm shadow-sm dark:border-white/5 dark:bg-neutral-900/60">
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>
      <Button size="sm" variant="ghost" className="rounded-full">
        Conectar
      </Button>
    </div>
  );
}

function NotificationRow({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-sm shadow-sm dark:border-white/5 dark:bg-neutral-900/60">
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>
      <Switch />
    </div>
  );
}

function AdaptivePlanToggle() {
  const { isEnabled, setIsEnabled, recommendations } = useAdaptivePlan();

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/70 px-4 py-3 dark:border-white/5 dark:bg-neutral-900/60">
      <div>
        <p className="text-sm font-semibold">Plan Adaptativo</p>
        <p className="text-xs text-neutral-500">
          Ajusta entrenamientos automáticamente según tus métricas.
          {recommendations.length > 0 && (
            <span className="ml-1 text-primary">
              ({recommendations.length} recomendaciones)
            </span>
          )}
        </p>
      </div>
      <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
    </div>
  );
}

function StravaIntegrationRow() {
  const handleConnect = () => {
    try {
      const authUrl = getStravaAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      alert("Strava no está configurado. Agrega STRAVA_CLIENT_ID en .env.local");
    }
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-sm shadow-sm dark:border-white/5 dark:bg-neutral-900/60">
      <div>
        <p className="font-semibold">Strava</p>
        <p className="text-xs text-neutral-500">
          Carga automática de entrenamientos completados.
        </p>
      </div>
      <Button size="sm" variant="ghost" className="rounded-full" onClick={handleConnect}>
        Conectar
      </Button>
    </div>
  );
}

