import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/shared/Section";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [{ title: "Terms & Conditions — Matri Shakti Infrastructure" }],
    links: [{ rel: "canonical", href: "/terms-and-conditions" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Last updated: May 29, 2024"
      />
      <Section>
        <div className="prose mx-auto max-w-3xl">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing this website, you are agreeing to be bound by these terms of
            service, all applicable laws and regulations, and agree that you are
            responsible for compliance with any applicable local laws.
          </p>
          {/* Add more sections as required by real terms & conditions */}
        </div>
      </Section>
    </>
  );
}