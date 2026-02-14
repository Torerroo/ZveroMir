import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Главный экран */}
      <div className="h-screen relative overflow-hidden">
        <Image
          src="/main.png"
          alt="Background"
          fill
          className="object-cover object-bottom-left"
          priority
          quality={100}
        />
        {/* Плавный переход: ~20% высоты — не съедает фото, линия не резкая */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[7%]  pointer-events-none bg-linear-to-t from-[#fffef9] to-transparent"
          aria-hidden
        />
        <header className="absolute top-0 left-0 z-10 pl-5 pt-2 min-h-[72px] flex items-start">
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
        </header>
      </div>

      {/* Блок с животными: сверху светлый крем, вниз светло-песочный, переход затуманен (много остановок) */}
      <section
        className="min-h-screen w-full"
        style={{
          backgroundImage: `linear-gradient(to bottom,
            #fffef9 0%,
            #fcf9f3 18%,
            #f8f4ec 35%,
            #f2ebe0 52%,
            #ebe3d8 70%,
            #e5dccf 88%,
            #e0d6c8 100%
          )`,
        }}
        aria-label="Наши питомцы"
      />
    </>
  );
}
