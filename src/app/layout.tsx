import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/layout/Providers";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });
const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

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
    default: `${process.env.WEBSITE_NAME} — Modern Fashion Store`,
    template: "%s | " + process.env.WEBSITE_NAME,
  },
  description:
    "Discover the latest in fashion. Premium clothing, accessories, and more.",
  keywords: ["fashion", "clothing", "ecommerce", "style", "accessories"],
  openGraph: {
    title: `${process.env.WEBSITE_NAME} — Modern Fashion Store`,
    description: "Discover the latest in fashion.",
    url: process.env.NEXT_PUBLIC_URL,
    siteName: process.env.WEBSITE_NAME,
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
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        roboto.variable,
        outfit.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
