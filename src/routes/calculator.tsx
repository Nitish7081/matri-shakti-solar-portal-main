import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Calculator as Calc, IndianRupee, Sparkles, Sun, Wallet, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/shared/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Solar Subsidy & Capacity Calculator (1 KW – 20 KW) — Matri Shakti" },
      {
        name: "description",
        content:
          "Estimate your rooftop solar plant size from 1 KW to 20 KW, government subsidy, EMI and monthly savings under PM Surya Ghar Muft Bijli Yojana.",
      },
      { property: "og:title", content: "Solar Subsidy Calculator" },
      { property: "og:url", content: "/calculator" },
    ],
    links: [{ rel: "canonical", href: "/calculator" }],
  }),
  component: CalculatorPage,
});

interface IMatchedPackage {
  id: string;
  companyName: string;
  companySlug: string;
  model: string;
  capacityKW: number;
  panelWattage: number;
  panelCount: number;
  warranty: string;
  sellingPrice: number;
  basePrice: number;
  subsidy: number;
  available: boolean;
}

const subsidyFor = (kw: number) => {
  if (kw <= 1) return 45000;
  if (kw <= 2) return 90000;
  return 108000; // max residential PM Surya Ghar cap in UP
};

function CalculatorPage() {
  const navigate = useNavigate();
  const [state, setState] = useState("Uttar Pradesh");
  const [bill, setBill] = useState(3500);
  const [load, setLoad] = useState(3);
  const [capacity, setCapacity] = useState(3);
  const [matchedPackages, setMatchedPackages] = useState<IMatchedPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);

  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  // Auto recommend KW based on electricity bill if user changes bill
  const handleBillChange = (newBill: number) => {
    setBill(newBill);
    // Standard estimation: ₹1,000 monthly bill ≈ 1 KW rooftop solar
    const recommendedKW = Math.min(20, Math.max(1, Math.round(newBill / 1000)));
    setCapacity(recommendedKW);
  };

  const result = useMemo(() => {
    const cost = 58000 * capacity; // avg estimated cost per kW
    const subsidy = subsidyFor(capacity);
    const net = Math.max(cost - subsidy, 0);
    const emi = Math.round(net / 60); // 60 months illustrative
    const monthlySavings = Math.round(bill * 0.7);
    const yearlyGen = capacity * 1400; // kWh per year
    return { cost, subsidy, net, emi, monthlySavings, yearlyGen };
  }, [capacity, bill]);

  // Fetch live matching brand packages for the selected capacity from MongoDB
  useEffect(() => {
    const fetchBrandPackages = async () => {
      setLoadingPackages(true);
      try {
        const res = await fetch(`${baseUrl}/api/packages?capacity=${capacity}&availableOnly=true`);
        if (res.ok) {
          const data = await res.json();
          setMatchedPackages(data.packages || []);
        }
      } catch (err) {
        console.error("Failed to load matching packages:", err);
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchBrandPackages();
  }, [capacity, baseUrl]);

  const handleEnquirePackage = (pkg: IMatchedPackage) => {
    navigate({
      to: "/contact",
      search: {
        company: pkg.companyName,
        capacity: pkg.capacityKW.toString(),
        product: pkg.model,
        price: pkg.sellingPrice.toString(),
      } as unknown as Record<string, string>,
    });
  };

  return (
    <>
      <PageHero
        eyebrow="1 KW to 20 KW System Estimator"
        title="Solar Subsidy & Savings Calculator"
        description="Calculate your recommended rooftop solar plant capacity, government subsidy, EMI, and monthly savings. View live brand packages available in Uttar Pradesh."
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form Card */}
          <Card className="border-0 bg-white p-6 sm:p-8 shadow-card">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-sun text-white shadow-glow">
                <Calc className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-secondary">
                Calculate Solar Capacity
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <Label className="text-xs font-semibold">State / Location</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[
                      "Uttar Pradesh",
                      "Bihar",
                      "Madhya Pradesh",
                      "Delhi / NCR",
                      "Other",
                    ].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold">Average Monthly Electricity Bill (₹)</Label>
                <Input
                  type="number"
                  className="mt-1.5"
                  value={bill}
                  onChange={(e) => handleBillChange(Number(e.target.value) || 0)}
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  Tip: A bill of ₹{bill.toLocaleString("en-IN")} typically needs a ~{capacity} KW system.
                </span>
              </div>

              <div>
                <Label className="text-xs font-semibold">Sanctioned Electricity Load (KW)</Label>
                <Input
                  type="number"
                  className="mt-1.5"
                  value={load}
                  onChange={(e) => setLoad(Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-semibold">Select System Capacity (1 to 20 KW)</Label>
                  <span className="text-xs font-bold text-primary">{capacity} KW Chosen</span>
                </div>
                <Select
                  value={String(capacity)}
                  onValueChange={(v) => setCapacity(Number(v))}
                >
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((k) => (
                      <SelectItem key={k} value={String(k)}>
                        {k} KW Rooftop Solar System
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs space-y-1">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> PM Surya Ghar Scheme Advantage
                </span>
                <p className="text-muted-foreground">
                  Under the central & UP state joint subsidy scheme, you receive upfront assistance deposited directly into your bank account.
                </p>
              </div>
            </div>
          </Card>

          {/* Results Display */}
          <div className="space-y-4">
            {[
              {
                icon: Sun,
                label: "Recommended Plant Size",
                value: `${capacity} KW`,
                hint: `Approx. ${result.yearlyGen.toLocaleString("en-IN")} units generated / year`,
              },
              {
                icon: Sparkles,
                label: "Estimated PM Subsidy",
                value: `₹${result.subsidy.toLocaleString("en-IN")}`,
                hint: "Direct Bank Transfer (Central + UP State)",
              },
              {
                icon: Wallet,
                label: "Estimated Monthly EMI",
                value: `₹${result.emi.toLocaleString("en-IN")}/mo`,
                hint: "Illustrative 5-year easy solar financing",
              },
              {
                icon: IndianRupee,
                label: "Estimated Monthly Savings",
                value: `₹${result.monthlySavings.toLocaleString("en-IN")}`,
                hint: "Up to ~70% reduction on electricity bills",
              },
              {
                icon: Zap,
                label: "Net Investment (Post-Subsidy)",
                value: `₹${result.net.toLocaleString("en-IN")}*`,
                hint: `Estimated total system cost minus government subsidy`,
              },
            ].map((r) => (
              <Card
                key={r.label}
                className="flex items-center gap-4 border-0 bg-white p-4 sm:p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-sun text-white shadow-glow">
                  <r.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {r.label}
                  </div>
                  <div className="font-display text-xl sm:text-2xl font-bold text-secondary">
                    {r.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{r.hint}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Live Brand Packages for the Chosen Capacity (Fetched from MongoDB) */}
        <div className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4 gap-2">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">
                Available {capacity} KW Packages from Top Brands
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time prices from authorized manufacturers for {capacity} KW rooftop solar in Uttar Pradesh
              </p>
            </div>

            <Link
              to="/solar-panels"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Browse All 1–20 KW Packages <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loadingPackages ? (
            <div className="flex min-h-[160px] items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : matchedPackages.length === 0 ? (
            <div className="p-8 text-center bg-card rounded-xl border border-border/60 mt-4 text-xs text-muted-foreground">
              No packages currently active for {capacity} KW. Please contact our team for custom quotations.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {matchedPackages.map((pkg) => {
                const netPayable = Math.max(0, pkg.sellingPrice - pkg.subsidy);

                return (
                  <Card
                    key={pkg.id}
                    className="border border-border/70 bg-card p-4 rounded-xl flex flex-col justify-between hover:shadow-card transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-primary">
                          {pkg.companyName}
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                          AVAILABLE
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-sm text-foreground mt-1">
                        {pkg.capacityKW} KW On-Grid System
                      </h4>

                      <div className="mt-3 space-y-1 text-xs text-muted-foreground border-y border-border/40 py-2">
                        <div className="flex justify-between">
                          <span>Panels:</span>
                          <span className="font-semibold text-foreground">
                            {pkg.panelCount} × {pkg.panelWattage}W
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Warranty:</span>
                          <span className="font-semibold text-emerald-600">25 Years</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                          Price
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-display text-lg font-bold text-foreground">
                            ₹{pkg.sellingPrice.toLocaleString("en-IN")}
                          </span>
                          {pkg.basePrice > pkg.sellingPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ₹{pkg.basePrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        {pkg.subsidy > 0 && (
                          <div className="text-[11px] font-semibold text-primary mt-1">
                            Net after Subsidy: ₹{netPayable.toLocaleString("en-IN")}*
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleEnquirePackage(pkg)}
                      className="mt-4 w-full text-xs font-bold gap-1"
                    >
                      Enquire for this System <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
