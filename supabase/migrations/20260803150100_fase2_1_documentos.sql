-- Fase 2.1: documentos por copropiedad (tabla + bucket de Storage + RLS).
-- Ver docs/architecture/02-modelo-datos.md y 07-roadmap-fases.md.
--
-- Nota de alcance (igual que unidad_privada/propietario en Fase 2): solo
-- super_admin gestiona esto por ahora. La política de lectura por
-- categoría/rol (usando categoria_documento_rol + perfil_rol.copropiedad_id)
-- se agrega en Fase 2.2.1, cuando esa columna y los roles existan.

-- =========================================================================
-- DOCUMENTO
-- =========================================================================
create table documento (
  id uuid primary key default gen_random_uuid(),
  copropiedad_id uuid not null references copropiedad (id),
  categoria_documento_id uuid not null references categoria_documento (id),
  titulo text not null,
  fecha_elaboracion date not null,
  archivo_path text not null,
  subido_por uuid references perfil (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index documento_copropiedad_categoria_idx
  on documento (copropiedad_id, categoria_documento_id);

-- =========================================================================
-- updated_at automático + auditoría
-- =========================================================================
create trigger documento_set_updated_at before update on documento
for each row execute function fn_set_updated_at();

create trigger documento_audit
after insert or update or delete on documento
for each row execute function fn_audit_log();

-- =========================================================================
-- RLS
-- =========================================================================
alter table documento enable row level security;

create policy "super_admin gestiona documentos"
on documento for all
using (fn_tiene_rol('super_admin'))
with check (fn_tiene_rol('super_admin'));

grant select, insert, update, delete on documento to authenticated;

-- =========================================================================
-- Storage: bucket privado para los archivos de documentos.
-- Path convencional: {copropiedad_id}/{categoria_documento_id}/{uuid}-{nombre}.
-- Acceso vía URLs firmadas de corta duración generadas por el cliente
-- (createSignedUrl), nunca públicas — la autorización real la hace esta
-- misma política RLS, igual que el resto de la base de datos.
-- =========================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documentos-copropiedad',
  'documentos-copropiedad',
  false,
  20971520, -- 20 MB
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg'
  ]
);

create policy "super_admin gestiona archivos de documentos"
on storage.objects for all
using (bucket_id = 'documentos-copropiedad' and fn_tiene_rol('super_admin'))
with check (bucket_id = 'documentos-copropiedad' and fn_tiene_rol('super_admin'));
