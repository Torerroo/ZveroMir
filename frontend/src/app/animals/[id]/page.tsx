import Link from "next/link";

type Props = {
  params: { id: string };
};

export default function AnimalPage({ params }: Props) {
  const { id } = params;

  return (
    <main className="min-h-screen bg-linear-to-b from-[#fffef9] via-[#f5efe5] to-[#e0d6c8]">
      <div className="mx-auto w-full max-w-3xl px-4 py-14">
        <div className="rounded-2xl bg-white/60 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.10)] ring-1 ring-black/5 backdrop-blur">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Страница животного
          </h1>
          <p className="mt-3 text-neutral-800">
            ID: <span className="font-mono font-semibold">{id}</span>
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg bg-amber-900/90 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-900"
          >
            ← На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
