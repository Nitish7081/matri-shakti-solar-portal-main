import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, CheckCircle2, Target, Users } from "lucide-react";
import { PageHero, Section } from "@/components/shared/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/shared/Counter";
import g1 from "@/assets/gallery-1.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Matri Shakti Infrastructure" },
      {
        name: "description",
        content:
          "UPNEDA registered solar installation company delivering residential, commercial and industrial rooftop solar projects across Uttar Pradesh.",
      },
      { property: "og:title", content: "About Matri Shakti Infrastructure" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who We Are"
        title="Powering India, One Rooftop at a Time"
        description="Matri Shakti Infrastructure is a UPNEDA registered solar EPC company, authorized under the PM Surya Ghar Muft Bijli Yojana."
      />

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.img
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            src={g1}
            alt="Team installing solar"
            className="rounded-3xl shadow-elegant"
            loading="lazy"
            width={1200}
            height={900}
          />
          <div>
            <h2 className="font-display text-3xl font-bold text-secondary md:text-4xl">
              Our Story
            </h2>
            <p className="mt-4 text-muted-foreground">
              Founded with a vision of making clean energy accessible to every Indian
              household, Matri Shakti Infrastructure has grown into a trusted rooftop
              solar partner in Uttar Pradesh. We specialize in end-to-end installation —
              from site survey and design to subsidy paperwork, EMI facilitation and
              lifetime service.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "UPNEDA Registered Vendor with government approvals",
                "Certified engineers and safe installation practices",
                "Tier-1 solar panels with 25 years performance warranty",
                "Full support with subsidy claim and net metering",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild variant="hero">
                <Link to="/contact">Get in touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-soft">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Our Mission",
              desc: "Enable every home and business to switch to affordable solar energy under government schemes.",
            },
            {
              icon: Users,
              title: "Our Team",
              desc: "Experienced electricians, structural engineers and project managers dedicated to quality.",
            },
            {
              icon: Award,
              title: "Our Promise",
              desc: "Transparent pricing, on-time delivery and reliable after-sales support for 25 years.",
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-0 bg-white p-8 text-center shadow-card">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-sun text-white shadow-glow">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-secondary">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">{c.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 rounded-3xl bg-secondary p-10 text-white shadow-elegant sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: 500, s: "+", l: "Installations" },
            { v: 3, s: " MW", l: "Capacity Installed" },
            { v: 10, s: "+", l: "Districts Served" },
            { v: 25, s: " yrs", l: "Panel Warranty" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-4xl font-extrabold text-primary-glow">
                <Counter end={s.v} suffix={s.s} />
              </div>
              <div className="mt-2 text-sm uppercase tracking-wider text-white/70">{s.l}</div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
