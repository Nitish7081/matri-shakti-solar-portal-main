import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

interface ApplyModalProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  defaultCompany?: string;
  defaultCapacity?: number;
  defaultProduct?: string;
}

export function ApplyModal({
  open,
  isOpen,
  onOpenChange,
  onClose,
  defaultCompany = "",
  defaultCapacity = 5,
  defaultProduct = "",
}: ApplyModalProps) {
  const actualOpen = Boolean(open ?? isOpen);
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
    requiredCapacityKW: defaultCapacity,
    interestedCompany: defaultCompany,
    interestedProduct: defaultProduct,
    dealerId: "",
    dealerName: "",
    message: "",
  });

  const [companies, setCompanies] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [dealers, setDealers] = useState<Array<{ dealerId: string; dealerName: string; city: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  // Load companies and active dealers
  useEffect(() => {
    if (actualOpen) {
      fetch(`${baseUrl}/api/companies`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.companies) {
            setCompanies(data.companies);
            if (!formData.interestedCompany && data.companies.length > 0) {
              setFormData((prev) => ({
                ...prev,
                interestedCompany: defaultCompany || data.companies[0].name,
              }));
            }
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
    }
  }, [actualOpen, baseUrl, defaultCompany]);

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
        interestedProduct: formData.interestedProduct || `${formData.interestedCompany} ${formData.requiredCapacityKW} KW System`,
        message: formData.message.trim(),
        source: "apply-modal",
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
      toast.success("Application submitted successfully under PM Surya Ghar Muft Bijli Yojana!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedEnquiryId(null);
    if (onOpenChange) onOpenChange(false);
    if (onClose) onClose();
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) handleClose();
    else if (onOpenChange) onOpenChange(true);
  };

  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-white border border-slate-200 shadow-2xl rounded-2xl">
        {submittedEnquiryId ? (
          <div className="py-8 text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1 text-sm font-semibold uppercase tracking-wider">
                Application Registered
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Thank You, {formData.name}!
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Your PM Surya Ghar Muft Bijli Yojana rooftop solar application has been submitted to Matri Shakti Infrastructure.
              </p>
            </div>

            <div className="mx-auto max-w-md p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-xl text-left shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold uppercase">
                <span>Unique Application / Enquiry ID</span>
                <Sparkles className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-950 tracking-wider">
                {submittedEnquiryId}
              </div>
              <div className="pt-2 border-t border-emerald-200 text-xs text-slate-700 space-y-1">
                <p><strong>System Capacity:</strong> {formData.requiredCapacityKW} KW Rooftop Solar</p>
                <p><strong>Preferred Brand:</strong> {formData.interestedCompany || "Tata Power Solar"}</p>
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
              <Button className="bg-primary text-white hover:bg-primary/90" onClick={handleClose}>
                Done & Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-500 text-white font-medium text-xs px-2 py-0.5">
                  PM Surya Ghar Yojana
                </Badge>
                <span className="text-xs text-slate-500">Authorized UPNEDA Partner</span>
              </div>
              <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                Apply for Rooftop Solar System (1 KW – 20 KW)
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600">
                Fill this official application to book a zero-cost physical site survey, calculate your state & central subsidy, and initiate bi-directional net metering.
              </DialogDescription>
            </DialogHeader>

            {/* Section 1: Personal & Contact Details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> 1. Customer Personal & Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="text-xs font-semibold text-slate-700">10-Digit Mobile Number *</label>
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

            {/* Section 2: Electricity Department Details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" /> 2. Electricity Department / DISCOM Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Consumer Name (As per Bill)</label>
                  <Input
                    name="consumerName"
                    value={formData.consumerName}
                    onChange={handleChange}
                    placeholder="Name printed on electricity bill"
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Consumer / Account Number</label>
                  <Input
                    name="consumerNumber"
                    value={formData.consumerNumber}
                    onChange={handleChange}
                    placeholder="10 or 12 digit electricity account number"
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Average Monthly Bill</label>
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
                  <label className="text-xs font-semibold text-slate-700">Connection Type</label>
                  <select
                    name="connectionType"
                    value={formData.connectionType}
                    onChange={handleChange}
                    className="w-full mt-1 h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Domestic / Residential">Domestic / Residential (PM Surya Ghar)</option>
                    <option value="Commercial">Commercial / Office</option>
                    <option value="Industrial / Factory">Industrial / Factory</option>
                    <option value="Agricultural / Pump">Agricultural / Solar Water Pump</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Solar System Capacity & Brand */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sun className="h-4 w-4 text-primary" /> 3. Solar System Requirement (1 KW – 20 KW)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Required Solar Capacity (1–20 KW) *</label>
                  <select
                    name="requiredCapacityKW"
                    value={formData.requiredCapacityKW}
                    onChange={handleChange}
                    className="w-full mt-1 h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-semibold shadow-sm text-primary"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((kw) => (
                      <option key={kw} value={kw}>
                        {kw} KW System {kw <= 3 ? "(High Subsidy Zone)" : "(Large Rooftop / Commercial)"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Preferred Solar Company</label>
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
                  <label className="text-xs font-semibold text-slate-700">Additional Remarks / Questions</label>
                  <Textarea
                    name="message"
                    rows={2}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="e.g. Need bank EMI financing, or 3-phase connection details"
                    className="mt-1 bg-white text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>UPNEDA Verified • Data 100% Encrypted & Safe</span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold flex-1 sm:flex-none gap-2"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Application <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
