"use client";

import { HeroSection } from "@/components/hero-section";
import { ThemeGallery } from "@/components/theme-gallery";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6">
          <HeroSection
            label="AI Portrait Studio"
            heading='Your Pet,<br /><em>Immortalized</em>'
            subtext="Pick a theme. Upload a photo. Receive a portrait worthy of a frame."
          />
        </div>
        <ThemeGallery />
      </main>
      <Footer />
    </>
  );
}
