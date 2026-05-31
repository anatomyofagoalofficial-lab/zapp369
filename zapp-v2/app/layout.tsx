import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "⚡ZAPP · Tesla's Unfinished Revolution",
    template: "%s · ⚡ZAPP",
  },
  description:
    "⚡ZAPP is a community-driven Solana token honoring Nikola Tesla's unfinished revolution and the 3·6·9 frequency. Free Energy = Free Money ∞",
  keywords: ["⚡ZAPP", "ZAPP", "Solana", "Tesla", "369", "3 6 9"],
  applicationName: "⚡ZAPP",
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: "⚡ZAPP",
    title: "⚡ZAPP · Tesla's Unfinished Revolution",
    description:
      "Free Energy = Free Money ∞ · The frequency they tried to silence. 3 · 6 · 9 ∞",
    images: [{ url: "/og-default.jpg", alt: "⚡ZAPP" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ZAPPonSOL",
    title: "⚡ZAPP · Tesla's Unfinished Revolution",
    description: "Free Energy = Free Money ∞ · 3 · 6 · 9 ∞",
    images: ["/og-default.jpg"],
  },
  // favicon is served from app/favicon.ico (auto-detected by Next)
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-present-black font-sans text-present-white antialiased">
        <ScrollProgress />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
