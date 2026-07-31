-- Fase 2: copropiedades, unidades privadas y propietarios.
-- Ver docs/architecture/02-modelo-datos.md.
--
-- Nota de alcance: solo super_admin gestiona estos datos por ahora (sin
-- rol admin_copropiedad ni aislamiento multi-tenant todavía — eso se
-- construye cuando exista el portal de clientes real).

-- =========================================================================
-- PERSONA: tipo_documento/numero_documento pasan a ser opcionales.
-- La carga masiva de propietarios desde Excel solo trae el nombre; el
-- documento de identidad se completa después, a mano, en el admin.
-- =========================================================================
alter table persona
  alter column tipo_documento drop not null,
  alter column numero_documento drop not null;

-- =========================================================================
-- COPROPIEDAD
-- =========================================================================
create table copropiedad (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  nit text,
  direccion text,
  ciudad text,
  telefono text,
  cuenta_bancaria text,
  correo text,
  estado text not null default 'activa' check (estado in ('activa', 'inactiva')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- UNIDAD_PRIVADA
-- =========================================================================
create table unidad_privada (
  id uuid primary key default gen_random_uuid(),
  copropiedad_id uuid not null references copropiedad (id),
  bloque text not null default '1',
  identificador text not null,
  tipo text not null default 'apartamento'
    check (tipo in ('apartamento', 'parqueadero', 'deposito', 'local', 'oficina')),
  coeficiente numeric not null check (coeficiente >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index unidad_privada_copropiedad_id_idx on unidad_privada (copropiedad_id);

-- =========================================================================
-- PROPIETARIO (Persona ↔ UnidadPrivada)
-- =========================================================================
create table propietario (
  id uuid primary key default gen_random_uuid(),
  persona_id uuid not null references persona (id),
  unidad_privada_id uuid not null references unidad_privada (id),
  porcentaje_participacion numeric,
  fecha_inicio date not null default current_date,
  fecha_fin date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (persona_id, unidad_privada_id, fecha_inicio)
);

create index propietario_persona_id_idx on propietario (persona_id);
create index propietario_unidad_privada_id_idx on propietario (unidad_privada_id);

-- =========================================================================
-- updated_at automático
-- =========================================================================
create trigger copropiedad_set_updated_at before update on copropiedad
for each row execute function fn_set_updated_at();

create trigger unidad_privada_set_updated_at before update on unidad_privada
for each row execute function fn_set_updated_at();

create trigger propietario_set_updated_at before update on propietario
for each row execute function fn_set_updated_at();

-- =========================================================================
-- Auditoría
-- =========================================================================
create trigger copropiedad_audit
after insert or update or delete on copropiedad
for each row execute function fn_audit_log();

create trigger unidad_privada_audit
after insert or update or delete on unidad_privada
for each row execute function fn_audit_log();

create trigger propietario_audit
after insert or update or delete on propietario
for each row execute function fn_audit_log();

create trigger persona_audit
after insert or update or delete on persona
for each row execute function fn_audit_log();

-- =========================================================================
-- RLS: solo super_admin — sin lectura pública, son datos personales y
-- financieros reales (nombres de propietarios, NIT, cuenta bancaria).
-- =========================================================================
alter table copropiedad enable row level security;
alter table unidad_privada enable row level security;
alter table propietario enable row level security;

create policy "super_admin gestiona copropiedades"
on copropiedad for all
using (fn_tiene_rol('super_admin'))
with check (fn_tiene_rol('super_admin'));

create policy "super_admin gestiona unidades privadas"
on unidad_privada for all
using (fn_tiene_rol('super_admin'))
with check (fn_tiene_rol('super_admin'));

create policy "super_admin gestiona propietarios"
on propietario for all
using (fn_tiene_rol('super_admin'))
with check (fn_tiene_rol('super_admin'));

-- =========================================================================
-- GRANTS
-- =========================================================================
grant select, insert, update, delete
  on copropiedad, unidad_privada, propietario
  to authenticated;
