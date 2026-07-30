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

**Historias de usuario**
- Como administrador, inicio sesión en `/admin` con email y contraseña.
- Como administrador, si no he iniciado sesión, no puedo ver ninguna
  pantalla de `/admin` (se me redirige a login).
- Como administrador, veo un listado de los ítems del carrusel, puedo
  crear, editar, reordenar, desactivar y eliminar ítems.
- Como visitante del sitio público, veo reflejados de inmediato los cambios
  que el administrador hizo en el carrusel.
- Como super-admin, puedo ver y gestionar administradores de cualquier
  copropiedad (aunque solo exista una copropiedad real por ahora, el modelo
  ya es multi-tenant desde esta fase).

**Base de datos**
- `copropiedad` (aunque solo haya una fila real por ahora — BORCA como
  primera copropiedad/cliente piloto, o una copropiedad de ejemplo, a
  definir con el negocio).
- `persona`, `perfil` (con `rol`: `super_admin` | `admin_copropiedad`).
- `carrusel_item` con `copropiedad_id` y políticas RLS reales.
- Trigger de auditoría en `perfil` y `carrusel_item`.

**API / Backend**
- Sin Edge Functions todavía — el CRUD de carrusel se hace directo desde el
  cliente de Supabase respetando RLS (no hay lógica compleja que justifique
  una función).
- Política RLS: un `admin_copropiedad` solo ve/edita el carrusel de su
  `copropiedad_id`; `super_admin` ve todo.

**Frontend**
- `app/admin/layout.tsx`: guarda la sesión, redirige si no hay usuario
  autenticado o si el rol no tiene acceso.
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
- [ ] No es posible ver ninguna pantalla de `/admin` sin sesión válida.
- [ ] Un `admin_copropiedad` no puede ver ni editar datos de otra
      copropiedad (verificado con una prueba que lo intenta explícitamente).
- [ ] Cambios en el carrusel desde `/admin` se reflejan en la home sin
      despliegue manual.
- [ ] Todo cambio en `perfil` o `carrusel_item` queda en `audit_log`.

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
