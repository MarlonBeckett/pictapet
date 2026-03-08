import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/contexts/cart-context";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "PictaPet — Portraits Worthy of a Frame",
  description:
    "Upload your pet's photo. Choose a theme. Receive a museum-quality AI portrait.",
  openGraph: {
    title: "PictaPet — Portraits Worthy of a Frame",
    description: "Upload your pet's photo. Choose a theme. Receive a museum-quality AI portrait.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Display fonts for themes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bangers&family=Cinzel+Decorative:wght@400;700&family=MedievalSharp&family=Orbitron:wght@400;700&family=Permanent+Marker&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Pacifico&family=Rye&family=Cormorant+Garamond:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${dmSans.variable} antialiased min-h-screen flex flex-col`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
