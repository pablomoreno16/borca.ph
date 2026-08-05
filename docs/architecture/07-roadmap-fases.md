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

**Fase 2: completa (2026-08-03).** Sin pendientes conocidos del alcance
técnico descrito arriba (ver `pendientes_proyecto.md` en memoria para el
detalle de lo construido). "Eliminar copropiedades" se resolvió como
borrado lógico (`estado` activa/inactiva) por decisión explícita del
usuario, sin borrado físico.

---

## Fase 2.1 — Gestión de documentos por copropiedad

Antes de que exista un portal de clientes (Fase 2.2) hace falta algo que
mostrarles: cada copropiedad necesita un repositorio de documentos
categorizado, con acceso controlado por tipo de documento — comunicados y
actas no son todos igual de sensibles ni le interesan a todo el mundo por
igual.

**Historias de usuario**
- Como `super_admin`, creo y edito el catálogo de categorías de documentos
  y defino qué roles pueden ver cada categoría.
- Como `admin_copropiedad`, subo, edito y elimino documentos de mi
  copropiedad, categorizados, con su fecha de elaboración.
- Como `propietario`/`consejero`, veo solo los documentos de las
  categorías que mi rol tiene permitido, de mi(s) copropiedad(es).

**Base de datos**
- `categoria_documento`: catálogo **global** (compartido entre todas las
  copropiedades, no por tenant) — `nombre`, `activo`. Categorías iniciales:
  `comunicado`, `acta_asamblea`, `acta_consejo`, `general` (reglamentos,
  manuales, informes de gestión).
- `categoria_documento_rol` (tabla intermedia, many-to-many):
  `categoria_documento_id`, `rol` — qué rol(es) pueden ver cada categoría.
  `super_admin` ve todo siempre, sin necesitar fila aquí.
- `documento`: `copropiedad_id`, `categoria_documento_id`, `titulo`,
  `fecha_elaboracion`, `archivo_path` (ruta en Supabase Storage),
  `subido_por` (perfil).
- Sin versionado: reemplazar un documento sobrescribe `archivo_path` y
  `fecha_elaboracion` en la misma fila (decisión explícita — no hay caso
  de uso real hoy que justifique conservar versiones anteriores).

**Almacenamiento:** Supabase Storage (bucket privado) — ya estaba previsto
en [01-stack-y-decisiones.md](01-stack-y-decisiones.md) y evita sumar un
proveedor nuevo. Acceso vía URLs firmadas de corta duración, nunca
públicas; la autorización real la sigue haciendo RLS sobre `documento`,
igual que el resto de la base de datos.

**API / RLS**
- Política de lectura en `documento`: el perfil tiene una fila en
  `perfil_rol` para esa `copropiedad_id`, y ese rol aparece en
  `categoria_documento_rol` para la categoría del documento (o es
  `super_admin`).

**Pruebas**
- Unitarias: validación de documento (categoría y fecha de elaboración
  obligatorias).
- E2E: un propietario sin el rol correcto no ve una categoría restringida;
  un consejero sí ve `acta_consejo` si está marcada para su rol; subir/
  editar/eliminar un documento respeta las categorías del catálogo.

**Criterios de aceptación**
- [ ] `super_admin` puede crear/editar categorías y su mapeo de roles sin
      necesitar un deploy.
- [ ] Un documento solo es visible para los roles permitidos de su
      categoría, verificado con RLS (no solo escondido en el frontend).
- [ ] El catálogo de categorías es el mismo para todas las copropiedades.

---

## Fase 2.2 — Portal de clientes: acceso de propietarios

Construye lo que [02-modelo-datos.md](02-modelo-datos.md) y
[03-autenticacion-autorizacion.md](03-autenticacion-autorizacion.md) dejaron
anotado como "futuro — requiere el portal de clientes": los roles
`admin_copropiedad` y `propietario` dejan de ser teóricos. Se divide en dos
subfases porque son dos preguntas distintas: quién gestiona los accesos
(2.2.1) y cómo entra un propietario por su cuenta (2.2.2).

### Fase 2.2.1 — Administración de usuarios y roles

**Historias de usuario**
- Como `super_admin`, veo y edito el rol de cualquier usuario del sistema
  desde un listado global en `/admin/usuarios`.
- Como usuario que entra al detalle de una copropiedad (pestaña
  "Usuarios"), veo de un vistazo a todos sus propietarios — tengan o no
  cuenta todavía — con documento, unidad, % de participación y estado de
  su perfil (sin cuenta / con cuenta sin rol / roles asignados). Es una
  vista de solo lectura: para editar el rol de alguien voy a
  `/admin/usuarios` (decisión tomada al construirlo — mantener la edición
  centralizada en un solo lugar en vez de duplicarla en dos pantallas).
- Un propietario que además es consejero mantiene ambos roles
  simultáneamente — ganar `consejero` nunca le quita el acceso de
  `propietario`.

**Base de datos**
- `perfil_rol` gana columna `copropiedad_id` (nullable — nula para roles
  globales `super_admin`/`site_owner`, poblada para roles scoped).
- Roles nuevos, todos scoped a una copropiedad: `admin_copropiedad`,
  `consejero`, `propietario`.
- Asignación automática: cuando un propietario se autoregistra (Fase
  2.2.2) y su `persona` tiene relación `propietario` activa en una o más
  unidades, se le crea automáticamente una fila `perfil_rol` con
  `rol='propietario'` por cada `copropiedad_id` donde tenga unidad — sin
  intervención manual. Roles adicionales (`consejero`, `admin_copropiedad`)
  se asignan manualmente desde esta pantalla.

**Pruebas**
- Unitarias: combinaciones de rol válidas (un perfil puede tener varias
  filas de rol para la misma copropiedad).
- E2E: asignar/quitar un rol y verificar que el acceso a documentos
  cambia en consecuencia de inmediato.

**Criterios de aceptación**
- [x] Un usuario puede tener múltiples roles scoped a la misma
      copropiedad a la vez (propietario + consejero).
- [x] La edición de roles funciona desde el listado global
      (`/admin/usuarios`). La pestaña "Usuarios" del detalle de
      copropiedad muestra a todos los propietarios (con o sin cuenta) en
      modo solo lectura, con un enlace al listado global para editar —
      no duplica el editor de roles en dos pantallas.

**Fase 2.2.1: completa.** Verificado con una cuenta de prueba real: RLS de
`documento` concede/revoca acceso de inmediato al asignar/quitar el rol
`propietario`, y la tabla de usuarios de una copropiedad muestra
correctamente el estado de cuenta de cada propietario.

### Fase 2.2.2 — Login e ingreso de propietarios

**Historias de usuario**
- Como propietario, entro a `/login` con mi tipo y número de documento,
  recibo un código de un solo uso a mi correo ya registrado, y accedo a
  mi portal.
- Como propietario, veo mi información personal, mis unidades y % de
  participación, y los documentos que me corresponden según mi rol.
- Como propietario con unidades en más de una copropiedad, puedo cambiar
  entre ellas desde un selector.

**Mecanismo de login — cuenta persistente, no un token de un solo uso**

A diferencia del asistente de asamblea (Fase 4, que es un JWT de alcance
limitado sin cuenta), el propietario vuelve a consultar información
repetidamente — necesita una sesión real de Supabase Auth.

- **Canal: solo email** (passwordless, reutilizando el mismo mecanismo de
  Supabase Auth que ya usa `/admin`) — gratis, sin proveedor externo ni
  costo por mensaje. SMS/WhatsApp quedan fuera de esta fase.
- **Autoregistro verificado:** el propietario ingresa tipo + número de
  documento; el sistema busca una `persona` con relación `propietario`
  activa que coincida y envía el código **al correo ya guardado en esa
  persona** — nunca a uno que el usuario escriba libremente, para que
  nadie pueda autoregistrarse suplantando a otro propietario. Si la
  persona no tiene correo registrado, no puede autoregistrarse por este
  medio (hay que agregárselo manualmente desde el admin primero).
- Al verificar el código, se crea `perfil` + el/los rol(es) `propietario`
  automáticos descritos en 2.2.1.

**Frontend**
- Reutiliza `/login` (ya se dejó preparado para esto — ver nota en
  `pendientes_proyecto.md`: "login vive en `app/(sitio)/login/`... se
  pensó para que a futuro copropietarios/residentes también entren por
  ahí, redirigiendo según rol").
- Portal del propietario (alcance de esta fase, sin asambleas/votaciones
  todavía — eso es Fase 3/4): "Mi información" (datos personales,
  unidades, % de participación) + "Documentos" (filtrados por las
  categorías permitidas para su rol).

**Pruebas**
- E2E: autoregistro + login + ver solo los documentos correctos según
  rol; persona sin correo registrado recibe un mensaje claro (no un error
  genérico); documento/persona inexistente no revela si existe o no.

**Criterios de aceptación**
- [ ] Un propietario solo puede autoregistrarse si su documento coincide
      con una persona con relación `propietario` activa y correo
      registrado.
- [ ] El OTP siempre se envía al correo guardado en la base de datos, no
      a uno ingresado libremente en el formulario.
- [ ] Un propietario con unidades en varias copropiedades puede cambiar
      entre ellas sin cerrar sesión.

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
