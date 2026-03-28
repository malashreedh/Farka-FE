import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import your new component

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
  title: "FARKA | फर्क",
  description: "Connecting Nepali migrant workers with opportunities back home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--navy)]`}
      >
        {/* The Navbar stays outside the main content so it doesn't rerender unnecessarily */}
        <Navbar />
        
        {/* We add pt-20 (padding-top) so the fixed Navbar doesn't hide the top of your pages */}
        <main className="pt-20 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}