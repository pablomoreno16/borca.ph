# Autenticación, autorización y auditoría

## Dos flujos de autenticación distintos — no uno solo

El sistema tiene dos poblaciones de usuarios con necesidades muy diferentes.
Tratarlas como el mismo mecanismo de auth sería un error de diseño.

### 1. Usuarios del panel (`/admin`)

Personal administrativo, administradores de copropiedad, y a futuro
propietarios que consultan su información. Son cuentas persistentes.

- **Mecanismo:** Supabase Auth, email + contraseña para empezar (magic link u
  OAuth quedan como extensión futura, no bloquean el arranque).
- **Sesión:** JWT emitido por Supabase Auth + refresh token, manejados por el
  SDK de Supabase en el navegador (persistidos de forma segura, renovación
  automática).
- **Vínculo con el dominio:** cada usuario autenticado tiene una fila en
  `perfil` que lo conecta con una `Persona` y un `rol`, y opcionalmente con
  una `copropiedad_id` (ver modelo en
  [02-modelo-datos.md](02-modelo-datos.md)).

### 2. Votantes en una asamblea (`/votaciones`)

Personas que solo necesitan probar "soy quien digo ser, para esta asamblea
puntual" — no son cuentas del sistema.

- **Mecanismo:** verificación de un solo uso por email o SMS (OTP — código de
  un solo uso). Al validarse, se emite un **token firmado de alcance
  limitado**: contiene `asamblea_id` + `asistente_id`, con expiración igual
  al cierre programado de la asamblea.
- **Este token NO es una sesión de Supabase Auth completa** — es un JWT propio,
  firmado por una Edge Function, que las políticas RLS de las tablas de
  votación saben validar (claim `asistente_id` dentro del token).
- Justificación: pedirle a cada propietario que "cree una cuenta" para votar
  una vez cada seis meses es fricción innecesaria y un problema de soporte
  (contraseñas olvidadas) que no aporta nada a la seguridad real del voto —
  el control importante es que el token esté ligado a una asamblea y un
  asistente específicos, no que exista una cuenta permanente.

**Ambos flujos conviven en la misma base de datos y las mismas políticas RLS**,
solo difieren en cómo se obtiene el JWT que las políticas leen.

## Roles y permisos

Un perfil puede tener **varios roles a la vez** — los roles viven en una
tabla aparte (`perfil_rol`: `perfil_id` + `rol`), no en una columna única de
`perfil`. Un mismo usuario puede ser, por ejemplo, `site_owner` y
`super_admin` simultáneamente; las políticas RLS de cada tabla combinan los
roles con OR (si cualquiera de sus roles le da acceso, lo tiene).

| Rol | Alcance | Puede | Estado |
|---|---|---|---|
| `super_admin` | Global | Todo — soporte, configuración de la plataforma, gestión de perfiles y roles | Implementado (Fase 1) |
| `site_owner` | Global (no hay tenants todavía) | Gestionar el contenido del sitio de BORCA (carrusel de novedades) | Implementado (Fase 1) |
| `admin_copropiedad` | Una o varias copropiedades (`copropiedad_id` en `perfil_rol`) | Gestionar unidades, propietarios, asambleas, votaciones de su(s) copropiedad(es) | Futuro — requiere el portal de clientes (ver roadmap, Fase 2+) |
| `propietario` | Su(s) propia(s) unidad(es) | Consultar su información, ver histórico de asambleas/votos propios (a futuro: PQRS, cartera) | Futuro |
| `asistente_asamblea` | Una asamblea puntual (no es un rol persistente, es el alcance del token descrito arriba) | Registrarse, ver quórum en vivo, votar | Futuro |

`admin_copropiedad` y `propietario` no existen todavía porque no hay portal
de clientes: el sitio actual es 100% de BORCA como empresa, no de un tenant.
Cuando se construya ese portal, `perfil_rol` gana una columna
`copropiedad_id` (nullable — nula para roles globales como `super_admin`/
`site_owner`, poblada para roles scoped como `admin_copropiedad`).

Este listado crece según se agreguen módulos (ej. `contador`, `personal_pqrs`)
sin cambiar el mecanismo — solo se agregan filas de rol y sus políticas RLS
correspondientes.

## Autorización: Row Level Security, no `if` en el código

**Hoy (Fase 1, sin tenants):** las políticas usan una función auxiliar
`fn_tiene_rol(rol)` que revisa `perfil_rol` para el usuario autenticado.
Así se implementó el carrusel del sitio:

```sql
create function fn_tiene_rol(rol_buscado text) returns boolean
language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from perfil_rol pr
    join perfil p on p.id = pr.perfil_id
    where p.auth_user_id = auth.uid() and pr.rol = rol_buscado
  );
$$;

alter table carrusel_item enable row level security;

create policy "público ve ítems activos y vigentes"
on carrusel_item for select
to anon, authenticated
using (activo = true and (fecha_fin is null or fecha_fin >= current_date));

create policy "site_owner gestiona el carrusel"
on carrusel_item for all
using (fn_tiene_rol('site_owner') or fn_tiene_rol('super_admin'))
with check (fn_tiene_rol('site_owner') or fn_tiene_rol('super_admin'));
```

**A futuro (cuando exista el portal de clientes):** cada tabla tenant-scoped
tendrá políticas RLS que filtran por `copropiedad_id` comparado contra la(s)
copropiedad(es) del perfil autenticado (vía `perfil_rol.copropiedad_id`, una
vez esa columna exista). Ejemplo conceptual (sintaxis simplificada):

```sql
alter table unidad_privada enable row level security;

create policy "admins ven su copropiedad"
on unidad_privada for select
using (
  copropiedad_id in (
    select copropiedad_id from perfil_rol pr
    join perfil p on p.id = pr.perfil_id
    where p.auth_user_id = auth.uid() and pr.rol = 'admin_copropiedad'
  )
  or fn_tiene_rol('super_admin')
);
```

Para la tabla `voto`, la política de inserción valida el claim del JWT de
asistente en vez de `auth.uid()`:

```sql
create policy "un asistente vota solo en su asamblea"
on voto for insert
with check (
  asistente_id = (auth.jwt() ->> 'asistente_id')::uuid
  and exists (
    select 1 from asistente a
    join asamblea am on am.id = a.asamblea_id
    where a.id = asistente_id and am.estado = 'en_curso'
  )
);
```

**Por qué esto y no una API que valide "a mano":** aunque exista una capa de
Edge Functions para lógica compleja, la garantía de fondo (nadie lee o
escribe datos que no le corresponden) no depende de que cada función nueva
recuerde repetir la validación — está en la base de datos, se aplica siempre,
sin excepción, incluso si mañana se agrega un módulo nuevo que se conecta
directo a Supabase.

## Auditoría

Toda tabla sensible (`asamblea`, `votacion`, `voto`, `propietario`,
`representacion`, `perfil_rol`, `carrusel_item`) tiene un **trigger de
Postgres** que escribe en
`audit_log` en cada `INSERT`/`UPDATE`/`DELETE`, con el usuario autenticado
(`auth.uid()`), la tabla, el registro, y los valores antes/después en JSON.
Esto vive en la base de datos (no en el código de la aplicación) por la misma
razón que la autorización: ningún camino de escritura, presente o futuro,
puede saltarse la auditoría.

## Logging y monitoreo de la aplicación

- **Logs de aplicación:** las Edge Functions escriben logs estructurados
  (nivel, mensaje, contexto) que Supabase captura automáticamente y expone en
  su dashboard — no se necesita infraestructura de logging aparte dado el
  volumen esperado y el presupuesto disponible.
- **Monitoreo:** Supabase expone métricas de uso de base de datos, Auth y
  Edge Functions en su dashboard (incluidas en el plan gratuito/bajo). Si el
  proyecto crece lo suficiente como para necesitar alertas más finas
  (ej. picos de errores durante una asamblea en vivo), se evalúa en ese
  momento una herramienta puntual (ej. Sentry, que tiene tier gratuito) —
  no se contrata nada de monitoreo pago mientras el volumen no lo justifique.

## Seguridad transversal

| Riesgo | Mitigación |
|---|---|
| XSS | React escapa por defecto todo el contenido renderizado; nunca se usa `dangerouslySetInnerHTML` con contenido de usuario sin sanitizar |
| SQL Injection | No se escribe SQL concatenado a mano; Drizzle (en Edge Functions) y el cliente de Supabase (en el navegador) parametrizan todas las consultas |
| Fuerza bruta en login/OTP | Supabase Auth ya limita intentos de login; el OTP de asistentes tiene expiración corta (minutos) y límite de reintentos por Edge Function |
| Rate limiting de la API | Se implementa a nivel de Edge Function (límite por IP/token) para los endpoints públicos de `/votaciones`, que son el punto de mayor concurrencia esperada |
| Fuga de secretos | Las claves con privilegio elevado (`service_role` de Supabase) **nunca** se exponen al navegador — solo existen dentro de Edge Functions, configuradas como variables de entorno de Supabase |
