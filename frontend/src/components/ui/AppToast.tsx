"use client";

import { toast } from "sonner";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

const ToastContainer = ({
  id,
  message,
  type,
}: {
  id: string | number;
  message: string;
  type: ToastType;
}) => {
  const styles = {
    success: {
      icon: <CheckCircle2 className="text-[#7a4f2a]" size={32} />,
      border: "border-[#eaddd0]",
    },
    error: {
      icon: <AlertCircle className="text-red-500" size={32} />,
      border: "border-red-100",
    },
    info: {
      icon: <Info className="text-blue-400" size={32} />,
      border: "border-blue-50",
    },
  };

  const currentStyle = styles[type];

  return (
    <div
      className={`flex w-[450px] max-w-[95vw] bg-white shadow-[0_15px_40px_rgba(122,79,42,0.12)] border ${currentStyle.border} rounded-4xl overflow-hidden pointer-events-auto group`}
    >
      <div className="p-6 flex items-center gap-5 flex-1 select-none cursor-grab active:cursor-grabbing">
        <div className="shrink-0">{currentStyle.icon}</div>
        <p className="text-[18px] font-bold text-[#7a4f2a] leading-[1.2] tracking-tight">
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={() => toast.dismiss(id)}
        className="px-6 border-l border-[#fdfaf7] text-[#7a4f2a]/20 hover:text-[#7a4f2a] transition-colors cursor-pointer flex items-center justify-center group/btn"
      >
        <X
          size={24}
          className="transition-transform group-hover/btn:scale-110"
        />
      </button>
    </div>
  );
};

export const appToast = {
  success: (msg: string) =>
    toast.custom(
      (id) => <ToastContainer id={id} message={msg} type="success" />,
      { duration: 5000 },
    ),
  error: (msg: string) =>
    toast.custom(
      (id) => <ToastContainer id={id} message={msg} type="error" />,
      { duration: 6000 },
    ),
  info: (msg: string) =>
    toast.custom((id) => <ToastContainer id={id} message={msg} type="info" />, {
      duration: 5000,
    }),
};
