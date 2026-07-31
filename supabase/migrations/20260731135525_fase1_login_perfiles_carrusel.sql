-- Fase 1: login, perfiles (multi-rol) y gestión del carrusel del sitio.
-- Ver docs/architecture/02-modelo-datos.md y 03-autenticacion-autorizacion.md.
--
-- Nota de alcance: en esta fase el sitio es 100% de BORCA (la empresa),
-- no hay todavía portal de clientes/copropiedades. El carrusel es
-- contenido del sitio (global), no de un tenant. La tabla `copropiedad`
-- y cualquier RLS multi-tenant por copropiedad_id se posponen a la fase
-- que construya el portal de clientes (dueños/inquilinos).

-- =========================================================================
-- PERSONA
-- =========================================================================
create table persona (
  id uuid primary key default gen_random_uuid(),
  tipo_documento text not null,
  numero_documento text not null,
  nombre text not null,
  email text,
  telefono text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tipo_documento, numero_documento)
);

-- =========================================================================
-- PERFIL (usuario del sistema, 1:1 con auth.users)
-- =========================================================================
create table perfil (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null references auth.users (id) on delete cascade,
  persona_id uuid not null references persona (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (auth_user_id)
);

-- =========================================================================
-- PERFIL_ROL (multi-rol: un perfil puede tener varios roles a la vez)
-- =========================================================================
create table perfil_rol (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references perfil (id) on delete cascade,
  rol text not null check (rol in ('super_admin', 'site_owner')),
  created_at timestamptz not null default now(),
  unique (perfil_id, rol)
);

create index perfil_rol_perfil_id_idx on perfil_rol (perfil_id);

-- =========================================================================
-- CARRUSEL_ITEM (contenido del sitio de BORCA, global — no es de un cliente)
-- =========================================================================
create table carrusel_item (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  tipo text not null check (tipo in ('promocion', 'evento', 'anuncio')),
  orden int not null default 0,
  activo boolean not null default true,
  fecha_inicio date,
  fecha_fin date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- AUDIT_LOG (bitácora)
-- =========================================================================
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  tabla text not null,
  registro_id uuid not null,
  accion text not null check (accion in ('insert', 'update', 'delete')),
  usuario_id uuid,
  valores_antes jsonb,
  valores_despues jsonb,
  fecha_hora timestamptz not null default now()
);

create index audit_log_tabla_registro_idx on audit_log (tabla, registro_id);

-- =========================================================================
-- updated_at automático
-- =========================================================================
create function fn_set_updated_at() returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger persona_set_updated_at before update on persona
for each row execute function fn_set_updated_at();

create trigger perfil_set_updated_at before update on perfil
for each row execute function fn_set_updated_at();

create trigger carrusel_item_set_updated_at before update on carrusel_item
for each row execute function fn_set_updated_at();

-- =========================================================================
-- Trigger de auditoría genérico (perfil_rol y carrusel_item)
-- =========================================================================
create function fn_audit_log() returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into audit_log (tabla, registro_id, accion, usuario_id, valores_antes, valores_despues)
  values (
    tg_table_name,
    coalesce(new.id, old.id),
    lower(tg_op),
    auth.uid(),
    case when tg_op in ('update', 'delete') then to_jsonb(old) else null end,
    case when tg_op in ('insert', 'update') then to_jsonb(new) else null end
  );
  return coalesce(new, old);
end;
$$;

create trigger perfil_rol_audit
after insert or update or delete on perfil_rol
for each row execute function fn_audit_log();

create trigger carrusel_item_audit
after insert or update or delete on carrusel_item
for each row execute function fn_audit_log();

-- =========================================================================
-- Función auxiliar para RLS: ¿el usuario autenticado tiene este rol?
-- =========================================================================
create function fn_tiene_rol(rol_buscado text) returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from perfil_rol pr
    join perfil p on p.id = pr.perfil_id
    where p.auth_user_id = auth.uid() and pr.rol = rol_buscado
  );
$$;

-- =========================================================================
-- RLS: persona
-- =========================================================================
alter table persona enable row level security;

create policy "super_admin ve todas las personas"
on persona for select
using (fn_tiene_rol('super_admin'));

create policy "un usuario ve su propia persona"
on persona for select
using (
  id in (select persona_id from perfil where auth_user_id = auth.uid())
);

create policy "super_admin gestiona personas"
on persona for all
using (fn_tiene_rol('super_admin'))
with check (fn_tiene_rol('super_admin'));

-- =========================================================================
-- RLS: perfil
-- =========================================================================
alter table perfil enable row level security;

create policy "un usuario ve su propio perfil"
on perfil for select
using (auth_user_id = auth.uid());

create policy "super_admin ve todos los perfiles"
on perfil for select
using (fn_tiene_rol('super_admin'));

create policy "super_admin gestiona perfiles"
on perfil for all
using (fn_tiene_rol('super_admin'))
with check (fn_tiene_rol('super_admin'));

-- =========================================================================
-- RLS: perfil_rol
-- =========================================================================
alter table perfil_rol enable row level security;

create policy "un usuario ve sus propios roles"
on perfil_rol for select
using (
  perfil_id in (select id from perfil where auth_user_id = auth.uid())
);

create policy "super_admin gestiona roles"
on perfil_rol for all
using (fn_tiene_rol('super_admin'))
with check (fn_tiene_rol('super_admin'));

-- =========================================================================
-- RLS: carrusel_item (contenido del sitio, no de un cliente)
-- =========================================================================
alter table carrusel_item enable row level security;

-- Lectura pública (sitio de marketing, sin login) de ítems activos y vigentes
create policy "público ve ítems activos y vigentes"
on carrusel_item for select
to anon, authenticated
using (
  activo = true
  and (fecha_inicio is null or fecha_inicio <= current_date)
  and (fecha_fin is null or fecha_fin >= current_date)
);

create policy "site_owner gestiona el carrusel"
on carrusel_item for all
using (fn_tiene_rol('site_owner') or fn_tiene_rol('super_admin'))
with check (fn_tiene_rol('site_owner') or fn_tiene_rol('super_admin'));

-- =========================================================================
-- RLS: audit_log (solo super_admin lee; nadie escribe directo, solo triggers)
-- =========================================================================
alter table audit_log enable row level security;

create policy "super_admin lee la bitácora"
on audit_log for select
using (fn_tiene_rol('super_admin'));

-- =========================================================================
-- GRANTS: RLS solo filtra filas — sin el GRANT de base, Postgres deniega el
-- acceso a la tabla antes de siquiera evaluar las políticas.
-- =========================================================================
grant usage on schema public to anon, authenticated;

grant select on carrusel_item to anon;

grant select, insert, update, delete
  on persona, perfil, perfil_rol, carrusel_item
  to authenticated;

grant select on audit_log to authenticated;
