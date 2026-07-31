import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/shared/ui/Header";
import { Footer } from "@/shared/ui/Footer";

export const metadata: Metadata = {
  title: "Página no encontrada – BORCA",
};

// Vive fuera de app/(sitio) (Next.js requiere el 404 global en la raíz de
// app/), así que renderiza el header/footer directamente en vez de
// heredarlos de un layout.
export default function NotFound() {
  return (
    <>
      <Header />
      <section className="page-hero min-h-[70vh] flex items-center">
        <div className="page-hero-inner text-center">
          <p className="page-hero-label justify-center">Error 404</p>
          <h1>
            Página <span>no encontrada</span>
          </h1>
          <p className="mx-auto">
            El recurso que intentas acceder no existe o no se encuentra disponible.
          </p>
          <div className="mt-8">
            <Link href="/" className="btn-cta bg-gold">
              <i className="fa-solid fa-house"></i> Volver al inicio
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
