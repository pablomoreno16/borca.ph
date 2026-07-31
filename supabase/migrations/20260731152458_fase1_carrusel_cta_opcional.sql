-- El botón del carrusel pasa a ser opcional: si no se define texto/destino,
-- el ítem se muestra sin botón (en vez de forzar "Contáctanos" por defecto).
alter table carrusel_item
  alter column cta_label drop not null,
  alter column cta_label drop default,
  alter column cta_href drop not null,
  alter column cta_href drop default;
