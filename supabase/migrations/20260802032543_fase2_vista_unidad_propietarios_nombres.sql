-- Reemplaza nombre_propietario (solo el "actual") y propietarios_count por
-- una sola columna con los nombres de todos los propietarios activos de la
-- unidad, unidos con " | " — se usa tanto para mostrarlos en la tabla como
-- para el filtro por nombre (ya no hace falta un embed aparte).
drop view unidad_privada_detalle;

create view unidad_privada_detalle
  with (security_invoker = true)
  as
  select
    up.id,
    up.copropiedad_id,
    up.bloque,
    up.identificador,
    nullif(regexp_replace(up.identificador, '\D', '', 'g'), '')::bigint as identificador_numero,
    up.tipo,
    up.coeficiente,
    propietarios.nombres as propietarios_nombres
  from unidad_privada up
  left join lateral (
    select string_agg(pe.nombre, ' | ' order by pr.fecha_inicio) as nombres
    from propietario pr
    join persona pe on pe.id = pr.persona_id
    where pr.unidad_privada_id = up.id and pr.fecha_fin is null
  ) propietarios on true;

grant select on unidad_privada_detalle to authenticated;
