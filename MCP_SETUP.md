# 🔌 Configuración MCP (Model Context Protocol) para Cursor

## ¿Qué es MCP?

MCP (Model Context Protocol) es un protocolo que permite a Cursor (tu editor) acceder directamente a herramientas y contextos externos, como tu base de datos Supabase. **Esto es solo para desarrollo en Cursor, no para la aplicación Next.js.**

## Configuración en Cursor

Para que Cursor pueda acceder a tu proyecto de Supabase directamente:

1. Crea o edita el archivo `.cursor/mcp.json` en la raíz del proyecto:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=uqigoqmgmptrpxymylvd"
    }
  }
}
```

2. Reinicia Cursor para que cargue la configuración MCP.

## ¿Para qué sirve?

Con MCP configurado, Cursor puede:
- Consultar tu base de datos Supabase directamente
- Ver el esquema de tablas
- Generar queries SQL basadas en tu estructura
- Ayudar con migraciones y cambios de schema

## Importante

- **MCP es solo para desarrollo**: No afecta la aplicación en producción
- **La app usa el cliente de Supabase**: La aplicación Next.js usa `@supabase/supabase-js` directamente, no MCP
- **Seguridad**: MCP solo funciona en tu entorno local de Cursor

## Alternativa: Instalación rápida

Si prefieres, puedes usar el botón "Add to Cursor" desde el dashboard de Supabase, que automáticamente configurará MCP.

