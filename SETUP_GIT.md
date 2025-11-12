# 🚀 Setup Git y GitHub

## Inicializar Repositorio

```bash
cd athleteai-pro

# Inicializar git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: AthleteAI Pro MVP v1.0

- Frontend completo con Next.js 14
- Backend con Supabase (auth, database)
- Integración OpenAI para agente IA
- Plan adaptativo de entrenamiento
- Exportación CSV de métricas
- Sistema de notificaciones
- Integración Strava (preparada)
- Deploy configurado para Vercel"
```

## Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `athleteai-pro` (o el que prefieras)
3. **NO** marques "Initialize with README"
4. Haz clic en "Create repository"

## Conectar y Subir

```bash
# Agregar remote
git remote add origin https://github.com/TU_USUARIO/athleteai-pro.git

# Cambiar a branch main
git branch -M main

# Subir código
git push -u origin main
```

## Estructura del Repositorio

```
athleteai-pro/
├── src/                    # Código fuente
├── public/                 # Assets estáticos
├── .env.local.example      # Template de variables
├── supabase-schema.sql     # Schema de base de datos
├── README.md               # Documentación principal
├── DEPLOY.md               # Guía de deploy
├── SUPABASE_SETUP.md       # Setup de Supabase
├── MCP_SETUP.md            # Setup MCP para Cursor
└── vercel.json             # Configuración Vercel
```

## Comandos Útiles

```bash
# Ver estado
git status

# Agregar cambios
git add .

# Commit
git commit -m "Descripción de cambios"

# Push
git push

# Ver historial
git log --oneline
```

## .gitignore

El proyecto ya tiene `.gitignore` configurado para:
- `node_modules/`
- `.env.local` (no se sube, solo `.env.local.example`)
- `.next/` (build de Next.js)
- Archivos temporales

## Siguiente Paso

Una vez subido a GitHub, sigue las instrucciones en `DEPLOY.md` para deployar en Vercel.

