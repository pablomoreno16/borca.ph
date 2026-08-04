-- Fase 2.1: catálogo de categorías de documento.
-- Ver docs/architecture/02-modelo-datos.md y 07-roadmap-fases.md.
--
-- Catálogo global (no lleva copropiedad_id), editable por super_admin sin
-- necesitar un deploy. categoria_documento_rol define qué rol(es) pueden
-- ver cada categoría, pero su enforcement real (join contra
-- perfil_rol.copropiedad_id) se activa recién en Fase 2.2.1, cuando esa
-- columna y los roles admin_copropiedad/consejero/propietario existan —
-- se construye completa desde ya para no configurarla dos veces.

-- =========================================================================
-- CATEGORIA_DOCUMENTO
-- =========================================================================
create table categoria_documento (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index categoria_documento_nombre_unq on categoria_documento (lower(nombre));

-- =========================================================================
-- CATEGORIA_DOCUMENTO_ROL (tabla intermedia, many-to-many)
-- =========================================================================
create table categoria_documento_rol (
  id uuid primary key default gen_random_uuid(),
  categoria_documento_id uuid not null references categoria_documento (id) on delete cascade,
  rol text not null check (rol in ('admin_copropiedad', 'consejero', 'propietario')),
  unique (categoria_documento_id, rol)
);

create index categoria_documento_rol_categoria_id_idx
  on categoria_documento_rol (categoria_documento_id);

-- =========================================================================
-- updated_at automático
-- =========================================================================
create trigger categoria_documento_set_updated_at before update on categoria_documento
for each row execute function fn_set_updated_at();

-- =========================================================================
-- Auditoría
-- =========================================================================
create trigger categoria_documento_audit
after insert or update or delete on categoria_documento
for each row execute function fn_audit_log();

create trigger categoria_documento_rol_audit
after insert or update or delete on categoria_documento_rol
for each row execute function fn_audit_log();

-- =========================================================================
-- RLS: cualquier autenticado lee el catálogo (lo necesita para resolver
-- accesos a documentos más adelante); solo super_admin lo administra.
-- =========================================================================
alter table categoria_documento enable row level security;
alter table categoria_documento_rol enable row level security;

create policy "autenticados leen el catálogo de categorías"
on categoria_documento for select
to authenticated
using (true);

create policy "super_admin gestiona categorías"
on categoria_documento for all
using (fn_tiene_rol('super_admin'))
with check (fn_tiene_rol('super_admin'));

create policy "autenticados leen el mapeo de roles por categoría"
on categoria_documento_rol for select
to authenticated
using (true);

create policy "super_admin gestiona el mapeo de roles por categoría"
on categoria_documento_rol for all
using (fn_tiene_rol('super_admin'))
with check (fn_tiene_rol('super_admin'));

-- =========================================================================
-- GRANTS
-- =========================================================================
grant select, insert, update, delete
  on categoria_documento, categoria_documento_rol
  to authenticated;

-- =========================================================================
-- Categorías iniciales (Pablo puede editar/agregar más desde el admin)
-- =========================================================================
insert into categoria_documento (nombre) values
  ('Comunicado'),
  ('Acta de asamblea'),
  ('Acta de consejo'),
  ('General');
