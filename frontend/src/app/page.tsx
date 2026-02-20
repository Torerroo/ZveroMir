import { Hero } from "@/components/hero/Hero";
import { AnimalsSection } from "@/components/animals/AnimalsSection";
import { HelpSection } from "@/components/help/HelpSection";

export default function Home() {
  return (
    <>
      <Hero />
      <AnimalsSection />
      <HelpSection />
    </>
  );
}
