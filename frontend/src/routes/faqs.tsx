import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/shared/Section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — PM Surya Ghar Solar Installation" },
      {
        name: "description",
        content:
          "Answers to common questions about rooftop solar installation, subsidy, EMI and PM Surya Ghar Muft Bijli Yojana.",
      },
      { property: "og:title", content: "Frequently Asked Questions" },
      { property: "og:url", content: "/faqs" },
    ],
    links: [{ rel: "canonical", href: "/faqs" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  {
    q: "How do I apply for PM Surya Ghar Muft Bijli Yojana?",
    a: "Register on pmsuryaghar.gov.in with your electricity consumer details, submit an application, and choose Matri Shakti Infrastructure as your registered vendor. We handle the rest — survey, installation and subsidy paperwork.",
  },
  {
    q: "How much subsidy will I get?",
    a: "Central subsidy is up to ₹78,000 for 3 KW and above. UPNEDA adds a state subsidy of up to ₹30,000 in Uttar Pradesh, taking the total up to ₹1,08,000.",
  },
  {
    q: "Is EMI available for solar installation?",
    a: "Yes. Easy EMI plans of 3 to 10 years are available through partner banks, often payable from your monthly electricity savings.",
  },
  {
    q: "How long does installation take?",
    a: "A typical residential rooftop solar system (1–5 KW) is installed within 7–15 days after paperwork and DISCOM approval.",
  },
  {
    q: "What is the life of solar panels?",
    a: "Modern tier-1 solar panels come with 25 years performance warranty and generally last 25–30 years with minimal maintenance.",
  },
  {
    q: "Do I need a battery?",
    a: "For on-grid systems tied to net metering you do not need a battery. Batteries are recommended for off-grid or hybrid systems that need backup power.",
  },
  {
    q: "Will my electricity bill really reduce?",
    a: "Yes — customers typically save 60–70% on their electricity bills. Excess power generated is exported back to the grid and adjusted in your bill.",
  },
  {
    q: "Is Matri Shakti Infrastructure a registered vendor?",
    a: "Yes, we are a UPNEDA registered rooftop solar vendor authorized to install under the PM Surya Ghar Muft Bijli Yojana.",
  },
];

function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Have Questions?"
        title="Frequently Asked Questions"
        description="Everything you need to know about rooftop solar, subsidy and EMI."
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border border-border bg-white px-5 shadow-card"
              >
                <AccordionTrigger className="text-left font-display text-base font-semibold text-secondary hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>
    </>
  );
}
