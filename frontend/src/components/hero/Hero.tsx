import Image from "next/image";
import { Navbar } from "./Navbar";

export function Hero() {
  return (
    <div className="h-screen relative overflow-hidden">
      <Image
        src="/hero.png"
        alt="Background"
        fill
        className="object-cover object-bottom-left"
        priority
        quality={100}
      />

      <Navbar />

      <div className="relative z-10 h-full flex items-center justify-end">
        <div className="max-w-xl mr-56 bg-white/85 backdrop-blur-sm p-10 rounded-3xl shadow-xl">
          <h1 className="text-5xl font-bold text-[#7a4f2a] uppercase leading-tight">
            Найди своего
            <br />
            нового друга
          </h1>

          <p className="mt-4 text-[20px] text-gray-700 leading-relaxed">
            Подари любовь и дом тем, кто так ждёт заботу. Наш приют помогает
            бездомным животным обрести счастливую семью и новое начало.
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[10%] pointer-events-none bg-linear-to-t from-[#fffef9] to-transparent"
        aria-hidden
      />
    </div>
  );
}
