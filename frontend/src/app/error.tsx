"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#fffef9] to-[#e0d6c8]">
      <div className="bg-white/90 p-8 rounded-3xl shadow-xl max-w-md text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">
          Что-то пошло не так
        </h2>
        <p className="text-gray-600">
          Не удалось загрузить данные. Попробуйте позже.
        </p>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
