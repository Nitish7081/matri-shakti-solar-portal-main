import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero, Section } from "@/components/shared/Section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Sun,
  Zap,
  CheckCircle2,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface ApplySearchParams {
  company?: string;
  capacity?: string;
}

export const Route = createFileRoute("/apply")({
  validateSearch: (search: Record<string, unknown>): ApplySearchParams => ({
    company: typeof search.company === "string" ? search.company : undefined,
    capacity: typeof search.capacity === "string" ? search.capacity : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Apply for Rooftop Solar — PM Surya Ghar Muft Bijli Yojana" },
      {
        name: "description",
        content:
          "Apply for 1 KW to 20 KW rooftop solar system under PM Surya Ghar Yojana. Get up to ₹1,08,000 subsidy in Uttar Pradesh with Matri Shakti Infrastructure.",
      },
    ],
  }),
  component: ApplyPage,
});

function ApplyPage() {
  const { company: initialCompany, capacity: initialCapacity } = Route.useSearch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "Maharajganj",
    district: "Maharajganj",
    pincode: "273303",
    consumerName: "",
    consumerNumber: "",
    connectionNumber: "",
    billAmount: "₹2,500 - ₹4,000 / month",
    connectionType: "Domestic / Residential",
    requiredCapacityKW: initialCapacity ? parseInt(initialCapacity, 10) || 5 : 5,
    interestedCompany: initialCompany || "Tata Power Solar",
    interestedProduct: "",
    dealerId: "",
    dealerName: "",
    message: "",
  });

  const [companies, setCompanies] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [dealers, setDealers] = useState<Array<{ dealerId: string; dealerName: string; city: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  useEffect(() => {
    fetch(`${baseUrl}/api/companies`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.companies) {
          setCompanies(data.companies);
        }
      })
      .catch(() => {});

    fetch(`${baseUrl}/api/dealers/active`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.dealers) {
          setDealers(data.dealers);
        }
      })
      .catch(() => {});
  }, [baseUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Please enter your full name");
    if (!formData.phone.trim() || formData.phone.length < 10)
      return toast.error("Please enter a valid 10-digit mobile number");

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim() || formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim() || "Uttar Pradesh",
        district: formData.district.trim(),
        pincode: formData.pincode.trim(),
        consumerName: formData.consumerName.trim() || formData.name.trim(),
        consumerNumber: formData.consumerNumber.trim(),
        connectionNumber: formData.connectionNumber.trim(),
        billAmount: formData.billAmount.trim(),
        connectionType: formData.connectionType,
        requiredCapacityKW: Number(formData.requiredCapacityKW) || 5,
        interestedCompany: formData.interestedCompany,
        interestedProduct: `${formData.interestedCompany} ${formData.requiredCapacityKW} KW System`,
        dealerId: formData.dealerId || undefined,
        dealerName: formData.dealerName || undefined,
        message: formData.message.trim(),
        source: "apply-page",
      };

      const res = await fetch(`${baseUrl}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit solar application");
      }

      setSubmittedEnquiryId(data.enquiryId || "MS-ENQ-RECEIVED");
      toast.success("Application registered successfully under PM Surya Ghar Yojana!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="PM Surya Ghar Muft Bijli Yojana"
        title="Apply for Rooftop Solar System (1 KW – 20 KW)"
        description="Book your authorized UPNEDA rooftop solar survey, receive maximum central & UP state subsidy, and secure zero-electricity bills."
      />

      <Section className="py-12">
        <div className="mx-auto max-w-4xl">
          {submittedEnquiryId ? (
            <Card className="border-emerald-200 bg-emerald-50/50 shadow-xl p-8 text-center space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div className="space-y-2">
                <Badge className="bg-emerald-600 text-white px-3 py-1 text-sm font-semibold uppercase tracking-wider">
                  Official Application Recorded
                </Badge>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Thank You, {formData.name}!
                </h2>
                <p className="text-sm text-slate-600 max-w-lg mx-auto">
                  Your solar rooftop project application has been registered with Matri Shakti Infrastructure.
                </p>
              </div>

              <div className="mx-auto max-w-md p-5 bg-white border-2 border-emerald-300 rounded-xl text-left shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold uppercase">
                  <span>Your Unique Enquiry ID</span>
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-mono font-extrabold text-emerald-950 tracking-wider">
                  {submittedEnquiryId}
                </div>
                <div className="pt-2 border-t border-slate-200 text-xs text-slate-700 space-y-1">
                  <p><strong>System Capacity:</strong> {formData.requiredCapacityKW} KW Rooftop Solar</p>
                  <p><strong>Preferred Brand:</strong> {formData.interestedCompany}</p>
                  <p><strong>Installation City:</strong> {formData.city}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button
                  variant="outline"
                  className="gap-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => {
                    window.open(
                      `https://api.whatsapp.com/send/?phone=918948933657&text=Hello+Matri-Shakti+Infrastructure%2C+I+submitted+solar+application+${submittedEnquiryId}+for+${formData.requiredCapacityKW}KW+solar+system.+Please+share+next+steps.`,
                      "_blank"
                    );
                  }}
                >
                  <FaWhatsapp className="h-4 w-4 text-emerald-600" />
                  Chat on WhatsApp (8948933657)
                </Button>
                <Button className="bg-primary text-white hover:bg-primary/90" onClick={() => navigate({ to: "/" })}>
                  Return to Home
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="border border-slate-200 shadow-xl bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-amber-500 text-white text-xs font-semibold">UPNEDA Registered Partner</Badge>
                  <span className="text-xs text-slate-500">PM Surya Ghar Yojana Authorized</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Solar Project Application Form
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Please provide your installation and electricity details below. Our technical team will coordinate your site survey and subsidy filing.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 1. Contact Info */}
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" /> 1. Customer Personal & Contact Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                        <Input
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Ramesh Kumar Verma"
                          className="mt-1 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Mobile Number (10 Digits) *</label>
                        <Input
                          name="phone"
                          required
                          type="tel"
                          maxLength={10}
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. 9876543210"
                          className="mt-1 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700">WhatsApp Number</label>
                        <Input
                          name="whatsapp"
                          type="tel"
                          maxLength={10}
                          value={formData.whatsapp}
                          onChange={handleChange}
                          placeholder="For instant quotes & updates"
                          className="mt-1 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Email Address (Optional)</label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="customer@gmail.com"
                          className="mt-1 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-700">Full Installation Address *</label>
                        <Input
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="House/Plot No., Street, Landmark, Village / Colony"
                          className="mt-1 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700">City / Tehsil *</label>
                        <Input
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Paniyara / Maharajganj"
                          className="mt-1 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700">District *</label>
                        <Input
                          name="district"
                          required
                          value={formData.district}
                          onChange={handleChange}
                          placeholder="e.g. Maharajganj / Gorakhpur"
                          className="mt-1 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Electricity Details */}
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" /> 2. Electricity Department / DISCOM Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Consumer Name (As on Bill)</label>
                        <Input
                          name="consumerName"
                          value={formData.consumerName}
                          onChange={handleChange}
                          placeholder="Name printed on electricity bill"
                          className="mt-1 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Electricity Consumer / Account No.</label>
                        <Input
                          name="consumerNumber"
                          value={formData.consumerNumber}
                          onChange={handleChange}
                          placeholder="10 or 12 digit electricity account number"
                          className="mt-1 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Average Monthly Electricity Bill</label>
                        <select
                          name="billAmount"
                          value={formData.billAmount}
                          onChange={handleChange}
                          className="w-full mt-1 h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                        >
                          <option value="₹1,000 - ₹2,000 / month">₹1,000 - ₹2,000 / month</option>
                          <option value="₹2,000 - ₹3,500 / month">₹2,000 - ₹3,500 / month</option>
                          <option value="₹3,500 - ₹5,000 / month">₹3,500 - ₹5,000 / month</option>
                          <option value="₹5,000 - ₹8,000 / month">₹5,000 - ₹8,000 / month</option>
                          <option value="₹8,000 - ₹15,000 / month">₹8,000 - ₹15,000 / month</option>
                          <option value="Above ₹15,000 / month">Above ₹15,000 / month</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Connection Category</label>
                        <select
                          name="connectionType"
                          value={formData.connectionType}
                          onChange={handleChange}
                          className="w-full mt-1 h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                        >
                          <option value="Domestic / Residential">Domestic / Residential (PM Surya Ghar)</option>
                          <option value="Commercial">Commercial / Office</option>
                          <option value="Industrial / Factory">Industrial / Factory</option>
                          <option value="Agricultural / Pump">Agricultural / Solar Pump</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 3. Solar Preferences */}
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Sun className="h-4 w-4 text-primary" /> 3. Solar System Requirement (1 KW – 20 KW)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700">System Capacity (1–20 KW) *</label>
                        <select
                          name="requiredCapacityKW"
                          value={formData.requiredCapacityKW}
                          onChange={handleChange}
                          className="w-full mt-1 h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-bold text-primary shadow-sm"
                        >
                          {Array.from({ length: 20 }, (_, i) => i + 1).map((kw) => (
                            <option key={kw} value={kw}>
                              {kw} KW Solar System {kw <= 3 ? "(Max Subsidy Zone)" : "(High Load Capacity)"}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Preferred Solar Brand</label>
                        <select
                          name="interestedCompany"
                          value={formData.interestedCompany}
                          onChange={handleChange}
                          className="w-full mt-1 h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                        >
                          <option value="Tata Power Solar">Tata Power Solar</option>
                          <option value="Adani Solar">Adani Solar</option>
                          <option value="Waaree Solar">Waaree Solar</option>
                          <option value="Usha Solar">Usha Solar</option>
                          <option value="Vikram Solar">Vikram Solar</option>
                          <option value="Loom Solar">Loom Solar</option>
                          {companies
                            .filter((c) => !["Tata Power Solar", "Adani Solar", "Waaree Solar", "Usha Solar", "Vikram Solar", "Loom Solar"].includes(c.name))
                            .map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                          <Briefcase className="h-3.5 w-3.5 text-primary" />
                          Referred by Authorized Dealer / Vendor (Optional)
                        </label>
                        <select
                          name="dealerId"
                          value={formData.dealerId}
                          onChange={(e) => {
                            const selId = e.target.value;
                            const match = dealers.find((d) => d.dealerId === selId);
                            setFormData({
                              ...formData,
                              dealerId: selId,
                              dealerName: match ? match.dealerName : "",
                            });
                          }}
                          className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs shadow-sm"
                        >
                          <option value="">-- Direct Customer (No Dealer Referral) --</option>
                          {dealers.map((d) => (
                            <option key={d.dealerId} value={d.dealerId}>
                              {d.dealerName} ({d.city}) — [{d.dealerId}]
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-700">Remarks / Questions</label>
                        <Textarea
                          name="message"
                          rows={2}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="e.g. Rooftop area available, battery requirement, or subsidy filing assistance"
                          className="mt-1 bg-white text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span>Zero Registration Fees • 100% Secure & Confidential</span>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold gap-2 shadow-lg"
                    >
                      {isSubmitting ? (
                        "Submitting Application..."
                      ) : (
                        <>
                          Submit Solar Application <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </Section>
    </>
  );
}
