"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "@/api/auth/auth.schema";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      setServerError(null);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalStyle;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const onSubmit = async (data: LoginData) => {
    try {
      setServerError(null);
      await login(data);
      onClose();
    } catch (err: any) {
      if (err instanceof Error && err.message.includes('{"error"')) {
        try {
          const parsed = JSON.parse(err.message);
          setServerError(parsed.error?.message || "Ошибка авторизации");
          return;
        } catch {
          setServerError(err.message);
          return;
        }
      }

      setServerError(
        err.error?.message || err.message || "Непредвиденная ошибка",
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition cursor-pointer"
            >
              <X size={28} />
            </button>

            <motion.div layout="position">
              <h2 className="text-3xl font-bold text-amber-900 mb-2">
                Войти в профиль
              </h2>
              <p className="text-gray-500 mb-8">
                Введите свои данные для авторизации
              </p>
            </motion.div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <LayoutGroup>
                <motion.div layout>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                    className={`w-full h-14 px-6 bg-gray-100 rounded-2xl outline-none border-2 transition-all text-gray-900 placeholder:text-gray-400 ${
                      errors.email
                        ? "border-red-300"
                        : "border-transparent focus:border-amber-800/20 focus:bg-white"
                    }`}
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-xs mt-2 ml-2 font-medium overflow-hidden"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div layout>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="Пароль"
                    className={`w-full h-14 px-6 bg-gray-100 rounded-2xl outline-none border-2 transition-all text-gray-900 placeholder:text-gray-400 ${
                      errors.password
                        ? "border-red-300"
                        : "border-transparent focus:border-amber-800/20 focus:bg-white"
                    }`}
                  />
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-xs mt-2 ml-2 font-medium overflow-hidden"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <AnimatePresence>
                  {serverError && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-red-600 text-sm font-bold bg-red-50 px-4 py-3 rounded-2xl border border-red-100 text-center"
                    >
                      {serverError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  layout
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-amber-800 text-white rounded-2xl font-bold mt-2 cursor-pointer hover:bg-amber-900 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    "Продолжить"
                  )}
                </motion.button>
              </LayoutGroup>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
