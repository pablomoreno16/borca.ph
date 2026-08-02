-- Agrega "cuarto útil" a los tipos de unidad privada válidos.
alter table unidad_privada drop constraint unidad_privada_tipo_check;

alter table unidad_privada
  add constraint unidad_privada_tipo_check
  check (tipo in ('apartamento', 'cuarto_util', 'deposito', 'local', 'oficina', 'parqueadero'));
