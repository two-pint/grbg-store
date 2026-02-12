import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  title: {
    default: "GRBG",
    template: "%s | GRBG",
  },
  description:
    "GRBG — bold, original designs on premium print-on-demand goods.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://grbg-store.vercel.app",
  ),
  openGraph: {
    title: "GRBG",
    description:
      "GRBG — bold, original designs on premium print-on-demand goods.",
    siteName: "GRBG",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GRBG",
    description:
      "GRBG — bold, original designs on premium print-on-demand goods.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
