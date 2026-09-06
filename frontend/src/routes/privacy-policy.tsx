import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/shared/Section";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [{ title: "Privacy Policy — Matri Shakti Infrastructure" }],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated: May 29, 2024"
      />
      <Section>
        <div className="prose mx-auto max-w-3xl">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Matri Shakti Infrastructure. We are committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you visit our website.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We may collect personal information from you such as your name, email
            address, and phone number when you fill out our contact form. We also
            collect non-personal information, such as browser type, operating system,
            and website usage data through cookies and analytics.
          </p>
          {/* Add more sections as required by a real privacy policy */}
        </div>
      </Section>
    </>
  );
}