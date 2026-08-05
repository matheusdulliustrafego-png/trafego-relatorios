import type { Metadata, Viewport } from "next";
import { Poppins, Raleway, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Relatórios · Tráfego Real",
  description: "Ferramenta interna de geração de relatórios de campanha.",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${raleway.variable} ${inter.variable} h-full dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-brand-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
