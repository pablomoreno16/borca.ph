# Stack tecnológico y justificación

## Resumen ejecutivo

| Capa | Tecnología | Por qué |
|---|---|---|
| Framework web | **Next.js (App Router), exportado como sitio estático** | Un solo codebase para marketing + admin + votaciones; el export estático corre en cualquier hosting, incluido GoDaddy/cPanel |
| Backend / datos | **Supabase** (Postgres + Auth + Realtime + Storage + Edge Functions) | Reemplaza la necesidad de un servidor propio; escala por consumo; encaja con la restricción de no tener ambientes cloud propios |
| ORM / acceso a datos | **Drizzle** | Liviano, corre bien en Edge Functions (Deno), tipado fuerte, sin el peso de un servidor persistente que aquí no existe |
| Autorización | **Row Level Security (RLS) de Postgres** | La seguridad real vive en la base de datos, no en el frontend ni en el hosting |
| Tiempo real | **Supabase Realtime** (sobre cambios de Postgres) | El navegador se conecta directo al servicio de Supabase; GoDaddy nunca maneja WebSockets |
| Estilos | **Tailwind CSS** | Evita volver a la duplicación de CSS que ya resolvimos manualmente; encaja de forma natural con componentes de React |
| Hosting | **GoDaddy cPanel** (archivos estáticos) + **Supabase Cloud** (datos/backend) | Es lo que ya existe y lo que el presupuesto permite; ver [06](06-entornos-despliegue-cicd.md) |
| CI/CD | **GitHub Actions** | Gratis para repos con uso moderado, se integra directo con GitHub donde ya vive el código |
| Testing | **Vitest** (unitario) + **Playwright** (E2E) | Playwright ya se usó informalmente en este proyecto para verificar cambios visuales |

## La decisión que más influye en todo lo demás: no hay servidor Node propio

GoDaddy cPanel es hosting compartido pensado para archivos estáticos y PHP.
Aunque algunos planes de cPanel ofrecen "Node.js Selector" para correr un
proceso Node persistente, es una capacidad limitada (poca memoria, sin
soporte confiable de WebSockets, recursos compartidos con otros clientes del
mismo servidor) y no hay presupuesto para migrar a un hosting con soporte
nativo de Node (Vercel, Railway, etc.).

**Decisión:** Next.js se compila con `output: 'export'` (exportación
estática). El resultado son archivos HTML/CSS/JS planos — se suben a cPanel
exactamente como se sube el sitio hoy (FTP / File Manager), sin necesitar que
GoDaddy ejecute nada dinámico.

Esto significa que **toda la lógica dinámica (autenticación, base de datos,
tiempo real, envío de SMS/email, cálculos de quórum) vive en Supabase**, no en
el servidor que sirve las páginas:

- El navegador del usuario habla directamente con Supabase (Postgres vía
  API auto-generada + RLS, Auth, Realtime) usando el cliente JS de Supabase.
- Lo que requiere un secreto que no puede exponerse en el navegador (enviar un
  SMS, ejecutar una transacción de conteo de votos con privilegios elevados,
  integraciones futuras con DIAN/WhatsApp) se implementa como **Supabase Edge
  Functions** — funciones serverless alojadas y escaladas por Supabase, no por
  GoDaddy.

Consecuencia directa: GoDaddy pasa a ser, en los hechos, un CDN de archivos
estáticos. Todo el crecimiento futuro (miles de copropiedades, asambleas
simultáneas) lo absorbe Supabase, que es un servicio administrado que escala
por consumo — exactamente el criterio de "bajo costo, pago por consumo, alta
escalabilidad" que se pidió.

**Trade-off aceptado:** se pierde Server-Side Rendering "real" (por request) y
el Middleware de Next.js para proteger rutas en el servidor. En este proyecto
eso no cuesta nada relevante:
- Las páginas de marketing no cambian por usuario ni por request — no
  necesitan SSR dinámico.
- Las páginas de `/admin` y `/votaciones` no necesitan SEO (están detrás de
  login o son de un solo uso durante una asamblea).
- La protección de rutas se hace en el cliente (redirigir si no hay sesión
  válida de Supabase), sabiendo que **la seguridad real la garantiza RLS en la
  base de datos**, no el hecho de que la página no se muestre — alguien que
  se salte la redirección del cliente sigue sin poder leer ni escribir datos
  que no le correspondan.

Si en el futuro el proyecto migra a un hosting con soporte Node (p. ej. si el
presupuesto crece), pasar de `output: 'export'` a SSR normal es un cambio de
configuración de Next.js, no una reescritura — por eso se elige Next.js y no
un framework puramente estático (Astro/Eleventy): deja la puerta abierta sin
comprometerse a la limitación de hosting para siempre.

## Por qué Next.js y no otra opción

- **Astro**: ideal para sitios de puro contenido, pero pierde su ventaja
  (cero JS) en cuanto hay auth + datos dinámicos + un panel admin completo.
  Next.js tiene mejor soporte de patrones "app con login" (layouts anidados,
  route groups para separar marketing/admin/votaciones).
- **Un backend separado (NestJS/Laravel/Django) + frontend separado**: más
  piezas que mantener, dos despliegues, más superficie de error — sin equipo
  dedicado de backend, es más riesgo del que el proyecto necesita hoy.
- **Next.js** da un solo codebase, un solo lenguaje (TypeScript) de punta a
  punta, y su modelo de rutas (`app/admin/...`, `app/votaciones/...`) calza
  exactamente con la estructura de URLs pedida (`www.borca.ph/admin`,
  `www.borca.ph/votaciones`).

## Por qué Supabase y no alternativas

| Alternativa | Por qué no |
|---|---|
| Firebase | Modelo NoSQL (Firestore) es mal ajuste para el modelo relacional descrito (copropiedades–unidades–propietarios–coeficientes, con muchas relaciones); Postgres es superior aquí |
| Base de datos propia (Postgres autogestionado en una VM) | Requiere alguien manteniendo backups, parches, escalado — no hay equipo de infraestructura dedicado |
| PocketBase / otros BaaS pequeños | Comunidad y ecosistema mucho menores; menos garantías de continuidad a largo plazo para un proyecto que crecerá años |
| Construir la API propia con Prisma + un servidor Node | Vuelve a necesitar un servidor Node corriendo 24/7 — la limitación de GoDaddy lo descarta |

Supabase da, en un solo servicio administrado: Postgres real (no NoSQL),
autenticación lista para usar, Realtime sobre cambios de la base de datos,
almacenamiento de archivos (fotos del carrusel, documentos de actas a
futuro), Edge Functions para lógica privilegiada, y un generoso tier gratuito
para desarrollo y arranque en producción. Es open source en su núcleo
(auto-hospedable si algún día se quisiera migrar de la nube de Supabase),
lo que evita vendor lock-in total.

## Por qué Drizzle y no Prisma

Prisma es excelente y tiene mayor comunidad, pero está pensado para correr
dentro de un servidor persistente con un pool de conexiones — exactamente lo
que este proyecto no tiene. Drizzle:
- Corre sin fricción dentro de Supabase Edge Functions (runtime Deno/edge).
- No requiere un paso de generación de cliente pesado.
- Da control fino sobre SQL cuando el cálculo de quórum/resultados en vivo
  necesite consultas optimizadas a mano.

Se usa únicamente **dentro de las Edge Functions** que necesiten lógica
compleja; para operaciones CRUD simples desde el navegador se usa
directamente el cliente de Supabase (que ya respeta RLS), sin pasar por un
ORM.

## Multi-tenancy: esquema compartido con `copropiedad_id` + RLS

Para "miles de copropiedades" la opción operacionalmente viable es **una sola
base de datos, un solo esquema**, con una columna `copropiedad_id` en cada
tabla que pertenece a una copropiedad, y políticas de RLS que garantizan que
un usuario solo vea/edite filas de su(s) propia(s) copropiedad(es). Una base
de datos por copropiedad no escala operacionalmente a miles de instancias y
sería mucho más cara de mantener. Ver el detalle en
[02-modelo-datos.md](02-modelo-datos.md).

## Registro de decisiones (ADR)

Cada decisión relevante adicional que se tome durante el desarrollo se
documenta como un ADR corto en [`adr/`](adr/), siguiendo el formato:
contexto → decisión → consecuencias → alternativas consideradas. Esto es lo
que permite que el proyecto "nunca pierda consistencia" entre sesiones de
trabajo.
