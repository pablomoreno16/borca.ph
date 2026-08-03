import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/style.css";
import { cormorantGaramond, montserrat, nunitoSans, playfairDisplay } from "@/shared/ui/fonts";

const GOOGLE_ANALYTICS_ID = "G-RZ8HRY4CH1";
const MICROSOFT_CLARITY_ID = "xweu0fztb1";

export const metadata: Metadata = {
  metadataBase: new URL("https://borca.ph"),
  title: "Inicio – BORCA",
  description:
    "BORCA transforma copropiedades en Colombia con administración de Propiedad Horizontal estratégica, humana y eficiente. Conoce nuestros servicios de administración PH.",
  verification: {
    google: "CncaLMef0HsrrzwbxqyZc-PPuE89pCckjmoiBcXZh3Q",
  },
};

// Datos estructurados (Organization): le dan a Google una fuente explícita
// del nombre, logo y contacto de la marca — ayuda a que búsquedas de marca
// como "borca" reconozcan la empresa (panel de conocimiento, rich results),
// además de lo que ya se logra con indexación normal.
const JSON_LD_ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BORCA",
  url: "https://borca.ph",
  logo: "https://borca.ph/images/logo-borca.png",
  description:
    "BORCA transforma copropiedades en Colombia con administración de Propiedad Horizontal estratégica, humana y eficiente.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Medellín",
    addressCountry: "CO",
  },
  telephone: "+57 305 349 8787",
  email: "admin@borca.ph",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_ORGANIZATION) }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_ID}');
          `}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=next";
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${MICROSOFT_CLARITY_ID}");
          `}
        </Script>
      </body>
    </html>
  );
}
