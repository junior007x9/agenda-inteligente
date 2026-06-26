import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { ptBR } from "@clerk/localizations";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agenda Inteligente",
  description: "Organize suas demandas com estilo e exclusividade.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Agenda" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#020617", width: "device-width", initialScale: 1, maximumScale: 1, userScalable: false };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-BR">
        <body className={`${inter.className} bg-slate-950 antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}