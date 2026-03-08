"use client";

import { useState } from "react";
import { User as UserIcon, LogOut, Loader2 } from "lucide-react";
import { AuthModal } from "../modals/AuthModal";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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

  return (
    <>
      <header className={containerStyles}>
        <div className={wrapperStyles}>
          <Link href="/" className="shrink-0 w-[180px] cursor-pointer">
            <img src="/logo.svg" alt="ЗвероМир" className="w-full h-auto" />
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-8 text-gray-800 font-medium text-[19px]">
              {navItems.map((item) => {
                if (pathname === "/") {
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        document
                          .getElementById(item.id)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="hover:text-[#7a4f2a] transition-colors cursor-pointer outline-none"
                    >
                      {item.name}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={`/#${item.id}`}
                    className="hover:text-[#7a4f2a] transition-colors cursor-pointer outline-none"
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button
                disabled={isLoading}
                onClick={() => !isAuth && setIsAuthModalOpen(true)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#7a4f2a]/10 transition-all cursor-pointer group outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-[#7a4f2a]/20">
                  {isLoading ? (
                    <Loader2
                      size={18}
                      className="animate-spin text-amber-800"
                    />
                  ) : (
                    <UserIcon
                      size={20}
                      className="text-gray-800 group-hover:text-[#7a4f2a]"
                    />
                  )}
                </div>
                <span className="text-[18px] font-medium text-gray-800 group-hover:text-[#7a4f2a] whitespace-nowrap">
                  {isAuth ? user?.fullName?.split(" ")[0] : "Войти"}
                </span>
              </button>

              {isAuth && !isLoading && (
                <button
                  onClick={() => logout()}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <LogOut size={22} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
