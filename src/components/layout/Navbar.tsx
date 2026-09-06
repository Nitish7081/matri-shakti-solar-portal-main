import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Phone, Mail, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApplyModal } from "@/components/shared/ApplyModal";

const links = [
  { to: "/", label: "Home" },
  { to: "/solar-panels", label: "Solar Systems" },
  { to: "/yojana", label: "PM Yojana" },
  { to: "/calculator", label: "Subsidy" },
  { to: "/services", label: "Services" },
  { to: "/emi", label: "EMI" },
  { to: "/gallery", label: "Gallery" },
  { to: "/complaint", label: "Support" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappUrl =
    "https://wa.me/918948933657?text=" +
    encodeURIComponent("Hello Matri-Shakti Infrastructure, I want to inquire about Solar Rooftop Installation & PM Surya Ghar Subsidy.");

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Notification / Quick Contact Bar - Light, Cheerful, High-Contrast */}
      <div className="bg-gradient-to-r from-amber-100/90 via-orange-50 to-emerald-100/90 text-slate-800 text-xs py-1.5 px-4 border-b border-orange-200/70 hidden sm:block shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
              UPNEDA Registered Partner
            </span>
            <span className="font-semibold text-slate-800 text-xs">
              PM Surya Ghar Muft Bijli Yojana · Up to ₹1,08,000 Subsidy
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-600 font-medium">
              <MapPin className="h-3.5 w-3.5 text-orange-600" /> Paniyara, Maharajganj & Gorakhpur, UP
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href="mailto:matrishaktiinfrastructure@gmail.com"
              className="hidden lg:flex items-center gap-1.5 text-slate-700 hover:text-orange-600 transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-orange-600" />
              <span>matrishaktiinfrastructure@gmail.com</span>
            </a>
            <div className="h-3.5 w-[1px] bg-orange-300/80 hidden lg:block" />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold transition-colors"
            >
              <FaWhatsapp className="h-3.5 w-3.5 text-emerald-600" />
              <span>WhatsApp: 8948933657</span>
            </a>
            <div className="h-3.5 w-[1px] bg-orange-300/80" />
            <a
              href="tel:+918948933657"
              className="flex items-center gap-1 text-orange-700 hover:text-orange-800 font-black transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-orange-600" />
              <span>Call: +91 89489 33657</span>
            </a>
          </div>
        </div>
      </div>

      {/* Colorful Solar Ambient Glow Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-500 via-rose-500 to-emerald-400" />

      {/* Main Nav Container - Crisp Light Glassmorphism */}
      <div
        className={cn(
          "w-full transition-all duration-300",
          scrolled ? "bg-white/95 backdrop-blur-md shadow-md border-b border-orange-100" : "bg-white/90 backdrop-blur-md border-b border-slate-100",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-2.5 sm:px-6">
          {/* Prominent Company Brand Logo - Large, Bold & Attractive */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-xl shadow-orange-500/30 transition-transform duration-300 group-hover:scale-105 border-2 border-white">
                <Sun className="h-7 w-7 sm:h-8 sm:w-8 text-slate-950 stroke-[2.5] animate-[spin_16s_linear_infinite]" />
              </div>
            </div>
            <div className="leading-tight">
              <div className="font-display text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-950 flex items-center gap-1.5">
                <span>MATRI-SHAKTI</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs sm:text-sm font-black uppercase tracking-[0.18em] bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                  INFRASTRUCTURE
                </span>
                <span className="hidden sm:inline-block text-[10px] font-extrabold text-emerald-800 uppercase tracking-tight bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
                  Solar & EPC
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-0.5 xl:gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 transition-all hover:bg-orange-500/10 hover:text-orange-600"
                activeProps={{ className: "text-orange-600 bg-orange-500/10 font-extrabold shadow-xs" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden lg:flex items-center gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 shadow-xs transition hover:bg-emerald-100 hover:scale-105"
            >
              <FaWhatsapp className="h-4 w-4 text-emerald-600" />
              <span>8948933657</span>
            </a>
            <Button
              variant="hero"
              size="sm"
              onClick={() => setIsApplyModalOpen(true)}
              className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs px-4 py-2 rounded-xl shadow-md shadow-orange-500/25 transition-all hover:scale-105 cursor-pointer"
            >
              Apply Now ⚡
            </Button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm"
            >
              <FaWhatsapp className="h-5 w-5" />
            </a>
            <a
              href="tel:+918948933657"
              aria-label="Call"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-sm font-bold"
            >
              <Phone className="h-4 w-4" />
            </a>
            <button
              className="rounded-xl p-2 text-foreground hover:bg-orange-50 border border-slate-200 transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5 text-orange-600" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-orange-200 bg-white/98 shadow-xl lg:hidden backdrop-blur-lg"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-bold text-slate-800 transition hover:bg-orange-50 hover:text-orange-600"
                  activeProps={{ className: "text-orange-600 bg-orange-100/70 font-extrabold" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Button
                  onClick={() => {
                    setOpen(false);
                    setIsApplyModalOpen(true);
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  Apply for Solar Subsidy ⚡
                </Button>
                <div className="flex gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs py-2 shadow-sm"
                  >
                    <FaWhatsapp className="h-4 w-4" /> WhatsApp
                  </a>
                  <a
                    href="tel:+918948933657"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs py-2 shadow-sm"
                  >
                    <Phone className="h-4 w-4 text-amber-400" /> Call Now
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ApplyModal
        open={isApplyModalOpen}
        onOpenChange={setIsApplyModalOpen}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </header>
  );
}
