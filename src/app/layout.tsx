import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Montserrat é a fonte de títulos usada na apresentação institucional
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://isiba.org.br";
const title = "ISIBA | Gestão Humanizada em Saúde Pública";
const description =
  "Instituto de Gestão em Saúde (ISIBA): desde 2006 fortalecendo o SUS com gestão humanizada, eficiência operacional e transparência em UPAs e hospitais públicos.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  icons: { icon: "/favicon.png" },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "ISIBA",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/hero-background.png",
        width: 1920,
        height: 1080,
        alt: "ISIBA - Gestão Humanizada em Saúde Pública",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/hero-background.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#06191d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
