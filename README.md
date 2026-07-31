# BORCA – sitio web

Sitio corporativo de BORCA, construido con [Next.js](https://nextjs.org/) (App
Router) y exportado como sitio estático para ser servido desde hosting
compartido (GoDaddy/cPanel).

Para el contexto completo de arquitectura, decisiones técnicas y el roadmap de
los módulos futuros (administración, asambleas, votaciones), ver
[docs/architecture/](docs/architecture/README.md).

## Requisitos previos

- [Node.js](https://nodejs.org/) 20 o superior (el CI usa 24; localmente basta con 20+)
- npm (viene incluido con Node.js)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — solo
  necesario si vas a trabajar en `/admin` u otra funcionalidad que dependa de
  Supabase (Fase 1 en adelante)
- [Supabase CLI](https://supabase.com/docs/guides/cli) — `brew install
  supabase/tap/supabase` en macOS

Verifica tu versión con:

```bash
node --version
npm --version
```

## Instalación

Clona el repositorio e instala las dependencias (solo la primera vez, o cada
vez que cambie `package.json`):

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador. Cualquier
cambio en `app/` o `src/` se refleja al instante (hot reload), sin necesidad
de reiniciar el servidor.

## Backend local (Supabase)

A partir de la Fase 1 (login, perfiles, carrusel administrable) el proyecto
depende de Supabase. En vez de apuntar a producción durante el desarrollo, se
levanta una réplica completa del stack (Postgres, Auth, Storage, Studio) en
Docker, corriendo 100% en tu máquina:

```bash
supabase start   # levanta el stack local (la primera vez descarga las imágenes de Docker)
supabase stop    # lo apaga cuando termines
```

Al iniciar, la terminal imprime las credenciales locales (`API URL`,
`ANON_KEY`, etc. — son credenciales de desarrollo fijas, no reales). Copia
`.env.local.example` a `.env.local` y complétalo con esos valores:

```bash
cp .env.local.example .env.local
```

Supabase Studio (panel de administración de la base de datos local) queda
disponible en [http://127.0.0.1:54323](http://127.0.0.1:54323).

`.env.local` nunca se sube al repositorio (está en `.gitignore`) — cada
desarrollador usa su propia copia local.

## Otros comandos

| Comando | Qué hace |
|---|---|
| `npm run build` | Genera el sitio estático final en `out/` — es lo que se sube al hosting |
| `npm run lint` | Revisa errores de estilo y buenas prácticas del código |
| `npm run typecheck` | Verifica que no haya errores de TypeScript |

## Ver el build de producción localmente

Para revisar el sitio tal como lo serviría el hosting real (en vez del modo
desarrollo), genera el build y sírvelo con cualquier servidor estático:

```bash
npm run build
npx serve out
```

## Estructura del proyecto

```
app/                  Rutas de Next.js (páginas del sitio)
src/
  shared/ui/           Header, Footer y componentes compartidos
  styles/              CSS del sitio
  modules/             Módulos de negocio futuros (auth, carrusel, etc.)
public/                Imágenes y archivos estáticos (servidos en /)
supabase/              Configuración y migraciones del stack local de Supabase
docs/architecture/     Documentación de arquitectura y decisiones técnicas
```
