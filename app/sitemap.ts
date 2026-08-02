import type { MetadataRoute } from "next";

// Requerido por output: 'export' — sin esto, Next.js no puede generar
// sitemap.xml/robots.txt como archivos estáticos en build time.
export const dynamic = "force-static";

const BASE_URL = "https://borca.ph";

// Solo las páginas públicas de marketing — /admin y /login quedan fuera
// (ver app/robots.ts, que además las bloquea explícitamente).
const RUTAS = ["", "quienes-somos", "servicios", "por-que-elegirnos", "contacto"];

export default function sitemap(): MetadataRoute.Sitemap {
  return RUTAS.map((ruta) => ({
    url: `${BASE_URL}/${ruta}${ruta ? "/" : ""}`,
  }));
}
