import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn("mb-12 max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left")}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-100/90 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-orange-800 shadow-xs",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-orange-600 animate-pulse" />
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl font-black text-slate-950 md:text-4xl lg:text-5xl tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-slate-600 md:text-lg leading-relaxed font-normal">{description}</p>
      )}
    </motion.div>
  );
}

export function PageHero({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/90 via-orange-50/50 to-white py-16 md:py-24 border-b border-orange-100">
      <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-orange-400/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
      <div className="relative mx-auto max-w-4xl px-4 text-center md:px-6">
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-100/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-orange-800 shadow-xs backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
            {eyebrow}
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl font-black text-slate-950 md:text-5xl lg:text-6xl tracking-tight"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base text-slate-600 md:text-lg leading-relaxed font-normal"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
