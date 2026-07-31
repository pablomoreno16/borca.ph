-- Tipo de copropiedad (residencial, comercial, mixta).
alter table copropiedad
  add column tipo text not null default 'residencial'
    check (tipo in ('residencial', 'comercial', 'mixta'));
