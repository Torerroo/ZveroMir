import { api } from "@/api";
import Link from "next/link";
import { SearchX, ArrowLeft } from "lucide-react";
import { AnimalDetailClient } from "./AnimalDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AnimalPage({ params }: Props) {
  const { id } = await params;
  const animal = await api.animals.getById(id);

  if (!animal) {
    return (
      <div className="relative min-h-screen bg-[#F5F0E8] overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-amber-200/15 blur-[120px] rounded-full" />

        <main className="relative z-10 mx-auto max-w-7xl px-6 flex justify-center pt-[18vh]">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="relative mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.04)] ring-1 ring-black/3">
              <SearchX size={40} className="text-amber-900/30" />
              <div className="absolute inset-0 rounded-full border-2 border-amber-900/10 animate-ping" />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tight text-neutral-900">
                Питомец не найден
              </h1>
              <p className="text-lg text-neutral-500/80 leading-relaxed italic font-medium">
                «Возможно, этот хвостик уже нашел свой теплый дом и любящую
                семью».
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/#animals-section"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-amber-900 text-white rounded-2xl font-bold shadow-2xl shadow-amber-900/20 hover:bg-amber-950 hover:scale-[1.02] transition-all active:scale-95"
              >
                <ArrowLeft
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Вернуться в каталог
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <AnimalDetailClient animal={animal} />
    </div>
  );
}
