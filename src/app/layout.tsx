import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "PictaPet — Portraits Worthy of a Frame",
  description:
    "Upload your pet's photo. Choose a style. Receive a museum-quality AI portrait.",
  openGraph: {
    title: "PictaPet — Portraits Worthy of a Frame",
    description: "Upload your pet's photo. Choose a style. Receive a museum-quality AI portrait.",
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
      <body className={`${dmSans.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
