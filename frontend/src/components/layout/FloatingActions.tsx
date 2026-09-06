import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "918948933657"; // Use country code without '+' or '00'
const WHATSAPP_MESSAGE =
  "Hello Matri-Shakti Infrastructure,\nI want to know about PM Surya Ghar Rooftop Solar Scheme & Subsidy.";

export function FloatingActions() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* WhatsApp Action */}
      <div className="relative group pointer-events-auto flex items-center gap-2">
        <span className="hidden sm:inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-lg border border-emerald-500/30 whitespace-nowrap">
          WhatsApp: 8948933657
        </span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp with Matri-Shakti Infrastructure"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        >
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none opacity-75" />
          <FaWhatsapp className="h-7 w-7 relative z-10" />
        </a>
      </div>

      {/* Direct Call Action */}
      <div className="relative group pointer-events-auto flex items-center gap-2">
        <span className="hidden sm:inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-lg border border-amber-500/30 whitespace-nowrap">
          Call: +91 89489 33657
        </span>
        <a
          href="tel:+918948933657"
          aria-label="Call Matri-Shakti Infrastructure"
          className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 shadow-xl shadow-orange-500/30 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        >
          <Phone className="h-6 w-6 stroke-[2.5]" />
        </a>
      </div>
    </div>
  );
}