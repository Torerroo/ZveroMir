import Image from "next/image";

import { Menu } from "@/components/layout/Menu";

export function Main() {
  return (
    <div className="h-screen relative overflow-hidden">
      <Image
        src="/main.png"
        alt="Background"
        fill
        className="object-cover object-bottom-left"
        priority
        quality={100}
      />

      {/* Плавный переход снизу, чтобы фон мягко сходил на основной градиент */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[7%] pointer-events-none bg-linear-to-t from-[#fffef9] to-transparent"
        aria-hidden
      />

      <header className="absolute top-0 left-0 right-0 z-10 px-5 pt-2">
        <div className="w-[200px] h-[72px] flex items-center shrink-0">
          <Image
            src="/logo.svg"
            alt="ЗвероМир"
            width={200}
            height={200}
            priority
            className="w-full h-auto object-contain object-left"
          />
        </div>

        <Menu />
      </header>
    </div>
  );
}
