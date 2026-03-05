"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#fffef9] via-[#f5efe5] to-[#e0d6c8] px-4">
      <div className="bg-white/70 backdrop-blur-md p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-lg w-full text-center ring-1 ring-black/5">
        <h2 className="text-3xl font-bold text-neutral-900 mb-3 tracking-tight">
          Упс! Что-то пошло не так
        </h2>

        <p className="text-neutral-600 mb-8 leading-relaxed">
          Произошла непредвиденная ошибка. Мы уже машем хвостом в сторону
          проблемы, чтобы всё исправить.
        </p>

        <div className="mb-8 p-3 bg-red-50 rounded-xl border border-red-100 text-xs font-mono text-red-600 overflow-hidden text-ellipsis whitespace-nowrap">
          {error.message || "Unknown error"}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-amber-900 text-white rounded-2xl font-semibold shadow-lg shadow-amber-900/20 hover:bg-amber-800 transition-all active:scale-95"
          >
            Повторить попытку
          </button>

          <Link
            href="/"
            className="px-8 py-3 bg-white text-neutral-800 rounded-2xl font-semibold shadow-sm ring-1 ring-neutral-200 hover:bg-neutral-50 transition-all active:scale-95"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
