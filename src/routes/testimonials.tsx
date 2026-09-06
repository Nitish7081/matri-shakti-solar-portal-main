import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { PageHero, Section } from "@/components/shared/Section";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Matri Shakti Infrastructure" },
      {
        name: "description",
        content:
          "Real reviews from families and businesses that switched to solar with Matri Shakti Infrastructure.",
      },
      { property: "og:title", content: "Customer Testimonials" },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: TestimonialsPage,
});

const reviews = [
  {
    name: "Ramesh Yadav",
    place: "Gorakhpur, UP",
    text: "My electricity bill has dropped from ₹4,500 to under ₹500 a month. Installation was smooth and the team handled subsidy paperwork completely.",
  },
  {
    name: "Sunita Devi",
    place: "Maharajganj, UP",
    text: "The engineers were professional and courteous. Our 3 KW system is running perfectly and we got the government subsidy in 45 days.",
  },
  {
    name: "Anil Kumar",
    place: "Lucknow, UP",
    text: "Best decision for my shop. Zero electricity bills during the day and the EMI is easily covered by the savings.",
  },
  {
    name: "Dr. Neha Sharma",
    place: "Gorakhpur, UP",
    text: "Trustworthy vendor. UPNEDA registration made me confident and the after-sales service has been excellent.",
  },
  {
    name: "Vikas Singh",
    place: "Basti, UP",
    text: "Installed a 5 KW hybrid system. Power backup during outages is a huge relief. Highly recommended.",
  },
  {
    name: "Rakesh Prasad",
    place: "Kushinagar, UP",
    text: "Solar water pump in my farm has changed everything. Reliable service and quality product.",
  },
];

function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="What Clients Say"
        title="Trusted by 500+ Households"
        description="Real stories from families and businesses across Uttar Pradesh."
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="relative h-full border-0 bg-white p-7 shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
                <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/20" />
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-foreground/80">{r.text}</p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-sun font-display text-lg font-bold text-white">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-display text-sm font-semibold text-secondary">
                      {r.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{r.place}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
