import type { Metadata } from "next";
import { Inter, Poppins, Lexend_Deca } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const fontLexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lexend-deca",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FrameFlux",
  description: "Discover and explore trending movies and anime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          fontInter.variable,
          fontPoppins.variable,
          fontLexendDeca.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
