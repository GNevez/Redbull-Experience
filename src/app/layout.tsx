import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Red Bull — Scroll Experience",
  description: "Immersive scroll-driven Red Bull landing section.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
