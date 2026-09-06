import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Battery,
  Building2,
  Calendar,
  CheckCircle2,
  Cpu,
  Factory,
  Gauge,
  Home as HomeIcon,
  IndianRupee,
  Leaf,
  ShieldCheck,
  Sparkles,
  Sun,
  Wrench,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/shared/Section";
import { Counter } from "@/components/shared/Counter";

import heroImage from "@/assets/hero-solar.jpg";
import panel from "@/assets/solar-panel.png";
import g1 from "@/assets/gallery-1.jpg";
import g4 from "@/assets/gallery-4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Matri Shakti Infrastructure — PM Surya Ghar Solar Partner in UP" },
      {
        name: "description",
        content:
          "Install rooftop solar under PM Surya Ghar Muft Bijli Yojana with up to ₹1,08,000 subsidy and easy EMI. UPNEDA registered vendor across Uttar Pradesh.",
      },
      { property: "og:title", content: "Matri Shakti Infrastructure — Solar Installation" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const subsidies = [
  { kw: "1 KW", state: 15000, center: 30000, total: 45000, tag: "1-2 Rooms", color: "from-emerald-500 to-teal-600", badgeBg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20", glow: "hover:shadow-emerald-500/20" },
  { kw: "2 KW", state: 30000, center: 60000, total: 90000, tag: "Popular Choice", color: "from-cyan-500 to-blue-600", badgeBg: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20", glow: "hover:shadow-cyan-500/20" },
  { kw: "3 KW", state: 30000, center: 78000, total: 108000, tag: "⭐ Max ₹1.08L Subsidy", color: "from-amber-500 to-orange-600", badgeBg: "bg-amber-500/10 text-amber-700 border-amber-500/30", glow: "hover:shadow-orange-500/30", featured: true },
  { kw: "4 KW", state: 30000, center: 78000, total: 108000, tag: "Heavy Load / AC", color: "from-purple-500 to-indigo-600", badgeBg: "bg-purple-500/10 text-purple-700 border-purple-500/20", glow: "hover:shadow-purple-500/20" },
  { kw: "5 KW", state: 30000, center: 78000, total: 108000, tag: "Villas & Big Homes", color: "from-rose-500 to-pink-600", badgeBg: "bg-rose-500/10 text-rose-700 border-rose-500/20", glow: "hover:shadow-rose-500/20" },
];

const benefits = [
  {
    icon: IndianRupee,
    title: "Reduce Electricity Bill",
    desc: "Save up to 90% every month with solar generation & net-metering.",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
    borderHover: "hover:border-emerald-500/40",
  },
  {
    icon: Calendar,
    title: "25 Years Panel Life",
    desc: "Long warranty on Tier-1 mono PERC bi-facial solar panels.",
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
    borderHover: "hover:border-amber-500/40",
  },
  {
    icon: Wrench,
    title: "Easy EMI Available",
    desc: "Finance on simple monthly instalments with low bank interest rates.",
    gradient: "from-purple-500 to-indigo-600",
    shadow: "shadow-purple-500/20",
    borderHover: "hover:border-purple-500/40",
  },
  {
    icon: BadgeCheck,
    title: "Government Subsidy",
    desc: "Combined Central DBT + UP State UPNEDA direct into bank account.",
    gradient: "from-blue-500 to-cyan-600",
    shadow: "shadow-blue-500/20",
    borderHover: "hover:border-blue-500/40",
  },
  {
    icon: ShieldCheck,
    title: "Professional Installation",
    desc: "UPNEDA registered vendor with certified electrical engineers.",
    gradient: "from-rose-500 to-orange-500",
    shadow: "shadow-rose-500/20",
    borderHover: "hover:border-rose-500/40",
  },
  {
    icon: Zap,
    title: "Fast Approval",
    desc: "Quick paperwork, feasibility clearance, and bi-directional net metering.",
    gradient: "from-teal-500 to-emerald-600",
    shadow: "shadow-teal-500/20",
    borderHover: "hover:border-teal-500/40",
  },
];

const services = [
  { icon: HomeIcon, title: "Residential Solar", tag: "Rooftop Homes", gradient: "from-amber-500 to-orange-600" },
  { icon: Building2, title: "Commercial Solar", tag: "Offices & Shops", gradient: "from-blue-500 to-cyan-600" },
  { icon: Factory, title: "Industrial Solar", tag: "Mills & Plants", gradient: "from-purple-500 to-indigo-600" },
  { icon: Zap, title: "On-Grid Systems", tag: "UPPCL Net-Meter", gradient: "from-emerald-500 to-teal-600" },
  { icon: Battery, title: "Off-Grid Systems", tag: "Solar Battery Backup", gradient: "from-rose-500 to-amber-600" },
  { icon: Cpu, title: "Hybrid Systems", tag: "Grid + Storage", gradient: "from-cyan-500 to-blue-600" },
  { icon: Gauge, title: "Solar Water Pump", tag: "PM-KUSUM Farms", gradient: "from-green-500 to-emerald-600" },
  { icon: Sparkles, title: "Solar Atta Chakki", tag: "Village Business", gradient: "from-yellow-500 to-orange-600" },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Background Image + Multi-layered Ambient Colorful Glow */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Rooftop solar panels at sunrise"
            className="h-full w-full object-cover opacity-35"
            width={1920}
            height={1200}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-amber-950/70" />
          <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-500/15 to-teal-600/15 blur-3xl pointer-events-none" />
        </div>

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 py-24 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              {/* Vibrant Pills */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 shadow-sm backdrop-blur">
                  <Sun className="h-3.5 w-3.5 text-amber-400" /> UPNEDA Registered Vendor
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur">
                  <Zap className="h-3 w-3 text-emerald-400" /> PM Surya Ghar Partner
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 font-display text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl tracking-tight"
              >
                PM Surya Ghar<br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
                  Muft Bijli Yojana
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5 max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed"
              >
                Install rooftop solar and slash your electricity bill by up to 90%.
                Receive up to <strong className="text-amber-300 font-bold">₹1,08,000 subsidy</strong> directly in your bank account with low-cost bank loans — powered by Matri Shakti Infrastructure.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-3.5"
              >
                <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/30 transition-all hover:scale-105">
                  <Link to="/apply">
                    Apply Now ⚡ <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-100 backdrop-blur text-sm">
                  <Link to="/calculator">Get Free Consultation</Link>
                </Button>
              </motion.div>

              {/* Colorful Modern Counter Cards */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 border-t border-slate-800 pt-6"
              >
                <div className="p-3 sm:p-4 rounded-xl border border-emerald-500/25 bg-emerald-950/20 backdrop-blur">
                  <div className="font-display text-2xl font-black text-emerald-400 md:text-3xl">
                    <Counter end={500} suffix="+" />
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs font-medium text-emerald-200/80">Installations Done</div>
                </div>

                <div className="p-3 sm:p-4 rounded-xl border border-amber-500/25 bg-amber-950/20 backdrop-blur">
                  <div className="font-display text-2xl font-black text-amber-400 md:text-3xl">
                    <Counter end={25} suffix=" yrs" />
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs font-medium text-amber-200/80">Panel Performance</div>
                </div>

                <div className="p-3 sm:p-4 rounded-xl border border-cyan-500/25 bg-cyan-950/20 backdrop-blur">
                  <div className="font-display text-2xl font-black text-cyan-400 md:text-3xl">
                    <Counter end={108000} suffix="" />
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs font-medium text-cyan-200/80">Max Subsidy ₹</div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 blur-2xl" />
              <motion.img
                src={panel}
                alt="Solar panel"
                className="relative mx-auto w-full max-w-md drop-shadow-2xl"
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                width={900}
                height={900}
              />
              <div className="absolute -right-2 top-6 rounded-2xl border border-emerald-500/30 bg-slate-900/85 px-4 py-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Save Monthly</div>
                    <div className="font-display text-base font-bold text-emerald-400">₹6,000/mo</div>
                  </div>
                </div>
              </div>
              <div className="absolute -left-2 bottom-8 rounded-2xl border border-teal-500/30 bg-slate-900/85 px-4 py-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Green Clean Energy</div>
                    <div className="font-display text-base font-bold text-teal-300">3 Tons CO₂/yr</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <Section className="bg-white">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src={g1}
              alt="Solar installation team"
              className="rounded-3xl shadow-xl border border-slate-100"
              loading="lazy"
              width={1200}
              height={900}
            />
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-white shadow-xl shadow-orange-500/25 md:block">
              <div className="font-display text-3xl font-black">
                <Counter end={500} suffix="+" />
              </div>
              <div className="text-xs uppercase font-bold tracking-wider">Happy Households</div>
            </div>
          </motion.div>

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-600">
              About Us
            </div>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 md:text-4xl tracking-tight">
              Matri Shakti Infrastructure
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              We are a UPNEDA registered rooftop solar vendor delivering end-to-end
              installation services under the PM Surya Ghar Muft Bijli Yojana. From
              residential rooftops to commercial and industrial projects, our
              engineered systems help you cut electricity bills and go green.
            </p>
            <ul className="mt-6 grid gap-3.5 sm:grid-cols-2">
              {[
                "UPNEDA Registered Vendor",
                "Professional Installation",
                "Government Approved",
                "Residential Solar",
                "Commercial Solar",
                "Industrial Projects",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20">
                <Link to="/about">Learn more</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-xs font-semibold border-slate-300">
                <Link to="/services">Our services</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* SUBSIDY */}
      <Section className="bg-gradient-to-b from-slate-50 via-orange-50/25 to-slate-50 relative overflow-hidden">
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />
        <SectionHeading
          eyebrow="Direct DBT Subsidy"
          title="Up to ₹1,08,000 Subsidy on Rooftop Solar"
          description="Central + state benefits under PM Surya Ghar Muft Bijli Yojana directly credited to customer bank accounts."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {subsidies.map((s, i) => (
            <motion.div
              key={s.kw}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl ${s.featured ? "border-amber-500/60 ring-2 ring-amber-500/20 shadow-md shadow-amber-500/10" : "border-slate-200/90 hover:border-orange-500/40"}`}>
                <div className={`h-1.5 w-full bg-gradient-to-r ${s.color} absolute top-0 left-0`} />
                <div className="flex items-center justify-between mt-1">
                  <div className="font-display text-2xl font-black text-slate-900">
                    {s.kw}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.badgeBg}`}>
                    {s.tag}
                  </span>
                </div>
                <div className="mt-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Total Subsidy
                </div>
                <div className={`mt-1 font-display text-3xl font-black bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                  ₹{s.total.toLocaleString("en-IN")}
                </div>
                <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>UP State:</span>
                    <span className="font-bold text-slate-900">₹{s.state.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Central DBT:</span>
                    <span className="font-bold text-slate-900">₹{s.center.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-orange-500/25 transition-all hover:scale-105">
            <Link to="/calculator">
              Calculate Your Subsidy <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* BENEFITS */}
      <Section className="bg-white">
        <SectionHeading
          eyebrow="Why Choose Solar"
          title="Benefits of Going Solar"
          description="A smart, sustainable investment backed by high return and government support."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`group h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${b.borderHover}`}>
                <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${b.gradient} text-white shadow-md ${b.shadow} transition-transform group-hover:scale-110`}>
                  <b.icon className="h-6 w-6" strokeWidth={2.2} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">{b.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{b.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SERVICES */}
      <Section className="bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <SectionHeading
          eyebrow="Comprehensive Catalog"
          title="Complete Solar Solutions"
          description="From homes and shops to farms and factories — customized solutions for every rooftop."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition hover:-translate-y-1.5 hover:bg-white/10 hover:border-white/20 hover:shadow-xl"
            >
              <div className={`mx-auto mb-3.5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}>
                <s.icon className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <div className="font-display text-base font-bold text-white">{s.title}</div>
              <div className="mt-1 text-xs text-slate-400">{s.tag}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 p-8 sm:p-12 md:p-16 text-white shadow-2xl shadow-orange-500/25">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_80%_20%,white_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">
                ☀️ Clean Energy Revolution
              </span>
              <h3 className="mt-3 font-display text-3xl font-extrabold md:text-4xl tracking-tight leading-tight">
                Ready to power your home with the sun?
              </h3>
              <p className="mt-3 max-w-xl text-white/95 text-sm sm:text-base leading-relaxed">
                Book a free consultation today. Our certified engineers will design the ideal
                rooftop solar system for your home — with subsidy and bank EMI handled end-to-end.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button asChild size="lg" className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm shadow-xl cursor-pointer">
                <Link to="/apply">Apply Now ⚡</Link>
              </Button>
              <Button asChild size="lg" className="bg-white/20 hover:bg-white/30 text-white font-bold border border-white/40 backdrop-blur text-sm cursor-pointer">
                <a href="tel:+919721029235">Call 97210 29235</a>
              </Button>
            </div>
          </div>
          <img
            src={g4}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 hidden h-96 w-96 rounded-full object-cover opacity-20 md:block"
            loading="lazy"
          />
        </div>
      </Section>
    </>
  );
}
