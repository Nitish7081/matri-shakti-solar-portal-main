import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, Percent, Wallet } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/shared/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/emi")({
  head: () => ({
    meta: [
      { title: "EMI Plans — Solar on Easy Installments" },
      {
        name: "description",
        content:
          "Install rooftop solar on easy EMI. Low-interest solar loans through partner banks under PM Surya Ghar Muft Bijli Yojana.",
      },
      { property: "og:title", content: "Solar EMI Plans" },
      { property: "og:url", content: "/emi" },
    ],
    links: [{ rel: "canonical", href: "/emi" }],
  }),
  component: EmiPage,
});

const plans = [
  { kw: "1 KW", cost: 60000, subsidy: 45000, net: 15000, emi: 500 },
  { kw: "2 KW", cost: 120000, subsidy: 90000, net: 30000, emi: 1000 },
  { kw: "3 KW", cost: 180000, subsidy: 108000, net: 72000, emi: 1800 },
  { kw: "5 KW", cost: 300000, subsidy: 108000, net: 192000, emi: 4200 },
];

function EmiPage() {
  return (
    <>
      <PageHero
        eyebrow="Finance / EMI"
        title="Easy EMI Plans"
        description="Zero-cost and low-interest EMI options through partner banks — pay from your electricity savings."
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Wallet,
              title: "Low Down Payment",
              desc: "Start with minimal upfront investment.",
            },
            {
              icon: Percent,
              title: "Attractive Interest",
              desc: "Government-approved solar loan schemes.",
            },
            {
              icon: CreditCard,
              title: "Flexible Tenure",
              desc: "3 to 10 year repayment plans available.",
            },
          ].map((c) => (
            <Card key={c.title} className="border-0 bg-white p-8 text-center shadow-card">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-sun text-white shadow-glow">
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-secondary">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{c.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-gradient-soft">
        <SectionHeading
          eyebrow="Sample Plans"
          title="Illustrative EMI Estimates"
          description="Approximate figures based on 60-month tenure and combined subsidy."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <Card
              key={p.kw}
              className="group relative overflow-hidden border-0 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="absolute right-4 top-4 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {p.kw}
              </div>
              <div className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">
                Monthly EMI
              </div>
              <div className="mt-1 bg-gradient-to-r from-primary to-primary-glow bg-clip-text font-display text-4xl font-extrabold text-transparent">
                ₹{p.emi.toLocaleString("en-IN")}
              </div>
              <ul className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Total Cost</span>
                  <span className="font-semibold">₹{p.cost.toLocaleString("en-IN")}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Subsidy</span>
                  <span className="font-semibold text-primary">
                    −₹{p.subsidy.toLocaleString("en-IN")}
                  </span>
                </li>
                <li className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">Net Loan</span>
                  <span className="font-semibold">₹{p.net.toLocaleString("en-IN")}</span>
                </li>
              </ul>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="hero" size="lg">
            <Link to="/contact">Apply for EMI</Link>
          </Button>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-card">
          <h3 className="font-display text-2xl font-bold text-secondary">
            Documents Required
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              "Aadhaar card and PAN card",
              "Electricity bill copy (last 3 months)",
              "Property ownership proof / NOC",
              "Bank passbook / cancelled cheque",
              "Latest passport size photograph",
            ].map((d) => (
              <li key={d} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
