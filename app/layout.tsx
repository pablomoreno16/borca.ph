import type { Metadata } from "next";
import "@/styles/style.css";
import { cormorantGaramond, montserrat, nunitoSans, playfairDisplay } from "@/shared/ui/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://borca.ph"),
  title: "Inicio – BORCA",
  description:
    "BORCA transforma copropiedades en Colombia con administración de Propiedad Horizontal estratégica, humana y eficiente. Conoce nuestros servicios de administración PH.",
  verification: {
    google: "CncaLMef0HsrrzwbxqyZc-PPuE89pCckjmoiBcXZh3Q",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfairDisplay.variable} ${nunitoSans.variable} ${montserrat.variable} ${cormorantGaramond.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
