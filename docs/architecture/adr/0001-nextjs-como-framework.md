# ADR 0001 — Next.js como framework unificador

**Fecha:** 2026-07-30
**Estado:** Aceptada

## Contexto

El sitio actual es HTML/CSS/JS estático sin framework. El proyecto va a
crecer con un módulo de administración (login, roles, CRUD) y un módulo de
votaciones en tiempo real, ambos dentro del mismo dominio
(`www.borca.ph/admin`, `www.borca.ph/votaciones`), compartiendo identidad
gráfica, autenticación y componentes con el sitio de marketing existente.

## Decisión

Se adopta **Next.js (App Router)** como framework único para marketing,
administración y votaciones, en un solo codebase.

## Alternativas consideradas

- **Astro:** ideal para contenido estático puro, pero pierde su ventaja
  principal (cero JS) en cuanto hay auth, datos dinámicos y un panel
  completo. Next.js tiene mejores patrones nativos para layouts anidados y
  rutas protegidas.
- **Backend y frontend separados** (ej. NestJS + React aparte): más piezas
  que mantener y desplegar sin un equipo dedicado de backend.

## Consecuencias

- Un solo lenguaje (TypeScript) de punta a punta.
- El modelo de rutas de Next.js calza directo con `/admin` y `/votaciones`
  como sub-rutas del mismo dominio.
- Ver [ADR 0002](0002-hosting-godaddy-static-export.md) para cómo esto se
  concilia con el hosting actual en GoDaddy.
