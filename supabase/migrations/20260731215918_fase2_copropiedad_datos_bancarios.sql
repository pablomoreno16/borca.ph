-- Separa la información bancaria de la copropiedad en 3 campos:
-- banco, tipo de cuenta (ahorros/corriente) y número de cuenta.
alter table copropiedad rename column cuenta_bancaria to numero_cuenta;

alter table copropiedad
  add column banco text,
  add column tipo_cuenta text check (tipo_cuenta in ('ahorros', 'corriente'));
