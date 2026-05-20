import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BJÖRK & CO. | Fine Jewelry",
  description: "Handcrafted fine jewelry, engagement rings, and custom designs. BJÖRK & CO. creates timeless pieces for life's most precious moments.",
  keywords: ["fine jewelry", "engagement rings", "custom jewelry", "luxury jewelry", "bridal jewelry"],
  openGraph: {
    title: "BJÖRK & CO. | Fine Jewelry",
    description: "Handcrafted fine jewelry, engagement rings, and custom designs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
