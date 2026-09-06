import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, FileText, Sun, Users, Wallet, Zap } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/shared/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/yojana")({
  head: () => ({
    meta: [
      { title: "PM Surya Ghar Muft Bijli Yojana — Full Guide" },
      {
        name: "description",
        content:
          "Everything about PM Surya Ghar Muft Bijli Yojana — eligibility, subsidy amounts, application process, and how Matri Shakti Infrastructure helps.",
      },
      { property: "og:title", content: "PM Surya Ghar Yojana Guide" },
      { property: "og:url", content: "/yojana" },
    ],
    links: [{ rel: "canonical", href: "/yojana" }],
  }),
  component: YojanaPage,
});

const steps = [
  { icon: Users, title: "Register", desc: "Sign up on pmsuryaghar.gov.in with your consumer details." },
  { icon: FileText, title: "Apply", desc: "Submit rooftop solar application with your DISCOM." },
  { icon: Sun, title: "Install", desc: "Matri Shakti installs your certified rooftop solar system." },
  { icon: Wallet, title: "Subsidy", desc: "Receive subsidy directly in your bank account." },
];

function YojanaPage() {
  return (
    <>
      <PageHero
        eyebrow="Central Government Scheme"
        title="PM Surya Ghar Muft Bijli Yojana"
        description="A flagship initiative to bring free solar electricity to 1 crore Indian households through generous central and state subsidies."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-secondary md:text-4xl">
              Scheme Highlights
            </h2>
            <p className="mt-4 text-muted-foreground">
              PM Surya Ghar Muft Bijli Yojana provides financial assistance and easy
              rooftop solar installations for residential consumers across India.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Up to ₹78,000 central subsidy for 3 KW and above",
                "Additional UPNEDA state subsidy in Uttar Pradesh",
                "Zero-cost EMI options through partnered banks",
                "Save up to 60–70% of your monthly electricity bill",
                "25 years panel life with performance warranty",
                "Free technical survey and design consultation",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-gradient-soft p-8 shadow-card">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-sun text-white shadow-glow">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-secondary">Subsidy Slabs</h3>
            <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-card">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-white">
                  <tr>
                    <th className="p-3 text-left">Load</th>
                    <th className="p-3 text-right">State</th>
                    <th className="p-3 text-right">Central</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1 KW", 15000, 30000, 45000],
                    ["2 KW", 30000, 60000, 90000],
                    ["3 KW", 30000, 78000, 108000],
                    ["4 KW", 30000, 78000, 108000],
                    ["5 KW", 30000, 78000, 108000],
                  ].map((r) => (
                    <tr key={String(r[0])} className="border-t border-border">
                      <td className="p-3 font-semibold">{r[0]}</td>
                      <td className="p-3 text-right">₹{Number(r[1]).toLocaleString("en-IN")}</td>
                      <td className="p-3 text-right">₹{Number(r[2]).toLocaleString("en-IN")}</td>
                      <td className="p-3 text-right font-bold text-primary">
                        ₹{Number(r[3]).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-soft">
        <SectionHeading
          eyebrow="How It Works"
          title="Simple 4-Step Application Process"
        />
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <Card
              key={s.title}
              className="relative border-0 bg-white p-6 text-center shadow-card"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-sun px-3 py-1 text-xs font-bold text-white shadow-glow">
                Step {i + 1}
              </div>
              <div className="mx-auto mt-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-secondary">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="hero" size="lg">
            <Link to="/contact">Start Your Application</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
