import type { MetadataRoute } from "next";

// Requerido por output: 'export' — sin esto, Next.js no puede generar
// sitemap.xml/robots.txt como archivos estáticos en build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/login/"],
    },
    sitemap: "https://borca.ph/sitemap.xml",
  };
}
