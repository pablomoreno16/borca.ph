# ADR 0002 — Exportación estática de Next.js para hosting en GoDaddy/cPanel

**Fecha:** 2026-07-30
**Estado:** Aceptada

## Contexto

El sitio está publicado en GoDaddy con cPanel (hosting compartido), pagado y
no se va a reemplazar. No hay presupuesto para un hosting con soporte nativo
de Node.js (Vercel, Railway, etc.) ni para ambientes cloud de prueba
adicionales. Next.js normalmente se beneficia de un servidor Node corriendo
de forma persistente (SSR, middleware, funciones serverless).

## Decisión

Next.js se compila con `output: 'export'`. El resultado (HTML/CSS/JS planos)
se sube a GoDaddy exactamente como se sube el sitio hoy (FTP/File Manager).
Toda la lógica dinámica (auth, base de datos, tiempo real, envío de
OTP/SMS) se delega a Supabase (cliente en el navegador + Edge Functions),
nunca al servidor que sirve las páginas.

## Alternativas consideradas

- **Migrar a Vercel u otro hosting con Node:** resolvería el problema de
  forma más "estándar", pero implica un costo recurrente adicional no
  contemplado en el presupuesto actual, y abandonar hosting ya pagado.
- **Usar el "Node.js Selector" de cPanel:** técnicamente posible en algunos
  planes, pero con límites de memoria/concurrencia y soporte de WebSockets
  poco confiable — arriesgado justo para el caso de uso (votaciones en vivo)
  que más lo necesita.

## Consecuencias

- Se pierde SSR por request y el Middleware de Next.js para proteger rutas
  en servidor; la protección de rutas se hace en cliente, sabiendo que la
  autorización real la garantiza Row Level Security en Postgres, no la UI.
- GoDaddy pasa a ser, en la práctica, solo un servidor de archivos estáticos.
- Si el presupuesto cambia en el futuro, pasar de export estático a SSR es
  un cambio de configuración de Next.js, no una reescritura.
