"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

// El panel /admin tiene su propio shell (ver app/admin/layout.tsx) — no
// muestra el header/footer del sitio público.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const esAdmin = pathname?.startsWith("/admin");

  if (esAdmin) return <>{children}</>;

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
