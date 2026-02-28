import { HeroSection } from "@/components/hero/HeroSection";
import { AnimalsSection } from "@/components/animals/AnimalsSection";
import { HelpSection } from "@/components/help/HelpSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AnimalsSection />
      <HelpSection />
    </>
  );
}
