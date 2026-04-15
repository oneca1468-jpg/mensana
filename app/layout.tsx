import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mensana",
  description: "Your structured mental wellness companion",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mensana",
  },
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(geistSans.variable, geistMono.variable)}>
      <body className="antialiased min-h-screen bg-background pb-16 md:pb-0">
        <main className="w-full h-full flex flex-col">{children}</main>
        <BottomNavigation />
      </body>
    </html>
  );
}
