import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun } from "lucide-react";
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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass shadow-card" : "bg-background/80 backdrop-blur-md",
      )}
    >
      {/* Colorful Solar Ambient Glow Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-500 via-rose-500 to-emerald-400" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-md shadow-orange-500/30 transition-transform group-hover:scale-110">
              <Sun className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold text-secondary md:text-lg tracking-tight">
              Matri Shakti
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent md:text-xs">
              Infrastructure
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-foreground/80 transition-all hover:bg-orange-500/10 hover:text-orange-600"
              activeProps={{ className: "text-orange-600 bg-orange-500/10 font-bold" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            variant="hero"
            size="sm"
            onClick={() => setIsApplyModalOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all hover:scale-105"
          >
            Apply Now ⚡
          </Button>
        </div>

        <button
          className="rounded-md p-2 lg:hidden text-foreground hover:bg-accent"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent"
                  activeProps={{ className: "text-primary bg-accent" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
              <Button
                variant="hero"
                className="mt-2 w-full"
                onClick={() => {
                  setOpen(false);
                  setIsApplyModalOpen(true);
                }}
              >
                Apply Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ApplyModal open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen} />
    </header>
  );
}
