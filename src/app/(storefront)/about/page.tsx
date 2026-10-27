import type { Metadata } from "next";
import { AboutHero } from "@/components/storefront/about/about-hero";
import { AboutStory } from "@/components/storefront/about/about-story";

export const metadata: Metadata = {
  title: "About | Lotus Lights",
  description:
    "Lotus Lights designs and packs modern lamps in Firozabad for homes, offices, showrooms, and stores across India.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
    </>
  );
}
