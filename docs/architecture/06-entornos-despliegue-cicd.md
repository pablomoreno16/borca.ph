# Entornos, despliegue y CI/CD

## Restricción de partida

- Hosting actual: **GoDaddy con cPanel** (archivos estáticos), ya pagado, no
  se reemplaza.
- Código en **GitHub**.
- **Sin presupuesto para ambientes cloud de prueba.** Solo hay dos momentos
  reales: desarrollo local y producción.

Toda esta sección está diseñada para no requerir gasto adicional más allá de
lo que ya existe (GoDaddy) y los tiers gratuitos de Supabase/GitHub.

## Ambiente local (Docker)

El **Supabase CLI** levanta, vía Docker Compose, una réplica completa del
stack de Supabase en la máquina de desarrollo: Postgres, Auth, Realtime,
Storage y un panel de administración local — todo gratis, todo aislado de
producción.

```bash
supabase start      # levanta el stack completo en Docker
supabase db reset   # aplica migraciones + datos semilla locales
npm run dev          # Next.js en modo desarrollo, apuntando al Supabase local
```

Esto cumple el requisito de "Docker" del proyecto sin necesitar contenedores
propios para el frontend: Next.js exportado no necesita Docker para correr
(es HTML estático), Docker se usa específicamente para tener Supabase
localmente.

**Datos de prueba:** se mantiene un script de *seed* (`supabase/seed.sql`) con
copropiedades, unidades y personas ficticias, para poder probar el módulo de
asambleas/votaciones completo sin tocar datos reales.

## Producción

- **Supabase:** un proyecto en la nube (tier gratuito para empezar; se
  escala el plan solo cuando el uso real lo exija — "pago por consumo").
- **GoDaddy cPanel:** recibe el resultado de `next build` con
  `output: 'export'` — una carpeta `out/` con HTML/CSS/JS estático, subida a
  la raíz del hosting exactamente como se sube manualmente hoy.
- **Edge Functions:** se despliegan a Supabase con `supabase functions deploy`,
  independiente del despliegue del sitio.

No existe un ambiente "staging" en la nube. La red de seguridad ante esa
ausencia es:
1. Pruebas automatizadas (unitarias + E2E) corriendo en CI **antes** de
   permitir el despliegue.
2. Pruebas manuales exhaustivas en local (con datos semilla realistas) antes
   de cada release.
3. Migraciones de base de datos revisadas y probadas en local antes de
   aplicarse a producción (nunca se edita el esquema de producción a mano).

### Opción de bajo costo a considerar más adelante (no bloqueante hoy)

Si más adelante se quiere una red de seguridad extra sin costo adicional
real: cPanel permite subdominios gratis dentro del mismo plan de hosting
(ej. `staging.borca.ph`) y Supabase permite un segundo proyecto en su tier
gratuito. Combinados, dan un ambiente de staging genuino a costo $0 — se deja
anotado como mejora futura, no como parte del alcance actual.

## CI/CD con GitHub Actions

Flujo en cada push a `main` (con pruebas obligatorias antes de desplegar):

```yaml
name: CI/CD
on:
  push:
    branches: [main]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test          # Vitest
      - run: npm run build         # next build -> out/
      - run: npm run test:e2e      # Playwright, contra el build local
  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: SamKirkland/FTP-Deploy-Action@v4
        with:
          server: ${{ secrets.GODADDY_FTP_HOST }}
          username: ${{ secrets.GODADDY_FTP_USER }}
          password: ${{ secrets.GODADDY_FTP_PASSWORD }}
          local-dir: ./out/
```

- Las migraciones de Supabase se aplican con un paso adicional
  (`supabase db push`) **manual y deliberado** contra producción — nunca
  automático en el pipeline, para poder revisar cada cambio de esquema antes
  de aplicarlo (los cambios de esquema son mucho más difíciles de revertir
  que un despliegue de archivos estáticos).
- Credenciales (FTP de GoDaddy, claves de Supabase) viven en **GitHub
  Secrets**, nunca en el repositorio.

## Checklist antes de cada despliegue a producción

- [ ] CI en verde (lint, typecheck, tests unitarios, tests E2E)
- [ ] Probado manualmente contra el stack local de Supabase con datos semilla
- [ ] Si hay migración de esquema: revisada, probada en local, y aplicada
      **antes** de subir el frontend que depende de ella
- [ ] Sin secretos ni claves `service_role` en el código que se exporta al
      navegador
