import Link from "next/link";
import Image from "next/image";

import type { Animal } from "@/api/animals";

type Props = {
  animal: Animal;
};

export function AnimalCard({ animal }: Props) {
  return (
    <Link
      href={`/animals/${animal.id}`}
      aria-label={`Открыть: ${animal.name}`}
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white/30"
    >
      <article className="overflow-hidden rounded-3xl bg-white/65 ring-1 ring-black/5 backdrop-blur transition-all duration-300 will-change-transform hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.16)] shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <Image
            src={animal.imageUrl}
            alt={animal.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent opacity-90 transition group-hover:opacity-100" />
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-semibold tracking-tight text-neutral-900">
            {animal.name}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-neutral-700">
            {animal.description}
          </p>
        </div>
      </article>
    </Link>
  );
}
