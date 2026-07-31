import { Header } from "@/shared/ui/Header";
import { Footer } from "@/shared/ui/Footer";
import { SiteEffects } from "@/shared/ui/SiteEffects";

// Layout del sitio público (marketing + login): header/footer + efectos
// visuales compartidos. /admin y futuras apps (votaciones, portal de
// residentes) viven fuera de este grupo y no lo heredan.
export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <SiteEffects />
    </>
  );
}
