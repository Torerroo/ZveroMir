"use client";

export function Navbar() {
  const scrollToSection = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="absolute top-6 left-0 right-0 z-20 flex justify-center">
      <div className="w-[92%] max-w-7xl bg-white/60 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl px-8 h-[72px] flex items-center justify-between">
        <div className="w-[180px]" onClick={() => scrollToSection("top")}>
          <img
            src="/logo.svg"
            alt="ЗвероМир"
            className="w-full h-auto object-contain"
          />
        </div>

        <nav className="flex items-center gap-10 text-gray-800 font-medium text-[20px]">
          <button
            onClick={() => scrollToSection("top")}
            className="hover:text-[#7a4f2a] transition cursor-pointer"
          >
            О нас
          </button>
          <button
            onClick={() => scrollToSection("animals-section")}
            className="hover:text-[#7a4f2a] transition cursor-pointer"
          >
            Питомцы
          </button>
          <button
            onClick={() => scrollToSection("help-section")}
            className="hover:text-[#7a4f2a] transition cursor-pointer"
          >
            Помощь
          </button>
          <button
            onClick={() => scrollToSection("contacts-section")}
            className="hover:text-[#7a4f2a] transition cursor-pointer"
          >
            Контакты
          </button>

          <button className="text-2xl hover:scale-110 transition cursor-pointer">
            👤
          </button>
        </nav>
      </div>
    </header>
  );
}
