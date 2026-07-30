# ADR 0003 — Supabase como plataforma de datos, auth y tiempo real

**Fecha:** 2026-07-30
**Estado:** Aceptada

## Contexto

Tras [ADR 0002](0002-hosting-godaddy-static-export.md), no hay servidor
propio donde correr un backend tradicional. Se necesita base de datos
relacional (modelo de copropiedades/unidades/propietarios con relaciones
muchas-a-muchos), autenticación, autorización granular por rol,
actualización en tiempo real de quórum/resultados de votación, y todo esto
priorizando open source, bajo costo, pago por consumo y buena comunidad.

## Decisión

Se adopta **Supabase** (Postgres administrado + Auth + Realtime + Storage +
Edge Functions) como la plataforma de datos y backend del proyecto.

## Alternativas consideradas

- **Firebase:** Firestore (NoSQL) es mal ajuste para el modelo relacional
  descrito; Postgres es claramente superior aquí.
- **Postgres autogestionado en una VM propia:** requeriría alguien
  manteniendo backups, parches y escalado — no hay equipo de
  infraestructura dedicado.
- **PocketBase u otros BaaS pequeños:** comunidad y garantías de
  continuidad a largo plazo muy por debajo de Supabase.

## Consecuencias

- Toda la autorización se implementa con Row Level Security de Postgres
  (ver [03-autenticacion-autorizacion.md](../03-autenticacion-autorizacion.md)),
  no en código de aplicación.
- El tiempo real (quórum, resultados de votación) se resuelve con Supabase
  Realtime sobre cambios de tablas — el navegador se conecta directo al
  servicio de Supabase, sin pasar por GoDaddy.
- Lo que necesita privilegios elevados o secretos (envío de OTP, cierre de
  votación) se implementa como Edge Functions de Supabase.
- Es open source en su núcleo, lo que deja la puerta abierta a
  auto-hospedar en el futuro si algún día se justifica salir de la nube de
  Supabase.
