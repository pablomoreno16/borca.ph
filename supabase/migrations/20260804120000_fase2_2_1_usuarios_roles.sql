-- Fase 2.2.1: administración de usuarios y roles del portal de clientes.
-- Ver docs/architecture/02-modelo-datos.md, 03-autenticacion-autorizacion.md
-- y 07-roadmap-fases.md.
--
-- Hace reales los roles admin_copropiedad/consejero/propietario (hasta
-- ahora solo documentados como "futuro") y activa de verdad el mapeo
-- categoria_documento_rol que Fase 2.1 dejó preparado sin efecto.

-- =========================================================================
-- PERFIL_ROL: copropiedad_id + roles nuevos
-- =========================================================================
alter table perfil_rol add column copropiedad_id uuid references copropiedad (id);

alter table perfil_rol drop constraint perfil_rol_rol_check;
alter table perfil_rol add constraint perfil_rol_rol_check
  check (rol in ('super_admin', 'site_owner', 'admin_copropiedad', 'consejero', 'propietario'));

-- Reemplaza unique(perfil_id, rol): un propietario puede tener el mismo
-- rol en más de una copropiedad (ej. dueño de unidades en dos edificios).
alter table perfil_rol drop constraint perfil_rol_perfil_id_rol_key;
alter table perfil_rol add constraint perfil_rol_perfil_id_rol_copropiedad_id_key
  unique (perfil_id, rol, copropiedad_id);

-- Los roles globales nunca llevan copropiedad; los scoped siempre la llevan.
alter table perfil_rol add constraint perfil_rol_scope_check check (
  (rol in ('super_admin', 'site_owner') and copropiedad_id is null)
  or (rol in ('admin_copropiedad', 'consejero', 'propietario') and copropiedad_id is not null)
);

create index perfil_rol_copropiedad_id_idx on perfil_rol (copropiedad_id);

-- =========================================================================
-- Función auxiliar para RLS: ¿el usuario autenticado tiene este rol en
-- esta copropiedad? (mismo patrón que fn_tiene_rol, pero scoped)
-- =========================================================================
create function fn_tiene_rol_en_copropiedad(rol_buscado text, cop_id uuid) returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from perfil_rol pr
    join perfil p on p.id = pr.perfil_id
    where p.auth_user_id = auth.uid() and pr.rol = rol_buscado and pr.copropiedad_id = cop_id
  );
$$;

-- =========================================================================
-- Activa el mapeo categoria_documento_rol de Fase 2.1: política de
-- lectura adicional para roles scoped (no reemplaza la de super_admin
-- de la migración anterior — RLS combina políticas del mismo comando
-- con OR).
-- =========================================================================
create policy "roles con permiso ven los documentos de su categoría"
on documento for select
using (
  exists (
    select 1
    from perfil_rol pr
    join perfil p on p.id = pr.perfil_id
    join categoria_documento_rol cdr on cdr.rol = pr.rol
    where p.auth_user_id = auth.uid()
      and pr.copropiedad_id = documento.copropiedad_id
      and cdr.categoria_documento_id = documento.categoria_documento_id
  )
);
