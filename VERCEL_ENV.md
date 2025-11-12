# 🔐 Variables de Entorno para Vercel

## Variables Requeridas

Configura estas variables en **Vercel Dashboard → Settings → Environment Variables**:

### 1. Supabase

```
NEXT_PUBLIC_SUPABASE_URL=https://uqigoqmgmptrpxymylvd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxaWdvcW1nbXB0cnB4eW15bHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjI1MzYsImV4cCI6MjA3ODUzODUzNn0.J0tbjncdhLJIcSwTELNFRPpt9X02r7tZBgP-dBTY8wc
```

### 2. OpenAI

```
OPENAI_API_KEY=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
```

### 3. App URL (IMPORTANTE)

**Después del primer deploy**, Vercel te dará una URL como:
- `https://intelligenttrainingapp.vercel.app` o
- `https://intelligenttrainingapp-xxx.vercel.app`

Usa esa URL para:

```
NEXT_PUBLIC_APP_URL=https://tu-url-de-vercel.vercel.app
```

**Nota**: Si aún no tienes la URL, puedes poner temporalmente `http://localhost:3000` y actualizarla después del primer deploy.

## Cómo Agregar en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Click en **Settings** (Configuración)
3. Click en **Environment Variables** (Variables de Entorno)
4. Agrega cada variable:
   - **Key**: El nombre (ej: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: El valor (ej: `https://uqigoqmgmptrpxymylvd.supabase.co`)
   - **Environment**: Selecciona **Production**, **Preview**, y **Development**
5. Click en **Save**
6. **Redeploy** el proyecto para que tome las nuevas variables

## Verificar que Funcionan

Después del deploy, verifica en los logs de Vercel que no aparezcan errores como:
- "Supabase client no configurado"
- "OpenAI client no disponible"

Si aparecen, significa que las variables no se cargaron correctamente.

## Opcionales (para funcionalidades futuras)

Si quieres usar Strava más adelante:

```
NEXT_PUBLIC_STRAVA_CLIENT_ID=tu_client_id
STRAVA_CLIENT_SECRET=tu_client_secret
NEXT_PUBLIC_STRAVA_REDIRECT_URI=https://tu-url-de-vercel.vercel.app/api/strava/callback
```

