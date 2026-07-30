# Estructura de carpetas

## Árbol propuesto (al migrar a Next.js)

```
borca.ph/
├── app/                          # Next.js App Router — solo rutas, delgadas
│   ├── layout.tsx                 # Layout raíz: <Header/> + <Footer/> compartidos
│   ├── page.tsx                   # Home (marketing)
│   ├── servicios/page.tsx
│   ├── quienes-somos/page.tsx
│   ├── por-que-elegirnos/page.tsx
│   ├── contacto/page.tsx
│   ├── admin/
│   │   ├── layout.tsx              # Guard de sesión (rol admin_copropiedad/super_admin)
│   │   ├── page.tsx                # Dashboard
│   │   ├── carrusel/page.tsx       # CRUD del carrusel de novedades
│   │   ├── copropiedades/page.tsx  # (fase futura)
│   │   └── asambleas/page.tsx      # (fase futura)
│   └── votaciones/
│       ├── page.tsx                # Ingreso: email/SMS -> OTP
│       └── [asambleaId]/page.tsx   # Pantalla de votación en vivo
│
├── src/
│   ├── modules/                    # Monolito modular — un folder por dominio
│   │   ├── auth/
│   │   ├── copropiedades/
│   │   ├── asambleas/
│   │   ├── votaciones/
│   │   └── carrusel/
│   │       ├── domain/             # Entidades y reglas de negocio puras
│   │       ├── application/        # Casos de uso (ej. "cerrarVotacion")
│   │       ├── infrastructure/     # Acceso a Supabase/Drizzle para este módulo
│   │       └── presentation/       # Componentes React propios del módulo
│   │
│   ├── shared/
│   │   ├── ui/                     # Header, Footer, Button, Card — reutilizables
│   │   ├── supabase/                # Cliente Supabase + tipos generados del esquema
│   │   └── lib/                     # Utilidades genéricas (formateo, validaciones comunes)
│   │
│   └── styles/
│       └── globals.css              # Tailwind + tokens de marca (colores, tipografía)
│
├── public/
│   └── images/                      # Igual que hoy
│
├── supabase/
│   ├── migrations/                  # SQL versionado del esquema (una migración por cambio)
│   ├── functions/                   # Edge Functions (Deno) — catálogo en 04-api-y-tiempo-real.md
│   └── config.toml                  # Config del stack local de Supabase (Docker)
│
├── docs/
│   └── architecture/                 # Este directorio
│
├── tests/
│   ├── unit/                         # Vitest — domain/application de cada módulo
│   └── e2e/                          # Playwright — flujos completos (login, votar, etc.)
│
├── .github/workflows/                 # CI/CD (build, test, deploy)
├── next.config.js                     # output: 'export'
├── package.json
└── tailwind.config.ts
```

## Por qué esta forma y no otra

- **`app/` se mantiene delgado a propósito.** Cada archivo de ruta importa y
  compone piezas de `src/modules/*/presentation` — así una página nunca
  concentra lógica de negocio, solo layout y composición. Esto es lo que
  permite mover o versionar un módulo sin tocar rutas.
- **Cada módulo con lógica de negocio real (`auth`, `asambleas`,
  `votaciones`, `copropiedades`, `carrusel`) sigue las 4 capas de Clean
  Architecture.** El contenido puramente de marketing (home, servicios,
  quiénes somos) **no** necesita esta estructura — son páginas de
  presentación sin reglas de negocio, forzar 4 carpetas ahí sería ceremonia
  sin beneficio.
- **`shared/` es deliberadamente pequeño.** Solo lo que de verdad se repite
  entre módulos (UI base, cliente de Supabase, utilidades). Si algo se usa en
  un solo módulo, vive dentro de ese módulo — evita que `shared/` se
  convierta en un cajón de sastre.
- **`supabase/functions/` es "el backend"** en esta arquitectura (ver
  [01](01-stack-y-decisiones.md)) — vive en el mismo repo para que el
  historial de git conecte cambios de frontend y backend en un mismo commit,
  pero se despliega por separado (Supabase CLI), no junto al export estático.
- **`tests/` espeja `src/modules/`** — cada módulo nuevo trae su carpeta de
  tests unitarios correspondiente desde el día en que se crea, no como
  tarea aparte al final.

## Regla para agregar un módulo futuro (cartera, contabilidad, PQRS, ...)

1. Crear `src/modules/<nombre>/` con sus 4 subcarpetas.
2. Migración SQL en `supabase/migrations/` para sus tablas (con
   `copropiedad_id` y políticas RLS desde el primer commit, no después).
3. Edge Functions propias del módulo bajo `supabase/functions/<nombre>-*`.
4. Rutas en `app/admin/<nombre>/` que solo importan de
   `src/modules/<nombre>/presentation`.
5. Tests en `tests/unit/<nombre>/`.

Ningún módulo nuevo debería requerir modificar el código de un módulo
existente — si eso pasa, es una señal de que el límite de dominio está mal
trazado y hay que revisarlo antes de seguir.
