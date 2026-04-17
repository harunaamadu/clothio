import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/layout/Providers";
import { Toaster } from "@/components/ui/sonner";

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
    default: "Clothio — Modern Fashion Store",
    template: "%s | Clothio",
  },
  description:
    "Discover the latest in fashion. Premium clothing, accessories, and more.",
  keywords: ["fashion", "clothing", "ecommerce", "style", "accessories"],
  openGraph: {
    title: "Clothio — Modern Fashion Store",
    description: "Discover the latest in fashion.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Clothio",
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
