import type { Metadata } from "next";
import localFont from "next/font/local";

import Navbar from "@/components/Navbar";

import "./globals.css";

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
  title: "FARKA | Return with direction",
  description: "A guided return-planning platform for Nepali workers abroad exploring jobs and business options back home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[color:var(--bg)] antialiased`}>
        <Navbar />
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
