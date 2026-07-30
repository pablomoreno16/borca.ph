# modules/

Cada módulo con lógica de negocio real vive aquí, con sus 4 capas de Clean
Architecture (`domain/`, `application/`, `infrastructure/`, `presentation/`).
Ver [docs/architecture/05-estructura-carpetas.md](../../docs/architecture/05-estructura-carpetas.md).

Todavía vacío: el primer módulo (`auth`) se agrega en la Fase 1
(ver [docs/architecture/07-roadmap-fases.md](../../docs/architecture/07-roadmap-fases.md)).
Las páginas de marketing (home, servicios, etc.) no necesitan un módulo —
son contenido de presentación sin reglas de negocio.
