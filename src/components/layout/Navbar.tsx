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
        scrolled ? "glass shadow-card" : "bg-background/60 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-sun shadow-glow transition-transform group-hover:scale-110">
              <Sun className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold text-secondary md:text-lg">
              Matri Shakti
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-primary md:text-xs">
              Infrastructure
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-secondary"
              activeProps={{ className: "text-primary bg-accent" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button variant="hero" size="sm" onClick={() => setIsApplyModalOpen(true)}>
            Apply Now
          </Button>
        </div>

        <button
          className="rounded-md p-2 lg:hidden"
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
