export type TrainingSession = {
  id: string;
  title: string;
  modality: "cycling" | "strength" | "run" | "recovery";
  date: string;
  focus: string;
  tss: number;
  duration: number;
  zones: Array<{ zone: string; minutes: number }>;
  status: "planned" | "completed" | "skipped";
};

export type MacroBreakdown = {
  protein: number;
  carbs: number;
  fats: number;
};

export interface ReadinessSummary {
  score: number;
  trend: "up" | "down" | "steady";
  message: string;
}

export const readinessSummary: ReadinessSummary = {
  score: 82,
  trend: "up",
  message: "Tu variabilidad cardiaca mejoró 6% vs ayer. Ideal para un bloque intenso.",
};

export const hrvTrend = [
  { day: "Lun", value: 72 },
  { day: "Mar", value: 69 },
  { day: "Mié", value: 74 },
  { day: "Jue", value: 77 },
  { day: "Vie", value: 75 },
  { day: "Sáb", value: 78 },
  { day: "Hoy", value: 81 },
];

export const sleepTrend = [
  { day: "Lun", value: 7.1 },
  { day: "Mar", value: 6.8 },
  { day: "Mié", value: 7.4 },
  { day: "Jue", value: 6.9 },
  { day: "Vie", value: 7.6 },
  { day: "Sáb", value: 8.0 },
  { day: "Hoy", value: 7.8 },
];

export const trainingPlan: TrainingSession[] = [
  {
    id: "mon",
    title: "VO2 Max - Intervalos 5x4'",
    modality: "cycling",
    date: "2025-11-10",
    focus: "Zonas 5-6, trabajo aeróbico superior",
    tss: 92,
    duration: 78,
    zones: [
      { zone: "Z1", minutes: 22 },
      { zone: "Z2", minutes: 18 },
      { zone: "Z3", minutes: 10 },
      { zone: "Z5", minutes: 20 },
      { zone: "Z6", minutes: 8 },
    ],
    status: "completed",
  },
  {
    id: "tue",
    title: "Fuerza - Lower Body",
    modality: "strength",
    date: "2025-11-11",
    focus: "Potencia y core integrado",
    tss: 55,
    duration: 65,
    zones: [{ zone: "Fuerza", minutes: 40 }],
    status: "completed",
  },
  {
    id: "wed",
    title: "Tempo - Sweet Spot 2x20'",
    modality: "cycling",
    date: "2025-11-12",
    focus: "Estabilidad en FTP, cadencia 95-100",
    tss: 88,
    duration: 90,
    zones: [
      { zone: "Z2", minutes: 28 },
      { zone: "Z3", minutes: 12 },
      { zone: "Sweet Spot", minutes: 40 },
      { zone: "Z5", minutes: 10 },
    ],
    status: "planned",
  },
  {
    id: "thu",
    title: "Recovery Ride",
    modality: "cycling",
    date: "2025-11-13",
    focus: "Capilarización + cadencia suelta",
    tss: 48,
    duration: 60,
    zones: [
      { zone: "Z1", minutes: 40 },
      { zone: "Z2", minutes: 20 },
    ],
    status: "planned",
  },
  {
    id: "fri",
    title: "Gimnasio - Upper Body",
    modality: "strength",
    date: "2025-11-14",
    focus: "Estabilidad escapular + core",
    tss: 60,
    duration: 55,
    zones: [{ zone: "Fuerza", minutes: 42 }],
    status: "planned",
  },
  {
    id: "sat",
    title: "Long Ride - Endurance",
    modality: "cycling",
    date: "2025-11-15",
    focus: "Zonas 2-3, cadencia 90",
    tss: 126,
    duration: 180,
    zones: [
      { zone: "Z1", minutes: 28 },
      { zone: "Z2", minutes: 92 },
      { zone: "Z3", minutes: 60 },
    ],
    status: "planned",
  },
  {
    id: "sun",
    title: "Recovery + Mobility",
    modality: "recovery",
    date: "2025-11-16",
    focus: "Respiración diafragmática + movilidad cadera",
    tss: 32,
    duration: 45,
    zones: [
      { zone: "Movilidad", minutes: 20 },
      { zone: "Respiración", minutes: 25 },
    ],
    status: "planned",
  },
];

export const nutritionSummary = {
  caloriesTarget: 3200,
  caloriesConsumed: 2980,
  macrosTarget: {
    protein: 180,
    carbs: 400,
    fats: 90,
  } satisfies MacroBreakdown,
  macrosConsumed: {
    protein: 172,
    carbs: 382,
    fats: 95,
  } satisfies MacroBreakdown,
  hydrationLiters: 3.2,
  hydrationTarget: 3.5,
  meals: [
    {
      id: "brk",
      title: "Desayuno - Bowl energía FTP",
      calories: 680,
      macros: { protein: 38, carbs: 88, fats: 18 },
      time: "08:30",
    },
    {
      id: "lch",
      title: "Almuerzo - Salmón + quinoa",
      calories: 810,
      macros: { protein: 46, carbs: 76, fats: 32 },
      time: "14:00",
    },
    {
      id: "snk",
      title: "Snack - Smoothie recovery",
      calories: 320,
      macros: { protein: 28, carbs: 35, fats: 9 },
      time: "17:30",
    },
    {
      id: "din",
      title: "Cena - Bowl antiinflamatorio",
      calories: 920,
      macros: { protein: 48, carbs: 96, fats: 36 },
      time: "21:00",
    },
  ],
};

export const metricsTraces = {
  ftp: [
    { month: "May", value: 278 },
    { month: "Jun", value: 284 },
    { month: "Jul", value: 291 },
    { month: "Ago", value: 298 },
    { month: "Sep", value: 305 },
    { month: "Oct", value: 308 },
    { month: "Nov", value: 312 },
  ],
  stressBalance: [
    { week: "W34", ctl: 82, atl: 68 },
    { week: "W35", ctl: 84, atl: 86 },
    { week: "W36", ctl: 87, atl: 80 },
    { week: "W37", ctl: 90, atl: 96 },
    { week: "W38", ctl: 92, atl: 85 },
    { week: "W39", ctl: 94, atl: 89 },
    { week: "W40", ctl: 96, atl: 83 },
  ],
};

export const aiQuickPrompts = [
  "Ajusta mi plan de mañana si duermo menos de 6h",
  "Genera un bloque polarizado para la próxima semana",
  "Sugiere comidas ricas en omega-3 para hoy",
  "Evalúa el impacto de mi HRV en la carga de VO2",
  "Optimiza mi tapering para la carrera A en 14 días",
];

