# Arquitectura BORCA — visión general

Este directorio documenta la arquitectura de la plataforma BORCA: el sitio
corporativo actual (`www.borca.ph`) más los módulos futuros de administración
(`/admin`) y asambleas/votaciones (`/votaciones`), con visión de convertirse en
un ERP completo de Propiedad Horizontal.

**Regla de oro del proyecto:** nada se implementa antes de que la arquitectura
de un módulo esté aprobada. Estos documentos son el contrato que se sigue.

## Cómo navegar esto

| Documento | Contenido |
|---|---|
| [01-stack-y-decisiones.md](01-stack-y-decisiones.md) | Stack tecnológico completo y justificación de cada decisión |
| [02-modelo-datos.md](02-modelo-datos.md) | Modelo de dominio, ERD, relaciones, Ley 675 |
| [03-autenticacion-autorizacion.md](03-autenticacion-autorizacion.md) | Los dos flujos de auth, roles, permisos, auditoría |
| [04-api-y-tiempo-real.md](04-api-y-tiempo-real.md) | Diseño de API, quórum/votos en vivo, seguridad |
| [05-estructura-carpetas.md](05-estructura-carpetas.md) | Organización del repositorio (monolito modular) |
| [06-entornos-despliegue-cicd.md](06-entornos-despliegue-cicd.md) | GoDaddy/cPanel, ambientes, CI/CD |
| [07-roadmap-fases.md](07-roadmap-fases.md) | Fases de implementación, historias de usuario, criterios de aceptación |
| [adr/](adr/) | Registro de decisiones de arquitectura (ADRs), una por decisión relevante |

## Principios que rigen todas las decisiones

1. **Modularidad desde el día uno.** El sistema crecerá a un ERP con ~10 módulos
   futuros (cartera, contabilidad, PQRS, actas, reservas, facturación, DIAN,
   WhatsApp, app móvil, notificaciones). Cada módulo nuevo debe poder añadirse
   sin tocar los anteriores.
2. **Monolito modular, no microservicios.** Con el equipo y presupuesto
   actuales, microservicios serían sobre-ingeniería. Se diseña por límites de
   dominio claros (Clean Architecture por módulo) para poder extraer un
   servicio independiente el día que un módulo específico lo necesite —
   pero esa extracción es una decisión futura, no de hoy.
3. **La autorización real vive en la base de datos (RLS), no en la UI.**
   Ocultar un botón o una ruta en el frontend nunca es la barrera de
   seguridad; Postgres con Row Level Security es quien decide qué puede leer
   o escribir cada usuario, sin importar qué hosting sirva las páginas.
4. **Costo alineado al presupuesto real.** Sin ambientes cloud de prueba, sin
   servidores propios que mantener. Se prioriza open source, pago por
   consumo, y servicios administrados (Supabase) que absorban la
   complejidad operativa.
5. **Nunca soluciones temporales.** Si algo se implementa como atajo, se
   documenta explícitamente como deuda técnica con su plan de resolución —
   no se deja implícito.
6. **Todo se documenta y versiona junto al código.** ERD, decisiones,
   contratos de API y diagramas viven en este repo, no en la cabeza de nadie.

## Contexto de negocio (resumen)

- El sitio actual (`www.borca.ph`) **no se reemplaza**; los módulos nuevos se
  integran en el mismo dominio (`/admin`, `/votaciones`), compartiendo
  identidad gráfica, autenticación y componentes.
- Alojamiento actual: **GoDaddy con cPanel**, código en **GitHub**. Sin
  presupuesto para ambientes cloud de prueba — solo desarrollo local y
  despliegue directo a producción. Esta restricción es la que más influye en
  las decisiones técnicas (ver [06](06-entornos-despliegue-cicd.md)).
- Visión de producto: hoy Administración + Asambleas + Votaciones; mañana un
  ERP completo, multi-copropiedad, pensado para miles de copropiedades y
  cientos de asistentes conectados simultáneamente durante una asamblea.
