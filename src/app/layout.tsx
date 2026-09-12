import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EdgeLab AI — Quantitative Research Assistant",
  description:
    "Transform ambiguous market hypotheses into structured, transparent research experiments with deterministic backtesting and cautious evidence analysis.",
  keywords: ["quantitative research", "trading hypotheses", "nifty 50", "backtesting", "AI research workbench"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-cyber-900 text-icy-100 antialiased selection:bg-coolTeal-500 selection:text-cyber-950">
        {children}
      </body>
    </html>
  );
}
