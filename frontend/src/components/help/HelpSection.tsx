export async function HelpSection() {
  return (
    <section
      className="min-h-screen w-full"
      aria-label="Помощь приюту"
      id="help-section"
      style={{
        backgroundImage: `linear-gradient(to bottom,
          #e0d6c8 0%,
          #e5dccf 12%,
          #ebe3d8 30%,
          #f2ebe0 48%,
          #f8f4ec 65%,
          #fcf9f3 82%,
          #fffef9 100%
        )`,
      }}
    >
      <div className="mx-auto w-full px-30 py-12">
        <div className="relative mb-16">
          <h2 className="text-center text-4xl font-semibold tracking-tight text-amber-900/80 sm:text-5xl">
            Помощь приюту
          </h2>

          <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-48 h-4">
            <span
              className="absolute left-0 bottom-0 w-full h-[2px] bg-green-500/70"
              style={{
                transform: "scaleX(0.95) scaleY(1.5)",
                borderRadius: "50%",
                filter: "drop-shadow(0 2px 2px rgba(34, 197, 94, 0.2))",
              }}
            />
          </div>
        </div>

        <div className="mt-12 text-center text-gray-700 text-xl">
          Содержимое раздела помощи
        </div>
      </div>
    </section>
  );
}
