# BORCA – sitio web

Sitio corporativo de BORCA, construido con [Next.js](https://nextjs.org/) (App
Router) y exportado como sitio estático para ser servido desde hosting
compartido (GoDaddy/cPanel).

Para el contexto completo de arquitectura, decisiones técnicas y el roadmap de
los módulos futuros (administración, asambleas, votaciones), ver
[docs/architecture/](docs/architecture/README.md).

## Requisitos previos

- [Node.js](https://nodejs.org/) 20 o superior
- npm (viene incluido con Node.js)

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
docs/architecture/     Documentación de arquitectura y decisiones técnicas
```
