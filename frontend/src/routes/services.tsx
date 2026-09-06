import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Battery,
  Building2,
  Cpu,
  Factory,
  Gauge,
  Home as HomeIcon,
  Sparkles,
  Zap,
} from "lucide-react";
import { PageHero, Section } from "@/components/shared/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Solar Solutions & Services — Matri Shakti Infrastructure" },
      {
        name: "description",
        content:
          "Residential, commercial and industrial solar solutions — on-grid, off-grid, hybrid, solar water pumps and solar atta chakki systems.",
      },
      { property: "og:title", content: "Solar Solutions & Services" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: HomeIcon,
    title: "Residential Solar",
    desc: "Rooftop solar for homes with government subsidy under PM Surya Ghar Yojana.",
  },
  {
    icon: Building2,
    title: "Commercial Solar",
    desc: "Solar for shops, offices, schools, colleges, hospitals — cut running costs.",
  },
  {
    icon: Factory,
    title: "Industrial Solar",
    desc: "High-capacity rooftop and ground-mount plants for factories and warehouses.",
  },
  {
    icon: Zap,
    title: "On-Grid Systems",
    desc: "Net metered solar tied to the grid — sell surplus power back to DISCOM.",
  },
  {
    icon: Battery,
    title: "Off-Grid Systems",
    desc: "Standalone solar with battery storage for remote and unreliable-grid areas.",
  },
  {
    icon: Cpu,
    title: "Hybrid Systems",
    desc: "Best of both worlds — grid + battery backup for 24×7 uninterrupted power.",
  },
  {
    icon: Gauge,
    title: "Solar Water Pump",
    desc: "Reliable solar pumps for irrigation and drinking water applications.",
  },
  {
    icon: Sparkles,
    title: "Solar Atta Chakki",
    desc: "Direct solar-powered flour mill systems for rural and semi-urban use.",
  },
];

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Solutions"
        title="Complete Solar Solutions"
        description="From residential rooftops to industrial parks — engineered solar systems tailored to your needs."
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group h-full border-0 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-gradient-sun group-hover:text-white group-hover:shadow-glow">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold text-secondary">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
                >
                  Enquire now →
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="bg-gradient-soft">
        <div className="rounded-3xl bg-secondary p-10 text-center text-white shadow-elegant md:p-14">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Not sure which system fits your needs?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/85">
            Our engineers offer free consultation and rooftop feasibility checks.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/calculator">Calculate Subsidy</Link>
            </Button>
            <Button asChild variant="heroOutline" size="lg">
              <Link to="/contact">Book Consultation</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
