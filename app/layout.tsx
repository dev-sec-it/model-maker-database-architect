import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Model Maker | AI Database Architect",
  description: "Generate complete production-ready relational database schemas, SQL, Prisma, and Flutter models instantly using Gemini AI from plain text.",
  keywords: ["AI database generator", "Gemini AI", "SQL generator", "Prisma schema generator", "Flutter models", "database architecture visualization"],
  openGraph: {
    title: "Model Maker | AI Database Architect",
    description: "Instantly generate and visualize relational schemas with code exports for SQL, Next.js, and Flutter.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
