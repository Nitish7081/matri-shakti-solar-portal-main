import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
  Phone,
  ShieldCheck,
  Sparkles,
  Sun,
  Wrench,
  Zap,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/shared/Section";
import { Counter } from "@/components/shared/Counter";
import { ApplyModal } from "@/components/shared/ApplyModal";

import heroImage from "@/assets/hero-solar.jpg";
import panel from "@/assets/solar-panel.png";
import g1 from "@/assets/gallery-1.jpg";
import g4 from "@/assets/gallery-4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Matri-Shakti Infrastructure — PM Surya Ghar Solar Partner in UP" },
      {
        name: "description",
        content:
          "Install rooftop solar under PM Surya Ghar Muft Bijli Yojana with up to ₹1,08,000 subsidy and easy EMI by Matri-Shakti Infrastructure. UPNEDA registered vendor across Uttar Pradesh. Call 8948933657.",
      },
      { property: "og:title", content: "Matri-Shakti Infrastructure — Solar Installation" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const subsidies = [
  { kw: "1 KW", state: 15000, center: 30000, total: 45000, color: "from-amber-500 to-orange-500", tag: "Small Homes", badgeBg: "bg-amber-50 text-amber-800 border-amber-200" },
  { kw: "2 KW", state: 30000, center: 60000, total: 90000, color: "from-orange-500 to-rose-500", tag: "2-3 BHK Homes", badgeBg: "bg-orange-50 text-orange-800 border-orange-200" },
  { kw: "3 KW", state: 30000, center: 78000, total: 108000, color: "from-emerald-600 to-teal-600", tag: "Most Popular", badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold", featured: true },
  { kw: "4 KW", state: 30000, center: 78000, total: 108000, color: "from-blue-600 to-indigo-600", tag: "Large Homes", badgeBg: "bg-blue-50 text-blue-800 border-blue-200" },
  { kw: "5 KW", state: 30000, center: 78000, total: 108000, color: "from-purple-600 to-pink-600", tag: "Heavy Load / Commercial", badgeBg: "bg-purple-50 text-purple-800 border-purple-200" },
];

const benefits = [
  {
    icon: IndianRupee,
    title: "Zero Electricity Bills",
    desc: "Save up to 90% monthly power expense with bi-directional net metering.",
    gradient: "from-emerald-500 to-green-600",
    shadow: "shadow-emerald-500/20",
    borderHover: "hover:border-emerald-500/50",
  },
  {
    icon: Calendar,
    title: "25 Years Warranty",
    desc: "Tier-1 high efficiency solar panels with 25-year performance guarantee.",
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
    borderHover: "hover:border-amber-500/50",
  },
  {
    icon: Wrench,
    title: "Zero Downpayment EMI",
    desc: "Low-interest bank loans starting @ ₹1,500/month with fast processing.",
    gradient: "from-purple-500 to-violet-600",
    shadow: "shadow-purple-500/20",
    borderHover: "hover:border-purple-500/50",
  },
  {
    icon: BadgeCheck,
    title: "Government Subsidy",
    desc: "Combined Central DBT + UP State UPNEDA direct into bank account.",
    gradient: "from-blue-500 to-cyan-600",
    shadow: "shadow-blue-500/20",
    borderHover: "hover:border-blue-500/50",
  },
  {
    icon: ShieldCheck,
    title: "Professional Installation",
    desc: "UPNEDA registered vendor with certified electrical engineers.",
    gradient: "from-rose-500 to-orange-500",
    shadow: "shadow-rose-500/20",
    borderHover: "hover:border-rose-500/50",
  },
  {
    icon: Zap,
    title: "Fast Approval",
    desc: "Quick paperwork, feasibility clearance, and bi-directional net metering.",
    gradient: "from-teal-500 to-emerald-600",
    shadow: "shadow-teal-500/20",
    borderHover: "hover:border-teal-500/50",
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
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const whatsappUrl =
    "https://wa.me/918948933657?text=" +
    encodeURIComponent("Hello Matri-Shakti Infrastructure, I want to book a free solar site survey & consultation.");

  return (
    <>
      {/* HERO - Bright, Sunlit, High-Tech Modern Solar Aesthetic */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-white pt-4 pb-16 md:pb-24 border-b border-orange-100">
        {/* Soft Ambient Sunflare Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={heroImage}
            alt="Rooftop solar panels at sunrise"
            className="h-full w-full object-cover opacity-10 mix-blend-multiply"
            width={1920}
            height={1200}
          />
          <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-amber-400/25 to-orange-500/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-400/20 to-teal-500/15 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 py-8 md:py-16 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {/* Vibrant Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-100/90 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-amber-900 shadow-xs">
                  <Sun className="h-3.5 w-3.5 text-orange-600" /> UPNEDA Registered Vendor
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-100/90 px-3.5 py-1.5 text-xs font-black text-emerald-900 shadow-xs">
                  <Zap className="h-3.5 w-3.5 text-emerald-600" /> PM Surya Ghar Muft Bijli Partner
                </span>
              </motion.div>

              {/* Large, Grand Brand Name - Specifically Enlarged & Modernized */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mt-5"
              >
                <div className="inline-block">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-orange-600 block mb-1">
                    Authorized Solar EPC Leader
                  </span>
                  <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-950 uppercase leading-none">
                    MATRI-SHAKTI{" "}
                    <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                      INFRASTRUCTURE
                    </span>
                  </h2>
                </div>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-4 font-display text-2xl font-black leading-tight text-slate-900 sm:text-4xl md:text-4xl lg:text-5xl tracking-tight"
              >
                Solar Rooftop Installation &amp;{" "}
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 bg-clip-text text-transparent">
                  PM Surya Ghar Subsidy
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-4 max-w-xl text-base sm:text-lg text-slate-700 leading-relaxed font-normal"
              >
                Cut your electricity bill by up to 90% with Tier-1 solar systems. Get up to{" "}
                <strong className="text-orange-700 font-extrabold">₹1,08,000 direct DBT subsidy</strong> into your bank account with low-interest EMI — engineered and installed by <strong>Matri-Shakti Infrastructure</strong> across Uttar Pradesh.
              </motion.p>

              {/* Direct Modern Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-7 flex flex-wrap items-center gap-3"
              >
                <Button
                  size="lg"
                  onClick={() => setIsApplyModalOpen(true)}
                  className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-sm px-6 py-3 rounded-xl shadow-xl shadow-orange-500/25 transition-all hover:scale-105 cursor-pointer"
                >
                  Apply Now ⚡ <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3 shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
                >
                  <FaWhatsapp className="h-5 w-5" />
                  <span>WhatsApp: 8948933657</span>
                </a>
                <a
                  href="tel:+918948933657"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm px-4 py-3 shadow-xs transition-all"
                >
                  <Phone className="h-4 w-4 text-orange-600" />
                  <span>Call: 89489 33657</span>
                </a>
              </motion.div>

              {/* Clean, Bright Modern Counter Cards */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 border-t border-orange-200/70 pt-5"
              >
                <div className="p-3 sm:p-4 rounded-2xl border border-emerald-200 bg-white/95 shadow-md shadow-emerald-500/10 backdrop-blur-md">
                  <div className="font-display text-2xl font-black text-emerald-700 md:text-3xl">
                    <Counter end={500} suffix="+" />
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs font-bold text-emerald-900">Installations Done</div>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl border border-amber-200 bg-white/95 shadow-md shadow-amber-500/10 backdrop-blur-md">
                  <div className="font-display text-2xl font-black text-amber-700 md:text-3xl">
                    <Counter end={25} suffix=" yrs" />
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs font-bold text-amber-900">Panel Warranty</div>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl border border-blue-200 bg-white/95 shadow-md shadow-blue-500/10 backdrop-blur-md">
                  <div className="font-display text-2xl font-black text-blue-700 md:text-3xl">
                    <Counter end={108000} suffix="" />
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs font-bold text-blue-900">Max Subsidy ₹</div>
                </div>
              </motion.div>
            </div>

            {/* Right Solar Visual with Bright Glass Badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative hidden lg:block lg:col-span-5"
            >
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-orange-400/25 to-amber-400/25 blur-3xl pointer-events-none" />
              <motion.img
                src={panel}
                alt="Solar panel"
                className="relative mx-auto w-full max-w-md drop-shadow-2xl"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                width={900}
                height={900}
              />
              <div className="absolute -right-2 top-6 rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500">Save Monthly</div>
                    <div className="font-display text-base font-black text-emerald-700">₹6,000/mo</div>
                  </div>
                </div>
              </div>
              <div className="absolute -left-2 bottom-8 rounded-2xl border border-teal-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500">Green Clean Energy</div>
                    <div className="font-display text-base font-black text-teal-700">3 Tons CO₂/yr</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT US - Clean & Prestigious */}
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
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-700">
              About Our Company
            </div>
            <h2 className="font-display text-3xl font-black text-slate-950 md:text-4xl tracking-tight">
              Matri Shakti Infrastructure
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed text-base">
              We are a UPNEDA registered rooftop solar vendor delivering end-to-end
              installation services under the PM Surya Ghar Muft Bijli Yojana. From
              residential rooftops to commercial and industrial projects, our
              engineered systems help you cut electricity bills and power a greener future.
            </p>
            <ul className="mt-6 grid gap-3.5 sm:grid-cols-2">
              {[
                "UPNEDA Registered Partner",
                "Certified Solar Engineers",
                "Direct DBT Subsidy Assistance",
                "Residential Rooftop Solar",
                "Commercial & Industrial Solar",
                "Bi-directional Net Metering",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 rounded-xl">
                <Link to="/about">Learn More</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-xs font-bold border-slate-300 rounded-xl hover:bg-slate-50">
                <Link to="/services">Our Solar Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* SUBSIDY SCHEME SECTION */}
      <Section className="bg-gradient-to-b from-slate-50 via-orange-50/30 to-slate-50 relative overflow-hidden">
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
              <Card className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl ${s.featured ? "border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/10" : "border-slate-200/90 hover:border-orange-500/40"}`}>
                <div className={`h-1.5 w-full bg-gradient-to-r ${s.color} absolute top-0 left-0`} />
                <div className="flex items-center justify-between mt-1">
                  <div className="font-display text-2xl font-black text-slate-900">
                    {s.kw}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.badgeBg}`}>
                    {s.tag}
                  </span>
                </div>
                <div className="mt-3 text-[11px] uppercase tracking-wider font-bold text-slate-500">
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
          <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-orange-500/25 transition-all hover:scale-105 rounded-xl">
            <Link to="/calculator">
              Calculate Your Exact Subsidy <ArrowRight className="h-4 w-4 ml-1" />
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

      {/* SERVICES - Light, Cheerful, Modern Light Theme */}
      <Section className="bg-gradient-to-b from-slate-50 via-amber-50/30 to-white text-slate-900 relative overflow-hidden border-t border-slate-100">
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
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
              className="group rounded-2xl border border-slate-200/90 bg-white p-6 text-center shadow-sm hover:shadow-xl hover:border-orange-500/50 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className={`mx-auto mb-3.5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}>
                <s.icon className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <div className="font-display text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{s.title}</div>
              <div className="mt-1 text-xs text-slate-500 font-medium">{s.tag}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA SECTION */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-8 sm:p-12 md:p-16 text-white shadow-2xl shadow-orange-500/25">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_80%_20%,white_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur shadow-xs">
                ☀️ Clean Energy Revolution
              </span>
              <h3 className="mt-3 font-display text-3xl font-black md:text-4xl tracking-tight leading-tight">
                Ready to power your home with the sun?
              </h3>
              <p className="mt-3 max-w-xl text-white/95 text-sm sm:text-base leading-relaxed font-medium">
                Book a free consultation today. Our certified engineers will design the ideal
                rooftop solar system for your home — with subsidy and bank EMI handled end-to-end.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button
                size="lg"
                onClick={() => setIsApplyModalOpen(true)}
                className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm shadow-xl rounded-xl cursor-pointer"
              >
                Apply Now ⚡
              </Button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3 shadow-xl transition-all"
              >
                <FaWhatsapp className="h-5 w-5" />
                <span>WhatsApp: 8948933657</span>
              </a>
              <Button asChild size="lg" className="bg-white/20 hover:bg-white/30 text-white font-bold border border-white/40 backdrop-blur text-sm rounded-xl cursor-pointer">
                <a href="tel:+918948933657">Call: 89489 33657</a>
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

      <ApplyModal open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen} />
    </>
  );
}
