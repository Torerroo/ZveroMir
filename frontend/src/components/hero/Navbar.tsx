"use client";

import { useState } from "react";
import { User, Menu, X } from "lucide-react";
import { AuthModal } from "../modals/AuthModal";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = false;

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
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
    <>
      <header className="absolute top-6 left-0 right-0 z-50 flex justify-center px-8">
        <div className="w-full max-w-7xl bg-white/60 backdrop-blur-md border border-white/40 shadow-lg rounded-4xl px-8 h-[80px] flex items-center justify-between">
          <div
            className="shrink-0 w-[180px] cursor-pointer"
            onClick={() => scrollToSection("top")}
          >
            <img
              src="/logo.svg"
              alt="ЗвероМир"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <nav className="hidden lg:flex items-center gap-8 text-gray-800 font-medium text-[19px]">
              {["О нас", "Питомцы", "Помощь", "Контакты"].map((item, i) => (
                <button
                  key={item}
                  onClick={() =>
                    scrollToSection(
                      [
                        "top",
                        "animals-section",
                        "help-section",
                        "contacts-section",
                      ][i],
                    )
                  }
                  className="hover:text-[#7a4f2a] transition-colors cursor-pointer outline-none whitespace-nowrap"
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#7a4f2a]/10 transition-all cursor-pointer group outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-[#7a4f2a]/20 transition-all">
                  <User
                    size={20}
                    className="text-gray-800 group-hover:text-[#7a4f2a] transition-colors"
                    strokeWidth={2}
                  />
                </div>
                <span className="text-[18px] font-medium text-gray-800 group-hover:text-[#7a4f2a] transition-colors whitespace-nowrap">
                  {isAuthenticated ? "Профиль" : "Войти"}
                </span>
              </button>

              <button
                className="lg:hidden p-2 text-gray-800 cursor-pointer outline-none hover:bg-black/5 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-[90px] left-4 right-4 bg-white/98 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-[2.5rem] p-8 flex flex-col gap-2 lg:hidden"
            >
              {["О нас", "Питомцы", "Помощь", "Контакты"].map((item, i) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() =>
                    scrollToSection(
                      [
                        "top",
                        "animals-section",
                        "help-section",
                        "contacts-section",
                      ][i],
                    )
                  }
                  className="w-full py-4 text-center text-xl font-bold text-gray-800 hover:text-[#7a4f2a] hover:bg-[#7a4f2a]/5 rounded-2xl transition-all cursor-pointer active:scale-95"
                >
                  {item}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
