# 🏋️ AthleteAI Pro — MVP v1.0

**App Full Stack de entrenamiento, nutrición y gimnasio con agente de IA**

Desarrollado con Next.js 14, Supabase, OpenAI API y TailwindCSS. Basado en prototipo Figma con diseño responsive y modo claro/oscuro.

---

## 🚀 Quick Start

### Prerrequisitos

- Node.js 18+ y npm/pnpm/yarn
- Cuenta en [Supabase](https://supabase.com) (gratuita)
- API Key de [OpenAI](https://platform.openai.com) (opcional para MVP, necesario para IA funcional)

### Instalación

```bash
# 1. Clonar o navegar al proyecto
cd athleteai-pro

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Edita .env.local con tus credenciales de Supabase y OpenAI

# 4. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📁 Estructura del Proyecto

```
athleteai-pro/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── ai/                # Chat con agente IA
│   │   ├── training/          # Plan de entrenamientos
│   │   ├── nutrition/         # Seguimiento nutricional
│   │   ├── metrics/           # Gráficos y métricas
│   │   └── settings/          # Configuración
│   ├── components/
│   │   ├── layout/            # Sidebar, Topbar, AppShell
│   │   ├── cards/             # MetricCard y componentes de tarjetas
│   │   ├── charts/            # MiniAreaChart, MultiLineChart (Recharts)
│   │   └── ui/                # Componentes base (Button, Input, etc.)
│   ├── hooks/                 # Custom hooks (useUserMetrics, useAIAgent, etc.)
│   ├── lib/                   # Utilidades, clientes (Supabase, OpenAI), mock data
│   ├── providers/             # ThemeProvider (next-themes)
│   └── store/                 # Zustand stores (ui-store)
├── public/                    # Assets estáticos
├── .env.local.example         # Template de variables de entorno
└── README.md                  # Este archivo
```

---

## 🛠️ Tecnologías

### Frontend

- **Next.js 16** (App Router) — Framework React con SSR/SSG
- **TailwindCSS v4** — Estilos utility-first con design tokens del Figma
- **Framer Motion** — Animaciones fluidas (fade, slide, scale)
- **Recharts** — Gráficos interactivos para métricas
- **Zustand** — Gestión de estado ligera
- **next-themes** — Toggle dark/light mode
- **Lucide React** — Iconos SVG
- **Shadcn/UI** (inspiración) — Componentes base reutilizables

### Backend & Integraciones

- **Supabase** — Auth, Database, Storage (preparado, pendiente configuración)
- **OpenAI API** — Agente IA Coach (gpt-4o-mini)
- **Edge Functions** (futuro) — Lógica serverless para análisis

---

## 🎨 Design System

### Colores

- **Primary**: `#007AFF` (light) / `#0A84FF` (dark)
- **Accent**: `#FF6A00` (light) / `#FF9F0A` (dark)
- **Success**: `#2CC197`
- **Warning**: `#FFB020`
- **Danger**: `#FF4D4F`

### Tipografía

- **Sans**: Inter / System fonts
- **Mono**: Menlo / Monospace

### Espaciado

- Base: `8px` (0.5rem)
- Escala: `8/12/16/20/24/32px`

### Border Radius

- Global: `16px` (1rem)
- Cards: `24px` (1.5rem)

### Animaciones

- **fade-in**: 250ms ease-out
- **scale-in**: 300ms cubic-bezier(0.16, 1, 0.3, 1)
- **slide-up**: 320ms cubic-bezier(0.16, 1, 0.3, 1)

---

## ⚙️ Configuración

### Variables de Entorno

Copia `.env.local.example` a `.env.local` y completa:

```env
# Supabase (requerido para auth y datos)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# OpenAI (opcional para MVP, requerido para IA funcional)
OPENAI_API_KEY=sk-xxx...
```

### Supabase Setup

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **Settings → API** y copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. (Opcional) Configura tablas para métricas, entrenamientos, nutrición (ver sección Futuro)

### OpenAI Setup

1. Crea una API key en [platform.openai.com](https://platform.openai.com/api-keys)
2. Pégala en `OPENAI_API_KEY`
3. El agente IA usará `gpt-4o-mini` por defecto (configurable en `src/lib/openai.ts`)

---

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (localhost:3000)
npm run build    # Build de producción
npm run start    # Servidor de producción (después de build)
npm run lint     # ESLint check
```

---

## 🧩 Funcionalidades MVP v1

### ✅ Implementado

- **Dashboard dinámico** con métricas (readiness, HRV, estrés, sueño)
- **Agente IA** con chat básico (mock hasta conectar OpenAI)
- **Entrenamientos** — Listado semanal con TSS, duración, zonas
- **Nutrición** — Seguimiento de macros y calorías diarias
- **Métricas** — Gráficos de FTP, HRV, estrés, sueño
- **Settings** — Toggle dark/light mode
- **Diseño responsive** (mobile/desktop)
- **Navegación** con Sidebar y Topbar

### 🔄 Pendiente (v2.0)

- **Auth real** con Supabase (registro, login, logout)
- **Integración Garmin/Strava API** para métricas en tiempo real
- **Planificador adaptativo** con ajuste automático por IA
- **Sincronización de métricas** en tiempo real
- **Notificaciones push**
- **Apple Health / Google Fit** sync

---

## 🧪 Datos Mock

Actualmente la app usa datos mock en `src/lib/mock-data.ts`. Los hooks están preparados para conectar con Supabase:

- `useUserMetrics()` — Métricas de readiness, HRV, estrés, sueño
- `useTrainingPlan()` — Plan semanal de entrenamientos
- `useNutritionPlan()` — Macros y comidas diarias
- `useAIAgent()` — Chat con agente IA

**Para conectar datos reales:**

1. Crea tablas en Supabase (ej: `user_metrics`, `training_sessions`, `nutrition_logs`)
2. Reemplaza las llamadas mock en los hooks por queries a Supabase
3. Implementa Server Actions o API Routes para operaciones server-side

---

## 🐛 Troubleshooting

### Error: "Supabase client no configurado"

- Verifica que `.env.local` existe y tiene `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Reinicia el servidor de desarrollo después de cambiar `.env.local`

### Error: "OpenAI client no disponible"

- La app funciona sin OpenAI, pero el agente IA mostrará respuestas mock
- Para activar IA real, agrega `OPENAI_API_KEY` en `.env.local`

### Estilos no se aplican

- Verifica que `tailwind.config.ts` incluye todas las rutas de componentes
- Ejecuta `npm run dev` de nuevo para recargar la configuración

---

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Recharts Docs](https://recharts.org)

---

## 🚧 Roadmap

### v1.1 (Próximo)
- [ ] Auth completo con Supabase
- [ ] Migración de datos mock a Supabase
- [ ] Edge Functions para análisis de entrenamiento

### v2.0 (Futuro)
- [ ] Integración Garmin Connect API
- [ ] Integración Strava API
- [ ] Planificador adaptativo con IA
- [ ] Notificaciones push
- [ ] Sincronización Apple Health / Google Fit

---

## 📄 Licencia

Este proyecto es parte de un portafolio personal. Uso libre para aprendizaje y desarrollo.

---

## 👤 Autor

Desarrollado con ❤️ usando Cursor AI + Figma to Code

---

**¿Preguntas o sugerencias?** Abre un issue o contacta al equipo de desarrollo.
