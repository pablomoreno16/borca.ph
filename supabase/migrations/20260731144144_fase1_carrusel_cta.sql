-- El carrusel necesita un CTA (texto + destino) configurable por ítem —
-- cada promoción/evento puede dirigir a una página distinta.
alter table carrusel_item
  add column cta_label text not null default 'Contáctanos',
  add column cta_href text not null default '/contacto';
