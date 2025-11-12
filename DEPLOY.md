# 🚀 Guía de Deploy - AthleteAI Pro

## Deploy en Vercel (Recomendado)

### Paso 1: Preparar el Repositorio

1. **Inicializar Git** (si no lo has hecho):
   ```bash
   cd athleteai-pro
   git init
   git add .
   git commit -m "Initial commit: AthleteAI Pro MVP"
   ```

2. **Crear repositorio en GitHub**:
   - Ve a https://github.com/new
   - Crea un nuevo repositorio (ej: `athleteai-pro`)
   - **NO** inicialices con README, .gitignore o licencia
   - Copia la URL del repositorio

3. **Conectar y subir**:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/athleteai-pro.git
   git branch -M main
   git push -u origin main
   ```

### Paso 2: Deploy en Vercel

1. **Ir a Vercel**:
   - Ve a https://vercel.com
   - Inicia sesión con GitHub
   - Haz clic en "Add New Project"

2. **Importar repositorio**:
   - Selecciona tu repositorio `athleteai-pro`
   - Vercel detectará automáticamente Next.js

3. **Configurar Variables de Entorno**:
   En la sección "Environment Variables", agrega:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://uqigoqmgmptrpxymylvd.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   OPENAI_API_KEY=sk-proj-...
   NEXT_PUBLIC_APP_URL=https://tu-proyecto.vercel.app
   ```

4. **Deploy**:
   - Haz clic en "Deploy"
   - Espera 2-3 minutos
   - ¡Tu app estará online!

### Paso 3: Configurar Dominio (Opcional)

1. En el dashboard de Vercel, ve a "Settings" → "Domains"
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

## Deploy en Netlify (Alternativa)

1. **Ve a Netlify**: https://app.netlify.com
2. **Conecta GitHub** y selecciona tu repositorio
3. **Configura build**:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Agrega variables de entorno** (mismas que Vercel)
5. **Deploy**

## Variables de Entorno Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
OPENAI_API_KEY=tu_openai_key
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

## Opcionales (para funcionalidades avanzadas)

```env
NEXT_PUBLIC_STRAVA_CLIENT_ID=tu_strava_client_id
STRAVA_CLIENT_SECRET=tu_strava_secret
NEXT_PUBLIC_STRAVA_REDIRECT_URI=https://tu-dominio.com/api/strava/callback
```

## Post-Deploy Checklist

- [ ] Verificar que la app carga correctamente
- [ ] Probar autenticación (registro/login)
- [ ] Verificar que las API routes funcionan
- [ ] Probar el agente IA
- [ ] Verificar responsive en mobile
- [ ] Configurar dominio personalizado (opcional)

## Troubleshooting

### Error: "Supabase client no configurado"
- Verifica que las variables de entorno estén configuradas en Vercel
- Asegúrate de que empiecen con `NEXT_PUBLIC_` si se usan en el cliente

### Error: "OpenAI API error"
- Verifica que `OPENAI_API_KEY` esté configurada
- Revisa los límites de tu cuenta de OpenAI

### Build falla
- Revisa los logs en Vercel
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que no haya errores de TypeScript (`npm run build` localmente)

## Actualizaciones Futuras

Para actualizar la app:
1. Haz cambios en tu repositorio local
2. `git push` a GitHub
3. Vercel detectará los cambios y redeployará automáticamente

