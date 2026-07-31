import type { Metadata } from "next";
import "@/styles/style.css";
import { SiteChrome } from "@/shared/ui/SiteChrome";
import { SiteEffects } from "@/shared/ui/SiteEffects";

export const metadata: Metadata = {
  title: "Inicio – BORCA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Nunito+Sans:wght@300;400;600;700;800&family=Montserrat:wght@500&family=Cormorant+Garamond:ital@1&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body suppressHydrationWarning>
        <SiteChrome>{children}</SiteChrome>
        <SiteEffects />
      </body>
    </html>
  );
}
