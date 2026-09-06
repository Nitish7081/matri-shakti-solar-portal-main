import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sun,
  Zap,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Layers,
  Cpu,
  ArrowRight,
  Filter,
  Building2,
} from "lucide-react";
import { PageHero, Section } from "@/components/shared/Section";

export const Route = createFileRoute("/solar-panels")({
  head: () => ({
    meta: [
      { title: "Solar Rooftop Packages (1 KW – 20 KW) — Tata, Adani, Waaree | Matri Shakti" },
      {
        name: "description",
        content:
          "Explore 1 KW to 20 KW rooftop solar systems from top brands like Tata Solar, Adani Solar, Waaree, and Usha. Compare prices, subsidies, and warranty under PM Surya Ghar Yojana.",
      },
    ],
  }),
  component: SolarPanelsPage,
});

export interface ISolarCompany {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export interface ISolarPackage {
  id: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  model: string;
  capacityKW: number;
  panelWattage: number;
  panelCount: number;
  inverterBrand: string;
  inverterModel: string;
  structureType: string;
  batteryIncluded: boolean;
  batteryCapacity?: string;
  installationIncluded: boolean;
  netMeteringIncluded: boolean;
  warranty: string;
  basePrice: number;
  sellingPrice: number;
  discount: number;
  subsidy: number;
  available: boolean;
  active: boolean;
  description?: string;
}

const CAPACITIES = Array.from({ length: 20 }, (_, i) => i + 1); // 1 to 20 KW

function SolarPanelsPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<ISolarCompany[]>([]);
  const [packages, setPackages] = useState<ISolarPackage[]>([]);
  const [selectedCapacity, setSelectedCapacity] = useState<number | "ALL">("ALL");
  const [selectedCompany, setSelectedCompany] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<ISolarPackage | null>(null);

  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  // Load Companies & Packages
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [compRes, pkgRes] = await Promise.all([
        fetch(`${baseUrl}/api/companies`),
        fetch(`${baseUrl}/api/packages`),
      ]);

      if (compRes.ok) {
        const compData = await compRes.json();
        setCompanies(compData.companies || []);
      }

      if (pkgRes.ok) {
        const pkgData = await pkgRes.json();
        setPackages(pkgData.packages || []);
      }
    } catch (err) {
      console.error("Failed to load solar catalog:", err);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      if (selectedCapacity !== "ALL" && pkg.capacityKW !== selectedCapacity) {
        return false;
      }
      if (selectedCompany !== "ALL" && pkg.companySlug !== selectedCompany) {
        return false;
      }
      return true;
    });
  }, [packages, selectedCapacity, selectedCompany]);

  const handleEnquire = (pkg: ISolarPackage) => {
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
        eyebrow="1 KW to 20 KW Rooftop Solar Systems"
        title="Top Brand Solar Packages & Real-Time Pricing"
        description="Select your required capacity from 1 KW to 20 KW. Compare high-efficiency solar systems from Tata, Adani, Waaree, Usha, and other top authorized manufacturers."
      />

      <Section>
        {/* Filter Controls */}
        <div className="space-y-6">
          {/* Capacity Filter Bar (1 to 20 KW) */}
          <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Filter className="h-3.5 w-3.5 text-primary" /> 1. Select Solar Capacity (KW):
              </span>
              <span className="text-xs font-medium text-primary">
                {selectedCapacity === "ALL" ? "Showing 1–20 KW" : `${selectedCapacity} KW Selected`}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setSelectedCapacity("ALL")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedCapacity === "ALL"
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                All Capacities (1–20 KW)
              </button>

              {CAPACITIES.map((kw) => {
                const isSelected = selectedCapacity === kw;
                return (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => setSelectedCapacity(kw)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-primary text-white shadow-sm shadow-primary/30 scale-105"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {kw} KW
                  </button>
                );
              })}
            </div>
          </div>

          {/* Company Brand Filter Bar */}
          <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-primary" /> 2. Filter by Solar Manufacturer:
              </span>
              <span className="text-xs text-muted-foreground">
                {companies.length} Brands Available
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCompany("ALL")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedCompany === "ALL"
                    ? "bg-secondary text-white shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                All Brands
              </button>

              {companies.map((c) => {
                const isSelected = selectedCompany === c.slug;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCompany(c.slug)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-secondary text-white shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-8 flex items-center justify-between border-b border-border/60 pb-3">
          <p className="text-xs font-medium text-muted-foreground">
            Showing <span className="font-bold text-foreground">{filteredPackages.length}</span> solar systems
            {selectedCapacity !== "ALL" && ` for ${selectedCapacity} KW`}
            {selectedCompany !== "ALL" && ` (${companies.find((c) => c.slug === selectedCompany)?.name})`}
          </p>

          <Link
            to="/calculator"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Calculate Required KW from Electricity Bill <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
              <p className="text-xs font-medium text-muted-foreground">Fetching brand packages from database...</p>
            </div>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
            <Sun className="h-10 w-10 text-muted-foreground mb-3 opacity-40" />
            <h3 className="font-display text-base font-bold text-foreground">No solar packages found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              There are currently no packages matching the selected capacity and company filter. Try selecting &quot;All Brands&quot; or &quot;All Capacities&quot;.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCapacity("ALL");
                setSelectedCompany("ALL");
              }}
              className="mt-4 text-xs font-semibold"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPackages.map((pkg) => {
              const netPrice = Math.max(0, pkg.sellingPrice - pkg.subsidy);

              return (
                <Card
                  key={pkg.id}
                  className={`group relative flex flex-col justify-between overflow-hidden border transition-all duration-300 hover:shadow-card hover:-translate-y-1 ${
                    pkg.available
                      ? "border-border/70 bg-card"
                      : "border-border/40 bg-muted/20 opacity-85"
                  }`}
                >
                  {/* Top Header */}
                  <CardHeader className="pb-3 pt-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          {pkg.companyName}
                        </span>
                        <CardTitle className="font-display text-lg font-bold text-foreground mt-0.5">
                          {pkg.capacityKW} KW Solar System
                        </CardTitle>
                      </div>

                      {/* Availability Badge */}
                      {pkg.available ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> AVAILABLE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          <XCircle className="h-3 w-3" /> UNAVAILABLE
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-xs line-clamp-1 mt-1">
                      {pkg.model}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 pb-5 pt-0">
                    {/* Technical Specs Badges */}
                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/40 p-3 border border-border/40 text-xs">
                      <div className="flex items-center gap-2">
                        <Layers className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">
                          <strong className="text-foreground">{pkg.panelWattage}W</strong> × {pkg.panelCount} Panels
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span className="truncate text-foreground font-medium">
                          On-Grid System
                        </span>
                      </div>

                      <div className="flex items-center gap-2 col-span-2">
                        <Cpu className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate text-muted-foreground">
                          Inverter: <strong className="text-foreground">{pkg.inverterBrand}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 col-span-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                          {pkg.warranty}
                        </span>
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block">
                            System Price
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-xl font-extrabold text-foreground">
                              ₹{pkg.sellingPrice.toLocaleString("en-IN")}
                            </span>
                            {pkg.basePrice > pkg.sellingPrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                ₹{pkg.basePrice.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                        </div>

                        {pkg.subsidy > 0 && (
                          <div className="text-right">
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                              PM Subsidy
                            </span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              -₹{pkg.subsidy.toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                      </div>

                      {pkg.subsidy > 0 && (
                        <div className="mt-2.5 flex items-center justify-between border-t border-primary/15 pt-2 text-xs">
                          <span className="font-semibold text-muted-foreground">Net Cost After Subsidy:</span>
                          <span className="font-display font-extrabold text-primary text-sm">
                            ₹{netPrice.toLocaleString("en-IN")}*
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPackage(pkg)}
                        className="w-1/2 text-xs font-semibold"
                      >
                        View Details
                      </Button>

                      <Button
                        variant={pkg.available ? "default" : "secondary"}
                        size="sm"
                        onClick={() => handleEnquire(pkg)}
                        className="w-1/2 text-xs font-bold gap-1"
                      >
                        Enquire Now <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </Section>

      {/* VIEW PACKAGE DETAILS MODAL */}
      <Dialog open={!!selectedPackage} onOpenChange={(open) => !open && setSelectedPackage(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {selectedPackage?.companyName}
              </span>
              {selectedPackage?.available ? (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                  AVAILABLE
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600">
                  UNAVAILABLE
                </span>
              )}
            </div>
            <DialogTitle className="font-display text-xl font-bold">
              {selectedPackage?.capacityKW} KW Rooftop Solar Package
            </DialogTitle>
            <DialogDescription className="text-xs">
              Complete equipment breakdown and government subsidy estimate
            </DialogDescription>
          </DialogHeader>

          {selectedPackage && (
            <div className="space-y-4 py-2 text-xs">
              <div className="rounded-xl bg-muted/40 p-3.5 border border-border/60 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Solar Panels:</span>
                  <span className="font-bold text-foreground">
                    {selectedPackage.panelCount} × {selectedPackage.panelWattage}W Mono PERC
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Inverter Model:</span>
                  <span className="font-bold text-foreground">{selectedPackage.inverterBrand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Mounting Structure:</span>
                  <span className="font-medium text-foreground">{selectedPackage.structureType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Warranty:</span>
                  <span className="font-bold text-emerald-600">{selectedPackage.warranty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Net Metering:</span>
                  <span className="font-medium text-foreground">
                    {selectedPackage.netMeteringIncluded ? "Included (UPNEDA Discom coordination)" : "Not Included"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Turnkey Installation:</span>
                  <span className="font-medium text-foreground">
                    {selectedPackage.installationIncluded ? "Included by Matri Shakti team" : "Standard"}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Standard Package Price:</span>
                  <span className="font-bold text-foreground">₹{selectedPackage.sellingPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>PM Surya Ghar Subsidy:</span>
                  <span>-₹{selectedPackage.subsidy.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-t border-primary/20 pt-1.5 font-bold text-sm text-primary">
                  <span>Customer Final Payable:</span>
                  <span>₹{(selectedPackage.sellingPrice - selectedPackage.subsidy).toLocaleString("en-IN")}*</span>
                </div>
              </div>

              {selectedPackage.description && (
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {selectedPackage.description}
                </p>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="outline" size="sm" onClick={() => setSelectedPackage(null)}>
              Close
            </Button>
            {selectedPackage && (
              <Button
                size="sm"
                onClick={() => {
                  const pkg = selectedPackage;
                  setSelectedPackage(null);
                  handleEnquire(pkg);
                }}
                className="font-bold gap-1"
              >
                Enquire for this System <ArrowRight className="h-3 w-3" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
