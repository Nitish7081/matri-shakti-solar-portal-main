import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Globe, Mail, MapPin, Phone, Send, Sun, CheckCircle2 } from "lucide-react";
import { PageHero, Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ContactSearchParams {
  company?: string;
  capacity?: string;
  product?: string;
  price?: string;
}

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): ContactSearchParams => ({
    company: (search.company as string) || "",
    capacity: (search.capacity as string) || "",
    product: (search.product as string) || "",
    price: (search.price as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Contact Us & Book Free Solar Survey — Matri Shakti Infrastructure" },
      {
        name: "description",
        content:
          "Get in touch with Matri Shakti Infrastructure for 1 KW to 20 KW PM Surya Ghar rooftop solar systems. Free site survey in Gorakhpur, Lucknow, Ayodhya & Maharajganj.",
      },
      { property: "og:title", content: "Contact Matri Shakti Infrastructure" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const offices = [
  {
    title: "Head Office",
    lines: ["Anil Singh, Madhonagar, Paniyara", "District Maharajganj", "Uttar Pradesh"],
  },
  {
    title: "Branch Office — Gorakhpur",
    lines: ["Lane No. 10, Near Fatima Hospital", "Shivpur Sahbazganj", "Gorakhpur, UP"],
  },
  {
    title: "Branch Office — Lucknow",
    lines: ["Office A-31, Amity Green City", "Gomti Nagar Extension", "Lucknow — 226010, UP"],
  },
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit phone number." }),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal("")),
  city: z.string().optional(),
  requiredCapacityKW: z.coerce
    .number()
    .int()
    .min(1, { message: "Capacity must be between 1 and 20 KW" })
    .max(20, { message: "Capacity must be between 1 and 20 KW" })
    .optional(),
  message: z.string().optional(),
});

function ContactPage() {
  const search = Route.useSearch();
  const prefilledCompany = search.company || "";
  const prefilledCapacity = search.capacity ? parseInt(search.capacity, 10) : undefined;
  const prefilledProduct = search.product || "";
  const prefilledPrice = search.price ? Number(search.price) : undefined;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      city: "",
      requiredCapacityKW: prefilledCapacity || undefined,
      message: prefilledProduct ? `Interested in ${prefilledCompany} ${prefilledCapacity} KW system (${prefilledProduct}).` : "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const chosenCapacity = values.requiredCapacityKW || prefilledCapacity;

    // Construct the WhatsApp message from form values
    // Construct the WhatsApp message from form values
    const whatsappMessage = `Hello Matri-Shakti Infrastructure,

I've submitted an inquiry on your website:
Name: ${values.name}
Phone: ${values.phone}
${values.city ? `City: ${values.city}` : ""}
${chosenCapacity ? `Capacity: ${chosenCapacity} KW` : ""}
${prefilledCompany ? `Selected Company: ${prefilledCompany}` : ""}
${values.message ? `Details: ${values.message}` : ""}

Please contact me for free site survey and quotation.
`;

    const WHATSAPP_NUMBER = "918948933657";
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    try {
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email || undefined,
          city: values.city || "Uttar Pradesh",
          message: values.message || undefined,
          requiredCapacityKW: chosenCapacity,
          interestedCompany: prefilledCompany || undefined,
          interestedProduct: prefilledProduct || undefined,
          productPrice: prefilledPrice || undefined,
          source: prefilledCompany ? "product-enquiry" : "contact-page",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit your inquiry. Please check your information.");
      }

      toast.success(data.message || "Thank you! Our solar specialist will reach out to you shortly.");
      form.reset();

      // Open WhatsApp chat in a new tab
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Contact Matri-Shakti Infrastructure"
        description="Talk directly to our solar engineers, request a free site survey, or chat with us on WhatsApp at 8948933657."
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-3">
          {[
            {
              icon: Phone,
              title: "Call & WhatsApp",
              body: (
                <>
                  <a href="tel:+918948933657" className="block font-bold text-slate-900 hover:text-primary">
                    +91 89489 33657 (Primary &amp; WhatsApp)
                  </a>
                  <a href="tel:+919305827390" className="block text-slate-500 hover:text-primary mt-1">
                    +91 93058 27390 (Support)
                  </a>
                </>
              ),
            },
            {
              icon: Mail,
              title: "Email Us",
              body: (
                <a
                  href="mailto:matrishaktiinfrastructure@gmail.com"
                  className="break-all hover:text-primary font-medium"
                >
                  matrishaktiinfrastructure@gmail.com
                </a>
              ),
            },
            {
              icon: Globe,
              title: "Service Area",
              body: "Gorakhpur, Maharajganj, Lucknow, Ayodhya, Varanasi & all UP Districts",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Card key={i} className="border-0 bg-white p-6 shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-sun text-white shadow-glow">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-secondary">
                  {item.title}
                </h3>
                <div className="mt-2 text-sm text-muted-foreground">{item.body}</div>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section className="bg-muted/40">
        <div className="grid gap-12 lg:grid-cols-5">
          <Card className="border-0 bg-white p-6 shadow-card lg:col-span-3 sm:p-8">
            {/* Prefilled Product Banner */}
            {(prefilledCompany || prefilledCapacity) && (
              <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                    <Sun className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Selected Package
                    </span>
                    <h4 className="font-display font-bold text-sm text-foreground">
                      {prefilledCompany} {prefilledCapacity ? `— ${prefilledCapacity} KW Solar System` : ""}
                    </h4>
                    {prefilledPrice && (
                      <span className="text-xs font-semibold text-muted-foreground">
                        Price: ₹{prefilledPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Attached
                </span>
              </div>
            )}

            <h2 className="font-display text-2xl font-bold text-secondary">
              Book a Free Site Survey
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the form and our team will get back to you within 24 hours.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="10-digit mobile" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City / District</FormLabel>
                        <FormControl>
                          <Input placeholder="Gorakhpur, Lucknow, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requiredCapacityKW"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Capacity (1–20 KW)</FormLabel>
                        <FormControl>
                          <select
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                          >
                            <option value="">Select Capacity (Optional)</option>
                            {Array.from({ length: 20 }, (_, i) => i + 1).map((kw) => (
                              <option key={kw} value={kw}>
                                {kw} KW System
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message / Rooftop Details (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Tell us about your rooftop area, monthly bill, or preferred brand..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full font-bold"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Solar Inquiry <Send className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </Card>

          <div className="space-y-5 lg:col-span-2">
            {offices.map((o) => (
              <Card key={o.title} className="border-0 bg-white p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-sun text-white">
                    {o.title.includes("Head") ? (
                      <MapPin className="h-5 w-5" />
                    ) : (
                      <Building2 className="h-5 w-5" />
                    )}
                  </div>
                  <h3 className="font-display text-base font-bold text-secondary">
                    {o.title}
                  </h3>
                </div>
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {o.lines.map((l, i) => (
                    <p key={i}>{l}</p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
