-- Vista de solo lectura que aplana la unidad_privada con el nombre de su
-- propietario actual (el registro sin fecha_fin, o el de fecha_inicio más
-- reciente si no hay ninguno abierto). PostgREST no permite un .or() que
-- combine una columna propia con una columna de un embed relacionado, así
-- que el filtro combinado "# de apartamento o nombre del propietario" en
-- el listado paginado necesita esta columna ya aplanada.
--
-- security_invoker = true: la vista corre con los permisos/RLS de quien
-- consulta (no del dueño de la vista), igual que si consultara las tablas
-- directamente — sigue protegida por las políticas de unidad_privada,
-- propietario y persona.
create view unidad_privada_detalle
  with (security_invoker = true)
  as
  select
    up.id,
    up.copropiedad_id,
    up.bloque,
    up.identificador,
    up.tipo,
    up.coeficiente,
    prop.nombre_propietario
  from unidad_privada up
  left join lateral (
    select pe.nombre as nombre_propietario
    from propietario pr
    join persona pe on pe.id = pr.persona_id
    where pr.unidad_privada_id = up.id
    order by (pr.fecha_fin is null) desc, pr.fecha_inicio desc
    limit 1
  ) prop on true;

grant select on unidad_privada_detalle to authenticated;
