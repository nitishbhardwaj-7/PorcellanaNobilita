import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";

const didot = localFont({
  src: "./fonts/Didot.ttf",
  variable: "--font-didot",
});

const didotBold = localFont({
  src: "./fonts/Didot Bold.otf",
  variable: "--font-didotbold",
});

const michroma = localFont({
  src: "./fonts/Michroma.ttf",
  variable: "--font-michroma",
});

const ivymode = localFont({
  src: "./fonts/IvyMode-Regular.ttf",
  variable: "--font-ivymode",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

import ScrollIndicator from "@/components/ScrollIndicator";
import DisableInspect from "@/components/DisableInspect";

export const metadata: Metadata = {
  title: "Porcellana Nobilita — IL GRES IMPERIALE D'ITALIA",
  description:
    "Timeless Italian porcelain surfaces crafted for the modern era. Inspired by the noble floors of Italian palazzi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} ${didot.variable} ${didotBold.variable} ${michroma.variable} ${ivymode.variable}`}
    >
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
           new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
           j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
           'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
           })(window,document,'script','dataLayer','GTM-PQKMZZ7S');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className="font-ivymode antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PQKMZZ7S"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <LanguageProvider>
          {children}
          <ScrollIndicator />
          <DisableInspect />
        </LanguageProvider>
      </body>
    </html>
  );
}
