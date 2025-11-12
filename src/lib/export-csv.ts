/**
 * Utilidades para exportar datos a CSV
 */

export function exportToCSV<T extends Record<string, string | number | null | undefined>>(
  data: T[],
  filename: string,
  headers?: string[]
) {
  if (data.length === 0) {
    alert("No hay datos para exportar");
    return;
  }

  // Obtener headers del primer objeto si no se proporcionan
  const csvHeaders = headers || Object.keys(data[0]);

  // Crear fila de headers
  const headerRow = csvHeaders.join(",");

  // Crear filas de datos
  const dataRows = data.map((row) => {
    return csvHeaders
      .map((header) => {
        const value = row[header];
        // Escapar comillas y envolver en comillas si contiene comas
        if (value === null || value === undefined) return "";
        const stringValue = String(value);
        if (stringValue.includes(",") || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(",");
  });

  // Combinar todo
  const csvContent = [headerRow, ...dataRows].join("\n");

  // Crear blob y descargar
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

type MetricRow = {
  date: string;
  readiness_score?: number | null;
  hrv_value?: number | null;
  sleep_hours?: number | null;
  stress_level?: number | null;
};

/**
 * Exportar métricas a CSV
 */
export function exportMetricsToCSV(metrics: MetricRow[]) {
  exportToCSV(metrics, "athleteai_metrics", [
    "date",
    "readiness_score",
    "hrv_value",
    "sleep_hours",
    "stress_level",
  ]);
}

type TrainingRow = {
  date: string;
  title: string;
  modality?: string;
  tss?: number | null;
  duration?: number | null;
  status?: string;
};

/**
 * Exportar entrenamientos a CSV
 */
export function exportTrainingToCSV(sessions: TrainingRow[]) {
  exportToCSV(sessions, "athleteai_training", [
    "date",
    "title",
    "modality",
    "tss",
    "duration",
    "status",
  ]);
}

type NutritionRow = {
  date: string;
  meal_title: string;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fats?: number | null;
};

/**
 * Exportar nutrición a CSV
 */
export function exportNutritionToCSV(meals: NutritionRow[]) {
  exportToCSV(meals, "athleteai_nutrition", [
    "date",
    "meal_title",
    "calories",
    "protein",
    "carbs",
    "fats",
  ]);
}

