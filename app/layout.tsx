import "@/styles/globals.css";

import { Jost } from "next/font/google";
import type { Metadata } from "next";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reniec - Oficinas 📍",
  description: "Encuentra la oficina RENIEC más cercana a tu ubicación",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${jost.variable} antialiased`}>{children}</body>
    </html>
  );
}
