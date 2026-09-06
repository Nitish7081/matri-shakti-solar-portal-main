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
  { kw: "1 KW", state: 15000, center: 30000, total: 45000 },
  { kw: "2 KW", state: 30000, center: 60000, total: 90000 },
  { kw: "3 KW", state: 30000, center: 78000, total: 108000 },
  { kw: "4 KW", state: 30000, center: 78000, total: 108000 },
  { kw: "5 KW", state: 30000, center: 78000, total: 108000 },
];

const benefits = [
  { icon: IndianRupee, title: "Reduce Electricity Bill", desc: "Save up to two-thirds every month" },
  { icon: Calendar, title: "25 Years Panel Life", desc: "Long warranty on solar panels" },
  { icon: Wrench, title: "Easy EMI Available", desc: "Finance on simple monthly instalments" },
  { icon: BadgeCheck, title: "Government Subsidy", desc: "Central and state combined benefits" },
  { icon: ShieldCheck, title: "Professional Installation", desc: "UPNEDA registered vendor" },
  { icon: Zap, title: "Fast Approval", desc: "Quick paperwork and net metering" },
];

const services = [
  { icon: HomeIcon, title: "Residential Solar" },
  { icon: Building2, title: "Commercial Solar" },
  { icon: Factory, title: "Industrial Solar" },
  { icon: Zap, title: "On-Grid Systems" },
  { icon: Battery, title: "Off-Grid Systems" },
  { icon: Cpu, title: "Hybrid Systems" },
  { icon: Gauge, title: "Solar Water Pump" },
  { icon: Sparkles, title: "Solar Atta Chakki" },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Rooftop solar panels at sunrise"
            className="h-full w-full object-cover"
            width={1920}
            height={1200}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 via-secondary/70 to-primary/60" />
        </div>

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 py-24 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur"
              >
                <Sun className="h-3.5 w-3.5" /> Government Scheme · UPNEDA Registered
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-5 font-display text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl"
              >
                PM Surya Ghar<br />
                <span className="bg-gradient-to-r from-primary-glow to-white bg-clip-text text-transparent">
                  Muft Bijli Yojana
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5 max-w-xl text-lg text-white/85"
              >
                Install rooftop solar and slash your electricity bill. Get up to
                ₹1,08,000 subsidy with easy EMI — powered by Matri Shakti Infrastructure.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Button asChild variant="hero" size="lg">
                  <Link to="/apply">
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="heroOutline" size="lg">
                  <Link to="/calculator">Get Free Consultation</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 grid grid-cols-3 gap-4 border-t border-white/20 pt-6"
              >
                {[
                  { v: 500, s: "+", l: "Installations" },
                  { v: 25, s: " yrs", l: "Panel Life" },
                  { v: 108000, s: "", l: "Max Subsidy ₹" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-2xl font-bold text-white md:text-3xl">
                      <Counter end={s.v} suffix={s.s} />
                    </div>
                    <div className="mt-1 text-xs text-white/70">{s.l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative hidden lg:block"
            >
              <motion.img
                src={panel}
                alt="Solar panel"
                className="mx-auto w-full max-w-md drop-shadow-2xl"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                width={900}
                height={900}
              />
              <div className="absolute -right-2 top-6 rounded-2xl glass px-4 py-3 shadow-glow">
                <div className="flex items-center gap-2 text-secondary">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Save up to</div>
                    <div className="font-display text-lg font-bold">₹6,000/mo</div>
                  </div>
                </div>
              </div>
              <div className="absolute -left-2 bottom-8 rounded-2xl glass px-4 py-3 shadow-glow">
                <div className="flex items-center gap-2 text-secondary">
                  <Leaf className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">CO₂ Saved</div>
                    <div className="font-display text-lg font-bold">3 Tons/yr</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <Section>
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
              className="rounded-3xl shadow-elegant"
              loading="lazy"
              width={1200}
              height={900}
            />
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-gradient-sun p-5 text-white shadow-glow md:block">
              <div className="font-display text-3xl font-bold">
                <Counter end={500} suffix="+" />
              </div>
              <div className="text-xs uppercase tracking-wider">Happy Households</div>
            </div>
          </motion.div>

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              About Us
            </div>
            <h2 className="font-display text-3xl font-bold text-secondary md:text-4xl">
              Matri Shakti Infrastructure
            </h2>
            <p className="mt-4 text-muted-foreground">
              We are a UPNEDA registered rooftop solar vendor delivering end-to-end
              installation services under the PM Surya Ghar Muft Bijli Yojana. From
              residential rooftops to commercial and industrial projects, our
              engineered systems help you cut electricity bills and go green.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "UPNEDA Registered Vendor",
                "Professional Installation",
                "Government Approved",
                "Residential Solar",
                "Commercial Solar",
                "Industrial Projects",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              <Button asChild variant="hero">
                <Link to="/about">Learn more</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/services">Our services</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* SUBSIDY */}
      <Section className="bg-gradient-soft">
        <SectionHeading
          eyebrow="Government Subsidy"
          title="Up to ₹1,08,000 Subsidy on Rooftop Solar"
          description="Central + state benefits under PM Surya Ghar Muft Bijli Yojana."
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
              <Card className="group relative overflow-hidden border-0 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10 transition group-hover:scale-150" />
                <div className="relative">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-sun text-white shadow-glow">
                    <Sun className="h-6 w-6" />
                  </div>
                  <div className="mt-4 font-display text-2xl font-bold text-secondary">
                    {s.kw}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    Total Subsidy
                  </div>
                  <div className="mt-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text font-display text-3xl font-extrabold text-transparent">
                    ₹{s.total.toLocaleString("en-IN")}
                  </div>
                  <div className="mt-4 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>State</span>
                      <span className="font-semibold text-foreground">
                        ₹{s.state.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Central</span>
                      <span className="font-semibold text-foreground">
                        ₹{s.center.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="hero" size="lg">
            <Link to="/calculator">
              Calculate Your Subsidy <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* BENEFITS */}
      <Section>
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Benefits of Going Solar"
          description="A smart, sustainable investment backed by government support."
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
              <Card className="group h-full border-0 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-gradient-sun group-hover:text-white group-hover:shadow-glow">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-secondary">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SERVICES */}
      <Section className="bg-secondary text-white">
        <SectionHeading
          eyebrow="Our Services"
          title="Complete Solar Solutions"
          description="From homes and shops to farms and factories — we cover every rooftop."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-glow"
            >
              <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-sun text-white shadow-glow">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="font-display text-base font-semibold">{s.title}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-sun p-10 text-white shadow-glow md:p-16">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_80%_20%,white_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="font-display text-3xl font-bold md:text-4xl">
                Ready to power your home with the sun?
              </h3>
              <p className="mt-3 max-w-xl text-white/90">
                Book a free consultation and let our engineers design the perfect
                rooftop solar system for you — with subsidy and EMI handled end-to-end.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button asChild size="lg" variant="secondary">
                <Link to="/apply">Apply Now</Link>
              </Button>
              <Button asChild size="lg" variant="heroOutline">
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
