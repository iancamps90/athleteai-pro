-- AthleteAI Pro - Database Schema
-- Ejecuta este script en la consola SQL de Supabase (SQL Editor)

-- 1. Tabla de métricas de usuario (readiness, HRV, sueño, estrés)
CREATE TABLE IF NOT EXISTS user_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  readiness_score INTEGER CHECK (readiness_score >= 0 AND readiness_score <= 100),
  readiness_trend TEXT CHECK (readiness_trend IN ('up', 'down', 'steady')),
  readiness_message TEXT,
  hrv_value DECIMAL(5, 2),
  sleep_hours DECIMAL(4, 2),
  stress_level INTEGER CHECK (stress_level >= 0 AND stress_level <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 2. Tabla de sesiones de entrenamiento
CREATE TABLE IF NOT EXISTS training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  modality TEXT NOT NULL CHECK (modality IN ('cycling', 'strength', 'run', 'recovery')),
  date DATE NOT NULL,
  focus TEXT,
  tss INTEGER,
  duration INTEGER, -- minutos
  zones JSONB, -- Array de {zone: string, minutes: number}
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'skipped')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de nutrición (comidas y macros diarios)
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_id TEXT, -- 'brk', 'lch', 'snk', 'din', etc.
  meal_title TEXT NOT NULL,
  meal_time TIME,
  calories INTEGER,
  protein DECIMAL(6, 2),
  carbs DECIMAL(6, 2),
  fats DECIMAL(6, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, meal_id)
);

-- 4. Tabla de objetivos nutricionales diarios
CREATE TABLE IF NOT EXISTS nutrition_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  calories_target INTEGER,
  protein_target DECIMAL(6, 2),
  carbs_target DECIMAL(6, 2),
  fats_target DECIMAL(6, 2),
  hydration_target DECIMAL(4, 2), -- litros
  hydration_consumed DECIMAL(4, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 5. Tabla de métricas históricas (FTP, CTL, ATL)
CREATE TABLE IF NOT EXISTS metrics_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('ftp', 'ctl', 'atl', 'hrv', 'sleep')),
  period_type TEXT NOT NULL CHECK (period_type IN ('day', 'week', 'month')),
  period_label TEXT NOT NULL, -- 'Lun', 'W34', 'May', etc.
  value DECIMAL(8, 2),
  secondary_value DECIMAL(8, 2), -- Para CTL/ATL (dos valores)
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, metric_type, period_type, period_label)
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_user_metrics_user_date ON user_metrics(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_training_sessions_user_date ON training_sessions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_date ON nutrition_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_nutrition_targets_user_date ON nutrition_targets(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_history_user_type ON metrics_history(user_id, metric_type, period_type);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_user_metrics_updated_at
  BEFORE UPDATE ON user_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_sessions_updated_at
  BEFORE UPDATE ON training_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_targets_updated_at
  BEFORE UPDATE ON nutrition_targets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Los usuarios solo pueden ver/editar sus propios datos
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics_history ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own metrics"
  ON user_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metrics"
  ON user_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metrics"
  ON user_metrics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own training sessions"
  ON training_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training sessions"
  ON training_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training sessions"
  ON training_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own nutrition logs"
  ON nutrition_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition logs"
  ON nutrition_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition logs"
  ON nutrition_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own nutrition targets"
  ON nutrition_targets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition targets"
  ON nutrition_targets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition targets"
  ON nutrition_targets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own metrics history"
  ON metrics_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metrics history"
  ON metrics_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Comentarios en las tablas
COMMENT ON TABLE user_metrics IS 'Métricas diarias de readiness, HRV, sueño y estrés del usuario';
COMMENT ON TABLE training_sessions IS 'Sesiones de entrenamiento planificadas y completadas';
COMMENT ON TABLE nutrition_logs IS 'Registro de comidas y macros diarios';
COMMENT ON TABLE nutrition_targets IS 'Objetivos nutricionales diarios (calorías, macros, hidratación)';
COMMENT ON TABLE metrics_history IS 'Historial de métricas (FTP, CTL, ATL, HRV, sueño) por período';

