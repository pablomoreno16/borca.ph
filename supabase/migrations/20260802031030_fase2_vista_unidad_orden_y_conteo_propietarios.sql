-- Agrega a unidad_privada_detalle:
-- - identificador_numero: el # extraído como número, para poder ordenar
--   "201" antes que "1001" en vez de alfanuméricamente (donde "1001" < "201").
--   NULL si el identificador no tiene ningún dígito (ej. unidades con
--   nombres no numéricos), esas quedan al final del orden.
-- - propietarios_count: cantidad de propietarios activos (sin fecha_fin)
--   de la unidad.
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
    prop.nombre_propietario,
    coalesce(conteo.total, 0) as propietarios_count
  from unidad_privada up
  left join lateral (
    select pe.nombre as nombre_propietario
    from propietario pr
    join persona pe on pe.id = pr.persona_id
    where pr.unidad_privada_id = up.id
    order by (pr.fecha_fin is null) desc, pr.fecha_inicio desc
    limit 1
  ) prop on true
  left join lateral (
    select count(*) as total
    from propietario pr
    where pr.unidad_privada_id = up.id and pr.fecha_fin is null
  ) conteo on true;

grant select on unidad_privada_detalle to authenticated;
