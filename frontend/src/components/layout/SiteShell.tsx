"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

function PersistentHeroBackground({ isHome }: { isHome: boolean }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#F5F0E8]">
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isHome ? "opacity-100 scale-100" : "opacity-85 scale-105"
        }`}
      >
        <Image
          src="/hero.png"
          alt=""
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-bottom-left"
        />
      </div>

      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isHome ? "bg-transparent" : "bg-[#F5F0E8]/82"
        }`}
      />
    </div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAnimalPage = pathname.startsWith("/animals/");
  const shouldUseSharedChrome = isHome || isAnimalPage;

  if (!shouldUseSharedChrome) {
    return children;
  }

  return (
    <>
      <PersistentHeroBackground isHome={isHome} />
      <Navbar transparent={isHome} />
      <div className="relative z-10">{children}</div>
    </>
  );
}
