import { HeroSection } from "@/components/hero/HeroSection";
import { AnimalsSection } from "@/components/animals/AnimalsSection";
import { HelpSection } from "@/components/help/HelpSection";
import { ContactsSection } from "@/components/contacts/ContactsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AnimalsSection />
      <HelpSection />
      <ContactsSection />
    </>
  );
}
