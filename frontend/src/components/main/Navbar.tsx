"use client";

export function Navbar() {
  const scrollToSection = (section: string) => {
    const sections = {
      about: { selector: null, isTop: true },
      animals: { selector: '[aria-label="Наши питомцы"]', isTop: false },
      help: { selector: '[aria-label="Помощь приюту"]', isTop: false },
      contacts: { selector: null, isTop: false },
      profile: { selector: null, isTop: false },
    };

    const target = sections[section as keyof typeof sections];

    if (target?.isTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (target?.selector) {
      const element = document.querySelector(target.selector);
      element?.scrollIntoView({ behavior: "smooth" });
    }

    console.log(`Переход к секции: ${section}`);
  };

  return (
    <header className="absolute top-6 left-0 right-0 z-20 flex justify-center">
      <div className="w-[92%] max-w-7xl bg-white/60 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl px-8 h-[72px] flex items-center justify-between">
        <div className="w-[180px]">
          <img
            src="/logo.svg"
            alt="ЗвероМир"
            className="w-full h-auto object-contain"
          />
        </div>

        <nav className="flex items-center gap-10 text-gray-800 font-medium text-[20px]">
          <button
            onClick={() => scrollToSection("about")}
            className="hover:text-[#7a4f2a] transition cursor-pointer"
          >
            О нас
          </button>

          <button
            onClick={() => scrollToSection("animals")}
            className="hover:text-[#7a4f2a] transition cursor-pointer"
          >
            Питомцы
          </button>

          <button
            onClick={() => scrollToSection("help")}
            className="hover:text-[#7a4f2a] transition cursor-pointer"
          >
            Помощь
          </button>

          <button
            onClick={() => scrollToSection("contacts")}
            className="hover:text-[#7a4f2a] transition cursor-pointer"
          >
            Контакты
          </button>

          <button
            onClick={() => scrollToSection("profile")}
            className="text-2xl hover:scale-110 transition cursor-pointer"
          >
            👤
          </button>
        </nav>
      </div>
    </header>
  );
}
