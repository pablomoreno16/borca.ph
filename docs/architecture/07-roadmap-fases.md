# Roadmap por fases

Cada fase sigue el mismo ciclo, sin excepción: analizar → actualizar
arquitectura si hace falta → diseñar modelo de datos → diseñar API → backend
→ pruebas → frontend → pruebas → documentación → **esperar aprobación antes
de seguir con la siguiente fase**. No se empieza una fase nueva con la
anterior a medio terminar.

---

## Fase 0 — Migración del sitio actual a Next.js

**Objetivo:** que el sitio de marketing existente (5 páginas) funcione
idéntico visualmente, pero sobre la base técnica nueva, antes de agregar
nada de administración. Sin esto, `/admin` no tiene dónde vivir.

**Historias de usuario**
- Como visitante, veo el mismo sitio de hoy (mismo contenido, mismo diseño)
  sin notar diferencia alguna tras la migración.
- Como editor del sitio, el header y el footer ahora se editan en un solo
  lugar y se reflejan en las 5 páginas.

**Alcance técnico**
- Proyecto Next.js nuevo (`output: 'export'`), Tailwind configurado con los
  tokens de marca actuales (verde `#0B5D5B`, dorado `#C8A96B`, tipografías
  Playfair Display + Nunito Sans).
- Las 5 páginas actuales migradas a `app/`, header/footer como componentes en
  `src/shared/ui/`.
- El carrusel de novedades pasa a leer de una tabla en Supabase en vez de
  HTML hardcodeado (ya deja preparado el terreno para la Fase 1).
- Pipeline de CI/CD (build + deploy FTP a GoDaddy) funcionando de punta a
  punta con este contenido antes de agregar nada dinámico.

**Base de datos:** solo la tabla `carrusel_item` (título, descripción, orden,
tipo — promoción/evento/anuncio, activo, fechas de vigencia).

**Pruebas:** Playwright verificando que las 5 páginas rendericen igual que
hoy (visual + funcional: menú mobile, carrusel, formularios de contacto).

**Criterios de aceptación**
- [ ] Las 5 páginas están en Next.js y se ven idénticas a la versión actual.
- [ ] El despliegue a GoDaddy funciona automáticamente desde CI.
- [ ] El carrusel se alimenta de Supabase, aunque todavía no haya UI para
      editarlo (eso es la Fase 1).

---

## Fase 1 — Login, perfiles, autenticación/autorización y gestión del carrusel

Esta es la fase que se pidió priorizar. Es intencionalmente pequeña: valida
todo el mecanismo de auth + roles + RLS con el caso más simple posible
(el carrusel) antes de construir algo tan sensible como asambleas/votaciones
sobre una base de auth no probada.

**Nota de alcance (corregida el 2026-07-31):** en esta fase el sitio sigue
siendo 100% de BORCA (la empresa) — todavía no existe portal de clientes.
El carrusel es contenido del sitio de BORCA (global), no de una copropiedad
cliente. La tabla `copropiedad` y cualquier modelo multi-tenant por
`copropiedad_id` se posponen a la fase que construya el portal de clientes
(dueños/inquilinos de las copropiedades que administra BORCA) — construirlo
ahora habría sido diseñar para un tenant que no existe todavía.

**Historias de usuario**
- Como administrador, inicio sesión en `/admin` con email y contraseña.
- Como administrador, si no he iniciado sesión, no puedo ver ninguna
  pantalla de `/admin` (se me redirige a login).
- Como `site_owner`, veo un listado de los ítems del carrusel, puedo
  crear, editar, reordenar, desactivar y eliminar ítems.
- Como visitante del sitio público, veo reflejados de inmediato los cambios
  que se hicieron en el carrusel.
- Como `super_admin`, puedo ver y gestionar los perfiles y roles de
  cualquier usuario del sistema.
- Un usuario puede tener varios roles a la vez (ej. `site_owner` y
  `super_admin` simultáneamente) — los roles no son mutuamente excluyentes.

**Base de datos**
- `persona`, `perfil` (vincula `auth_user_id` ↔ `persona`, 1:1).
- `perfil_rol`: tabla aparte de `perfil_id` + `rol` (por ahora `super_admin`
  | `site_owner`) para soportar multi-rol — una persona puede tener varias
  filas. Sin `copropiedad_id` todavía (se agrega cuando exista el portal de
  clientes).
- `carrusel_item` **sin** `copropiedad_id` — es contenido global del sitio,
  con políticas RLS reales (lectura pública de ítems activos/vigentes,
  gestión para `site_owner`/`super_admin`).
- Trigger de auditoría en `perfil_rol` y `carrusel_item`.

**API / Backend**
- Sin Edge Functions todavía — el CRUD de carrusel se hace directo desde el
  cliente de Supabase respetando RLS (no hay lógica compleja que justifique
  una función).
- Política RLS: cualquiera (incluso sin sesión) lee ítems activos y
  vigentes del carrusel; solo `site_owner` o `super_admin` pueden
  crear/editar/eliminar ítems (sin distinción por tenant, no aplica todavía).

**Frontend**
- `app/admin/layout.tsx`: guarda la sesión, redirige si no hay usuario
  autenticado o si no tiene ningún rol con acceso.
- `app/admin/page.tsx`: dashboard mínimo (bienvenida + accesos).
- `app/admin/carrusel/page.tsx`: tabla + formulario de CRUD.
- Módulo `src/modules/auth/` (login, guard, hook de sesión) y
  `src/modules/carrusel/` (domain/application/infrastructure/presentation).

**Pruebas**
- Unitarias: reglas de validación del carrusel (fechas de vigencia,
  campos obligatorios).
- E2E (Playwright): login exitoso, login fallido, acceso denegado sin
  sesión, crear/editar/eliminar un ítem y verlo reflejado en la home
  pública.

**Criterios de aceptación**
- [x] No es posible ver ni escribir en `carrusel_item` sin el rol
      `site_owner` o `super_admin` (verificado con RLS: un perfil sin rol
      intentó insertar un ítem y Postgres lo rechazó).
- [x] Un usuario puede tener múltiples roles simultáneos y las políticas
      RLS los combinan correctamente (verificado con un perfil
      `site_owner` + `super_admin` a la vez).
- [x] No es posible ver ninguna pantalla de `/admin` sin sesión válida
      (verificado con Playwright: guard redirige a `/login`; un usuario
      autenticado pero sin rol admin también es rechazado).
- [x] Cambios en el carrusel desde `/admin` se reflejan en la home sin
      despliegue manual (verificado extremo a extremo con Playwright).
- [x] Todo cambio en `perfil_rol` o `carrusel_item` queda en `audit_log`
      (verificado: filas reales de insert/update/delete en la tabla tras
      las pruebas de CRUD).

**Fase 1: completa (2026-07-31).** Los 5 criterios de aceptación están
cumplidos y verificados. Pendiente real, fuera del alcance técnico de la
fase: cargar contenido real en el carrusel de producción (hoy vacío) y,
más adelante, decidir si se agregan las pruebas automatizadas formales
(Vitest/Playwright committeadas) que la sección "Pruebas" describe —
por ahora la verificación se hizo con scripts de Playwright ad-hoc, no
con una suite de tests versionada en el repo.

---

## Fase 2 — Copropiedades, personas, unidades, propietarios (esquema)

Prepara el modelo de datos completo que las Fases 3 y 4 necesitan. Sin UI
todavía más allá de lo mínimo para cargar datos de prueba reales.

- CRUD de copropiedades, unidades privadas, personas y la relación
  `propietario` (con `porcentaje_participacion`, vigencias).
- Validación de negocio: la suma de coeficientes de las unidades de una
  copropiedad debe ser 1.0 (100%) — regla que vive en `application/` del
  módulo `copropiedades`, verificada con pruebas unitarias.
- Carga masiva (import desde CSV/Excel) es una necesidad realista para este
  módulo — se define en detalle al iniciar esta fase, no antes.

---

## Fase 3 — Asambleas

- Crear asamblea, convocatoria, registro de asistentes, representaciones
  (poderes), cálculo de quórum en tiempo real (ver
  [04-api-y-tiempo-real.md](04-api-y-tiempo-real.md)).
- Aquí se resuelven las preguntas abiertas del modelo de datos (mayorías
  calificadas por tipo de decisión, aprobación de poderes) — ver
  "Pendiente de validar" en [02-modelo-datos.md](02-modelo-datos.md).

---

## Fase 4 — Votaciones

- Preguntas dinámicas (sí/no, selección única, opción múltiple), ingreso de
  asistentes vía `/votaciones` con OTP por email/SMS, emisión de voto con
  peso de coeficiente, resultados en tiempo real.
- Requiere las Edge Functions descritas en
  [04-api-y-tiempo-real.md](04-api-y-tiempo-real.md) — es la fase con más
  superficie de seguridad (un solo voto por asistente, tokens de alcance
  limitado) y la que más pruebas E2E de concurrencia necesita.

---

## Después de Fase 4 — módulos del ERP (sin detallar aún, a propósito)

Cartera, contabilidad, PQRS, correspondencia, reservas, actas, documentos,
pagos, facturación, integración DIAN, WhatsApp, app móvil, notificaciones.

Cada uno se diseña con este mismo ciclo (historias → modelo de datos → API →
backend → pruebas → frontend → pruebas → documentación → aprobación) cuando
le llegue el turno — documentarlos en detalle hoy sería diseñar sobre
supuestos que probablemente cambien con lo que se aprenda en las Fases 1-4.
