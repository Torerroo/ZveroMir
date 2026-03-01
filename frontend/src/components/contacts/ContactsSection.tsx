"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Users, Send, MapPin } from "lucide-react";

const CONTACTS = [
  {
    icon: <Phone size={24} />,
    label: "Позвонить нам",
    value: "+7 (999) 000-00-00",
    color: "bg-green-50 text-green-700",
  },
  {
    icon: <Mail size={24} />,
    label: "Написать на почту",
    value: "hello@zveromir.ru",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: <Send size={24} />,
    label: "Telegram канал",
    value: "@zveromir_help",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: <Users size={24} />,
    label: "Мы ВКонтакте",
    value: "vk.com/zveromir",
    color: "bg-indigo-50 text-indigo-600",
  },
];

export function ContactsSection() {
  return (
    <section
      className="relative w-full py-6 px-6 lg:px-8 overflow-hidden"
      id="contacts-section"
      style={{
        backgroundImage: `linear-gradient(to bottom, #fffef9 0%, #fcf9f3 82%, #e0d6c8 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight"
            >
              Остались вопросы? <br />
              <span className="text-amber-800">Мы всегда на связи</span>
            </motion.h2>
            <p className="text-lg text-gray-600 font-medium">
              Приезжайте в гости к хвостикам или пишите нам в любое время.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-white/50 backdrop-blur-sm border border-white p-4 rounded-3xl shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Наш адрес
              </p>
              <p className="text-base font-bold text-gray-800">
                г. Москва, ул. Пушкина, 10
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTACTS.map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-md border border-white p-6 rounded-4xl shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div
                className={`w-12 h-12 rounded-xl ${contact.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                {contact.icon}
              </div>
              <p className="text-sm text-gray-500 font-semibold mb-1">
                {contact.label}
              </p>
              <p className="text-lg font-bold text-gray-900 wrap-break-word">
                {contact.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-14 w-auto opacity-40 grayscale"
            />
            <p className="text-gray-400 text-sm font-medium">
              © 2026 ЗвероМир. Сделано с любовью.
            </p>
          </div>

          <div className="flex gap-6 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em]">
            <button className="hover:text-amber-800 transition-colors cursor-pointer">
              Политика
            </button>
            <button className="hover:text-amber-800 transition-colors cursor-pointer">
              Оферта
            </button>
            <button className="hover:text-amber-800 transition-colors cursor-pointer">
              Помощь
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
