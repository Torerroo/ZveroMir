"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef } from "react";
import {
  HeartHandshake,
  Coins,
  ShoppingBasket,
  Share2,
  PawPrint,
} from "lucide-react";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest) + suffix);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: 2, ease: "easeOut" });
    }
  }, [isInView, count, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const helpSteps = [
  {
    title: "Финансовая поддержка",
    description:
      "Любое пожертвование идет на корм, лекарства и оплату счетов в ветклиниках.",
    icon: <Coins className="w-8 h-8 text-amber-600" />,
    color: "bg-amber-50",
  },
  {
    title: "Стать волонтером",
    description:
      "Нам всегда нужны руки: погулять с собакой, вычесать кота или помочь с уборкой.",
    icon: <HeartHandshake className="w-8 h-8 text-rose-600" />,
    color: "bg-rose-50",
  },
  {
    title: "Подарки и вещи",
    description:
      "Принимаем корма, теплые пледы, игрушки и средства для ухода за животными.",
    icon: <ShoppingBasket className="w-8 h-8 text-emerald-600" />,
    color: "bg-emerald-50",
  },
  {
    title: "Рассказать друзьям",
    description:
      "Простой репост в соцсетях помогает нашим подопечным быстрее найти дом.",
    icon: <Share2 className="w-8 h-8 text-blue-600" />,
    color: "bg-blue-50",
  },
];

const stats = [
  { label: "Спасенных жизней", value: 450, suffix: "+" },
  { label: "Нашли дом", value: 128, suffix: "" },
  { label: "Волонтеров", value: 32, suffix: "" },
  { label: "Дней заботы", value: 1500, suffix: "+" },
];

export function HelpSection() {
  return (
    <section
      className="relative min-h-screen w-full py-12 overflow-hidden flex flex-col justify-center"
      id="help-section"
      style={{
        backgroundImage: `linear-gradient(to bottom, #e0d6c8 0%, #fcf9f3 82%, #fffef9 100%)`,
      }}
    >
      <div className="absolute top-20 left-10 opacity-5 -rotate-12 pointer-events-none">
        <PawPrint size={120} />
      </div>
      <div className="absolute bottom-20 right-10 opacity-5 rotate-12 pointer-events-none">
        <PawPrint size={160} />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight text-amber-900 sm:text-6xl mb-6">
            Как вы можете помочь?
          </h2>
          <p className="text-lg leading-8 text-amber-800/70 max-w-2xl mx-auto italic font-medium">
            «Маленькое доброе дело лучше, чем большое сочувствие на расстоянии»
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {helpSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group p-8 rounded-4xl bg-white/40 backdrop-blur-md border border-white/50 shadow-xl hover:shadow-2xl transition-all"
            >
              <div
                className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}
              >
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-3">
                {step.title}
              </h3>
              <p className="text-amber-800/80 leading-relaxed text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-y border-amber-900/10 mb-20"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-amber-900 mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs sm:text-sm text-amber-800/60 font-bold uppercase tracking-widest leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-block p-1 rounded-full bg-linear-to-r from-amber-500 to-orange-500 shadow-lg shadow-orange-200">
            <button className="px-12 py-5 rounded-full bg-white hover:bg-transparent hover:text-white transition-all text-amber-600 font-bold text-xl flex items-center gap-3 cursor-pointer">
              Поддержать проект
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                ❤️
              </motion.span>
            </button>
          </div>
          <p className="mt-6 text-sm text-amber-900/40 font-medium italic">
            * каждый вклад делает чью-то жизнь счастливее
          </p>
        </motion.div>
      </div>
    </section>
  );
}
