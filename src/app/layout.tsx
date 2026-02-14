import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillSwap",
  description: "Platform pertukaran keahlian (SkillSwap) dengan fitur AI Matchmaking.",
  keywords: ["SkillSwap", "Tukar Keahlian", "Next.js", "TypeScript", "Matchmaking", "Platform"],
  authors: [{ name: "SkillSwap Team" }],
  icons: {
    // Biarkan link ini untuk sementara. 
    // Nanti kamu bisa menggantinya dengan path lokal seperti "/logo.png" atau "/favicon.ico"
    icon: "https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/transfer.svg",
  },
  openGraph: {
    title: "SkillSwap",
    description: "Platform pertukaran keahlian dengan fitur AI Matchmaking.",
    url: "http://localhost:3000",
    siteName: "SkillSwap",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillSwap",
    description: "Platform pertukaran keahlian dengan fitur AI Matchmaking.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}