# 🗄️ Configuración de Supabase

## Paso 1: Ejecutar el Schema SQL

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **SQL Editor** (menú lateral)
3. Crea una nueva query
4. Copia y pega el contenido completo de `supabase-schema.sql`
5. Haz clic en **Run** (o presiona `Ctrl+Enter`)

Esto creará todas las tablas necesarias:
- `user_metrics` - Métricas diarias (readiness, HRV, sueño, estrés)
- `training_sessions` - Sesiones de entrenamiento
- `nutrition_logs` - Registro de comidas
- `nutrition_targets` - Objetivos nutricionales diarios
- `metrics_history` - Historial de métricas (FTP, CTL, ATL)

## Paso 2: Verificar las Tablas

1. Ve a **Table Editor** en el dashboard
2. Deberías ver las 5 tablas creadas
3. Verifica que tienen las columnas correctas

## Paso 3: Configurar Row Level Security (RLS)

El script SQL ya incluye RLS habilitado y políticas básicas. Los usuarios solo podrán ver/editar sus propios datos cuando esté configurado el auth.

## Paso 4: Insertar Datos de Prueba (Opcional)

Puedes insertar datos de prueba ejecutando este SQL (reemplaza `USER_ID` con un UUID de prueba):

```sql
-- Ejemplo: Insertar métricas de prueba
INSERT INTO user_metrics (user_id, date, readiness_score, readiness_trend, readiness_message, hrv_value, sleep_hours, stress_level)
VALUES 
  ('USER_ID', CURRENT_DATE, 82, 'up', 'Tu variabilidad cardiaca mejoró 6% vs ayer.', 81, 7.8, 45),
  ('USER_ID', CURRENT_DATE - INTERVAL '1 day', 76, 'steady', 'Métricas estables.', 75, 7.6, 50);

-- Ejemplo: Insertar sesión de entrenamiento
INSERT INTO training_sessions (user_id, title, modality, date, focus, tss, duration, zones, status)
VALUES 
  ('USER_ID', 'VO2 Max - Intervalos 5x4''', 'cycling', CURRENT_DATE, 'Zonas 5-6, trabajo aeróbico superior', 92, 78, 
   '[{"zone": "Z1", "minutes": 22}, {"zone": "Z2", "minutes": 18}, {"zone": "Z5", "minutes": 20}]'::jsonb, 
   'completed');
```

## Paso 5: Verificar Conexión

1. Asegúrate de que `.env.local` tiene las credenciales correctas:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://uqigoqmgmptrpxymylvd.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. Ejecuta `npm run dev` y verifica que no hay errores en la consola

3. Los hooks ahora intentarán cargar datos de Supabase. Si no hay datos, mostrarán los datos mock como fallback.

## Troubleshooting

### Error: "relation does not exist"
- Verifica que ejecutaste el script SQL completo
- Revisa que las tablas existen en Table Editor

### Error: "permission denied"
- Verifica que RLS está habilitado y las políticas están creadas
- Si estás probando sin auth, puedes deshabilitar temporalmente RLS:
  ```sql
  ALTER TABLE user_metrics DISABLE ROW LEVEL SECURITY;
  ```

### Los datos no aparecen
- Verifica que insertaste datos con el `user_id` correcto
- Revisa la consola del navegador para ver errores de Supabase
- Los hooks tienen fallback a datos mock si no hay datos en Supabase

