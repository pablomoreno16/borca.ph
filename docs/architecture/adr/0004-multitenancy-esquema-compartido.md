# ADR 0004 — Multi-tenancy con esquema compartido + Row Level Security

**Fecha:** 2026-07-30
**Estado:** Aceptada

## Contexto

El producto se proyecta como SaaS para "miles de copropiedades". Hay que
decidir cómo se aíslan los datos de una copropiedad de otra.

## Decisión

**Una sola base de datos, un solo esquema.** Toda tabla que pertenece a una
copropiedad tiene una columna `copropiedad_id`, y políticas de Row Level
Security en Postgres garantizan que cada usuario solo lea/escriba filas de
su(s) propia(s) copropiedad(es).

## Alternativas consideradas

- **Base de datos por copropiedad:** aísla perfectamente, pero no escala
  operacionalmente a miles de instancias (backups, migraciones y monitoreo
  se vuelven miles de tareas en vez de una).
- **Un esquema de Postgres por copropiedad:** intermedio, pero sigue
  multiplicando el trabajo de migraciones y no resuelve consultas
  cross-tenant que el `super_admin` sí necesita (ej. soporte).

## Consecuencias

- Toda tabla nueva (presente y futura, incluidos los módulos del ERP) debe
  incluir `copropiedad_id` desde su primera migración, junto con su política
  RLS — no se pospone "para después".
- Se requiere indexar `copropiedad_id` en cada tabla tenant-scoped, ya que
  es el filtro que RLS aplica en cada consulta.
- Un error en una política RLS es un incidente de seguridad grave (fuga
  entre tenants) — cada política nueva se revisa con un caso de prueba
  explícito que intenta acceder a datos de otra copropiedad y espera que
  falle.
