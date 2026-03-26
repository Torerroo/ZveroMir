"use client";

import { useState } from "react";
import { User as UserIcon, Menu, X, LogOut, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthModal } from "../modals/AuthModal/AuthModal";

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuth, user, logout, isLoading } = useAuthStore();
  const pathname = usePathname();

  const containerStyles = transparent
    ? "absolute top-6 left-0 right-0 z-50 flex justify-center px-8"
    : "sticky top-0 z-50 flex justify-center w-full bg-white/60 backdrop-blur-md border-b border-white/40 px-8 h-[80px]";

  const wrapperStyles = transparent
    ? "w-full max-w-7xl bg-white/60 backdrop-blur-md border border-white/40 shadow-lg rounded-4xl px-8 h-[80px] flex items-center justify-between"
    : "w-full max-w-7xl flex items-center justify-between";

  const navItems = [
    { name: "О нас", id: "top" },
    { name: "Питомцы", id: "animals-section" },
    { name: "Помощь", id: "help-section" },
    { name: "Контакты", id: "contacts-section" },
  ];

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    if (pathname === "/") {
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const userLabel = user?.fullName?.split(" ")[0] || "Профиль";
  const authButtonLabel = isAuth ? userLabel : "Войти";
  const buttonLabel = isLoading ? "" : authButtonLabel;

  return (
    <>
      <header className={containerStyles}>
        <div className={wrapperStyles}>
          <Link
            href="/"
            className="shrink-0 w-[180px] cursor-pointer"
            onClick={() => handleNavClick("top")}
          >
            <img
              src="/logo.svg"
              alt="ЗвероМир"
              className="w-full h-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-4 lg:gap-6">
            <nav className="hidden lg:flex items-center gap-8 text-gray-800 font-medium text-[19px]">
              {navItems.map((item) =>
                pathname === "/" ? (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="hover:text-[#7a4f2a] transition-colors cursor-pointer outline-none whitespace-nowrap"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.id}
                    href={`/#${item.id}`}
                    className="hover:text-[#7a4f2a] transition-colors cursor-pointer outline-none whitespace-nowrap"
                  >
                    {item.name}
                  </Link>
                ),
              )}
            </nav>

            <div className="flex items-center gap-2">
              <button
                disabled={isLoading}
                onClick={() => !isAuth && setIsAuthModalOpen(true)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#7a4f2a]/10 transition-all cursor-pointer group outline-none disabled:opacity-70"
              >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-[#7a4f2a]/20 transition-all">
                  {isLoading ? (
                    <Loader2
                      size={18}
                      className="animate-spin text-amber-800"
                    />
                  ) : (
                    <UserIcon
                      size={20}
                      className="text-gray-800 group-hover:text-[#7a4f2a] transition-colors"
                      strokeWidth={2}
                    />
                  )}
                </div>
                <span className="text-[18px] font-medium text-gray-800 group-hover:text-[#7a4f2a] transition-colors whitespace-nowrap min-w-[50px]">
                  {buttonLabel}
                </span>
              </button>

              {!isLoading && isAuth && (
                <button
                  onClick={() => logout()}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer outline-none"
                  title="Выйти"
                >
                  <LogOut size={22} />
                </button>
              )}

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
              {navItems.map((item, i) =>
                pathname === "/" ? (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleNavClick(item.id)}
                    className="w-full py-4 text-center text-xl font-bold text-gray-800 hover:text-[#7a4f2a] hover:bg-[#7a4f2a]/5 rounded-2xl transition-all cursor-pointer active:scale-95"
                  >
                    {item.name}
                  </motion.button>
                ) : (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/#${item.id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-4 text-center text-xl font-bold text-gray-800 hover:text-[#7a4f2a] hover:bg-[#7a4f2a]/5 rounded-2xl transition-all cursor-pointer active:scale-95"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ),
              )}

              {!isLoading && isAuth && (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-4 text-center text-xl font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                  Выйти
                </button>
              )}
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
