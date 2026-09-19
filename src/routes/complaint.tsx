import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, Section } from "@/components/shared/Section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Headphones,
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  Send,
  ArrowRight,
  Phone,
  Calendar,
  UserCheck,
  FileText,
  AlertCircle,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export const Route = createFileRoute("/complaint")({
  head: () => ({
    meta: [
      { title: "Customer Support & Complaint Tracking — Matri Shakti Solar" },
      {
        name: "description",
        content:
          "Register a solar rooftop complaint or track your existing service ticket status online with Matri Shakti Infrastructure.",
      },
    ],
  }),
  component: ComplaintPage,
});

const CATEGORIES = [
  "Panel Issue",
  "Inverter Issue",
  "Generation Issue",
  "Net Metering",
  "Installation Issue",
  "Maintenance",
  "Warranty",
  "Cleaning",
  "Other",
] as const;

function ComplaintPage() {
  const [activeTab, setActiveTab] = useState<"register" | "track">("register");

  // Register Form State
  const [formData, setFormData] = useState({
    customerName: "",
    mobile: "",
    email: "",
    projectId: "",
    companyName: "Tata Power Solar",
    model: "",
    category: "Generation Issue",
    description: "",
    preferredContact: "Phone Call",
    photoUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  // Track Form State
  const [trackComplaintId, setTrackComplaintId] = useState("");
  const [trackMobile, setTrackMobile] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackedComplaint, setTrackedComplaint] = useState<any | null>(null);

  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  // Submit Complaint Handler
  const handleRegisterComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) return toast.error("Please enter your name");
    if (!formData.mobile.trim() || formData.mobile.length < 10)
      return toast.error("Please enter a valid 10-digit mobile number");
    if (!formData.description.trim() || formData.description.length < 5)
      return toast.error("Please provide a description of the issue");

    setIsSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/api/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit complaint");

      setSubmittedTicketId(data.complaintId);
      toast.success(data.message);
      // Reset form
      setFormData({
        customerName: "",
        mobile: "",
        email: "",
        projectId: "",
        companyName: "Tata Power Solar",
        model: "",
        category: "Generation Issue",
        description: "",
        preferredContact: "Phone Call",
        photoUrl: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Track Complaint Handler
  const handleTrackComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackComplaintId.trim()) return toast.error("Please enter your Complaint / Ticket ID");
    if (!trackMobile.trim()) return toast.error("Please enter your registered mobile number");

    setIsTracking(true);
    setTrackedComplaint(null);
    try {
      const res = await fetch(`${baseUrl}/api/complaints/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaintId: trackComplaintId,
          mobile: trackMobile,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Complaint lookup failed");

      setTrackedComplaint(data.complaint);
      toast.success("Complaint details loaded!");
    } catch (err: any) {
      toast.error(err.message || "Could not find complaint record");
    } finally {
      setIsTracking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "bg-cyan-500/10 text-cyan-600 border-cyan-500/30";
      case "UNDER_REVIEW":
        return "bg-amber-500/10 text-amber-600 border-amber-500/30";
      case "TECHNICIAN_ASSIGNED":
        return "bg-blue-500/10 text-blue-600 border-blue-500/30";
      case "IN_PROGRESS":
        return "bg-purple-500/10 text-purple-600 border-purple-500/30";
      case "RESOLVED":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
      case "CLOSED":
        return "bg-gray-500/10 text-gray-600 border-gray-500/30";
      default:
        return "bg-muted text-foreground";
    }
  };

  const getWorkflowStep = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return 1;
      case "UNDER_REVIEW":
        return 2;
      case "TECHNICIAN_ASSIGNED":
        return 3;
      case "IN_PROGRESS":
        return 4;
      case "RESOLVED":
      case "CLOSED":
        return 5;
      default:
        return 1;
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Helpdesk & Service Support"
        title="Solar Service & Complaint Portal"
        description="Facing generation drop, inverter faults, or net-metering queries? Submit a ticket or track your service request online."
      />

      <Section>
        <div className="mx-auto max-w-4xl">
          {/* Tab Selector Buttons */}
          <div className="flex rounded-xl bg-muted/60 p-1.5 border border-border/80 mb-8 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-lg transition-all ${
                activeTab === "register"
                  ? "bg-primary text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Headphones className="h-4 w-4" />
              Register Complaint
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("track")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-lg transition-all ${
                activeTab === "track"
                  ? "bg-primary text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Search className="h-4 w-4" />
              Track Status
            </button>
          </div>

          {/* ---------------------------------------------------- */}
          {/* TAB 1: REGISTER COMPLAINT */}
          {/* ---------------------------------------------------- */}
          {activeTab === "register" && (
            <Card className="border-border/80 bg-card shadow-card">
              <CardHeader className="border-b border-border/60 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  Service & Breakdown Request Form
                </CardTitle>
                <CardDescription className="text-xs">
                  Fill in your installation details. A sequential Ticket ID will be generated for technician dispatch.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                {submittedTicketId && (
                  <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <h3 className="font-display font-bold text-foreground text-base">
                      Complaint Registered Successfully!
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your Ticket ID has been generated:
                    </p>
                    <div className="mt-2 inline-block font-mono font-extrabold text-lg text-primary bg-background px-4 py-1.5 rounded-lg border border-primary/30">
                      {submittedTicketId}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2">
                      Please save this Ticket ID along with your phone number to track live updates.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setTrackComplaintId(submittedTicketId);
                        setActiveTab("track");
                      }}
                      className="mt-4 text-xs gap-1.5 bg-primary text-white hover:bg-primary/90"
                    >
                      Track This Ticket Now <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

                <form onSubmit={handleRegisterComplaint} className="space-y-4 text-xs">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g. Rajesh Verma"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        required
                        className="h-10 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Registered Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="10-digit mobile number"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        required
                        className="h-10 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="font-semibold text-foreground block mb-1">Email (Optional)</label>
                      <Input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-10 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Customer Project ID (If available)
                      </label>
                      <Input
                        placeholder="e.g. MS-PROJ-2026-000001"
                        value={formData.projectId}
                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                        className="h-10 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="font-semibold text-foreground block mb-1">Solar Brand / Company</label>
                      <Input
                        placeholder="e.g. Tata Power Solar"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="h-10 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Issue Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-foreground block mb-1">Preferred Contact Method</label>
                      <select
                        value={formData.preferredContact}
                        onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="Phone Call">Phone Call</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Email">Email</option>
                        <option value="Visit">Site Visit</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Problem Description <span className="text-rose-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Please explain the issue (e.g. error code on inverter, red light flashing, net-meter not recording export, panel physical damage)..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      className="text-xs min-h-[90px]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Optional Photo Reference (URL or Image path)
                    </label>
                    <Input
                      placeholder="e.g. https://... or leave empty"
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      className="h-10 text-xs"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 text-xs font-bold gap-2 bg-primary text-white hover:bg-primary/90 shadow-md"
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? "Submitting Service Ticket..." : "Submit Complaint / Service Request"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 2: TRACK COMPLAINT STATUS */}
          {/* ---------------------------------------------------- */}
          {activeTab === "track" && (
            <div className="space-y-6">
              <Card className="border-border/80 bg-card shadow-card">
                <CardHeader className="border-b border-border/60 pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Track Your Complaint Status
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Enter your Ticket ID (e.g. MS-2026-000123) and your registered 10-digit mobile number.
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                  <form onSubmit={handleTrackComplaint} className="space-y-4 text-xs">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="font-semibold text-foreground block mb-1">
                          Ticket ID <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          placeholder="e.g. MS-2026-000123"
                          value={trackComplaintId}
                          onChange={(e) => setTrackComplaintId(e.target.value)}
                          required
                          className="h-10 text-xs font-mono uppercase"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-foreground block mb-1">
                          Registered Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          placeholder="10-digit mobile number"
                          value={trackMobile}
                          onChange={(e) => setTrackMobile(e.target.value)}
                          required
                          className="h-10 text-xs"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isTracking}
                      className="w-full h-10 text-xs font-bold gap-2 bg-primary text-white hover:bg-primary/90"
                    >
                      <Search className="h-4 w-4" />
                      {isTracking ? "Checking Status..." : "Lookup Service Status"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Track Result Card */}
              {trackedComplaint && (
                <Card className="border-border/80 bg-card shadow-card overflow-hidden animate-in fade-in">
                  <CardHeader className="bg-muted/40 border-b border-border/60 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded">
                          {trackedComplaint.complaintId}
                        </span>
                        <CardTitle className="text-base font-bold mt-2">
                          {trackedComplaint.category}
                        </CardTitle>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold text-xs px-3 py-1 rounded-full border ${getStatusColor(
                            trackedComplaint.status
                          )}`}
                        >
                          {trackedComplaint.status}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6 text-xs">
                    {/* Workflow Progress Stepper */}
                    <div className="py-2 px-1">
                      <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-3.5 -translate-y-1/2 h-1 bg-muted w-full -z-0 rounded" />
                        <div
                          className="absolute left-0 top-3.5 -translate-y-1/2 h-1 bg-primary transition-all duration-500 -z-0 rounded"
                          style={{
                            width: `${
                              getWorkflowStep(trackedComplaint.status) <= 1
                                ? 10
                                : getWorkflowStep(trackedComplaint.status) === 2
                                ? 32
                                : getWorkflowStep(trackedComplaint.status) === 3
                                ? 58
                                : getWorkflowStep(trackedComplaint.status) === 4
                                ? 82
                                : 100
                            }%`,
                          }}
                        />

                        {[
                          { step: 1, label: "Registered", desc: "Ticket logged" },
                          { step: 2, label: "Under Review", desc: "Desk analysis" },
                          { step: 3, label: "Tech Assigned", desc: "Engineer dispatched" },
                          { step: 4, label: "In Progress", desc: "Field service" },
                          { step: 5, label: "Resolved", desc: "Work completed" },
                        ].map((s) => {
                          const current = getWorkflowStep(trackedComplaint.status);
                          const isDone = current >= s.step;
                          const isActive = current === s.step;
                          return (
                            <div key={s.step} className="relative z-10 flex flex-col items-center">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shadow-sm ${
                                  isDone
                                    ? "bg-primary text-white ring-4 ring-primary/15"
                                    : "bg-card border border-border text-muted-foreground"
                                } ${isActive ? "scale-110 ring-primary/30" : ""}`}
                              >
                                {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.step}
                              </div>
                              <span
                                className={`mt-2 text-[10px] sm:text-[11px] font-semibold text-center whitespace-nowrap ${
                                  isActive ? "text-primary font-bold" : isDone ? "text-foreground" : "text-muted-foreground"
                                }`}
                              >
                                {s.label}
                              </span>
                              <span className="hidden sm:block text-[9px] text-muted-foreground text-center">
                                {s.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dedicated Assigned Field Technician & Work Order Card */}
                    {trackedComplaint.assignedTechnicianName && trackedComplaint.assignedTechnicianName !== "Pending Assignment" ? (
                      <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/25 p-5 space-y-4 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/15 pb-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-inner">
                              <Wrench className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                  Assigned Field Technician
                                </span>
                                {trackedComplaint.assignedDate && (
                                  <span className="text-[10px] text-muted-foreground">
                                    Assigned on {trackedComplaint.assignedDate}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-base font-bold text-foreground mt-0.5">
                                {trackedComplaint.assignedTechnicianName}
                              </h3>
                            </div>
                          </div>

                          {trackedComplaint.assignedTechnicianPhone && (
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${trackedComplaint.assignedTechnicianPhone}`}
                                className="inline-flex items-center gap-1.5 bg-primary text-white hover:bg-primary/90 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
                              >
                                <Phone className="h-3.5 w-3.5" /> Call Engineer
                              </a>
                              <a
                                href={`https://wa.me/91${trackedComplaint.assignedTechnicianPhone.replace(/[^0-9]/g, "").slice(-10)}?text=Hello%20${encodeURIComponent(trackedComplaint.assignedTechnicianName)}%2C%20regarding%20my%20Matri%20Shakti%20Solar%20Service%20Ticket%20${encodeURIComponent(trackedComplaint.complaintId)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
                              >
                                <FaWhatsapp className="h-3.5 w-3.5" /> WhatsApp
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="bg-background/90 rounded-lg p-3.5 border border-border/60">
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 mb-1 font-medium">
                              <Calendar className="h-3.5 w-3.5 text-primary" /> Scheduled Field Visit
                            </span>
                            {trackedComplaint.visitDate ? (
                              <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                                <span>{trackedComplaint.visitDate}</span>
                                {trackedComplaint.visitTime && (
                                  <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                    {trackedComplaint.visitTime}
                                  </span>
                                )}
                              </p>
                            ) : (
                              <p className="text-foreground text-xs font-medium">
                                Visit will be scheduled — technician will coordinate by phone
                              </p>
                            )}
                          </div>

                          <div className="bg-background/90 rounded-lg p-3.5 border border-border/60">
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 mb-1 font-medium">
                              <UserCheck className="h-3.5 w-3.5 text-primary" /> Engineer Specialization
                            </span>
                            <p className="font-semibold text-foreground text-xs">
                              {trackedComplaint.assignedTechnicianSpecialization || "Solar Rooftop & Inverter Systems"}
                            </p>
                            {trackedComplaint.assignedTechnicianPhone && (
                              <span className="text-[11px] text-muted-foreground font-mono block mt-0.5">
                                Mobile: {trackedComplaint.assignedTechnicianPhone}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Assigned Work & Service Scope Details */}
                        <div className="bg-background/90 rounded-lg p-3.5 border border-border/60 space-y-1">
                          <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-primary" /> Assigned Work & Scope of Inspection
                          </span>
                          <p className="text-foreground text-xs leading-relaxed bg-muted/40 p-2.5 rounded border border-border/40 font-medium">
                            {trackedComplaint.assignedWork || "On-site solar installation diagnosis, electrical wiring verification, inverter error code analysis, and component inspection."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-3">
                        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-xs text-amber-800 dark:text-amber-300">
                            Technician Dispatch in Progress
                          </h4>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                            Your service request has been logged and received by our engineering desk. An authorized solar engineer is being allocated to your location. Once dispatched, their name, contact phone, and visit schedule will appear right here.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Customer & Issue Summary Grid */}
                    <div className="grid gap-3 sm:grid-cols-2 rounded-lg bg-muted/30 p-4 border border-border/60">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Customer Name</span>
                        <span className="font-bold text-foreground text-sm">{trackedComplaint.customerName}</span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">Ticket Category & Priority</span>
                        <span className="font-bold text-foreground flex items-center gap-1 text-sm">
                          {trackedComplaint.category} <span className="text-xs font-normal text-muted-foreground">({trackedComplaint.priority} Priority)</span>
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-foreground block mb-1 text-xs">Reported Problem:</span>
                      <p className="rounded-lg bg-card p-3 border border-border/60 text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {trackedComplaint.description}
                      </p>
                    </div>

                    {trackedComplaint.resolution && (
                      <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20">
                        <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Resolution Completed
                        </h4>
                        <p className="text-foreground leading-relaxed">{trackedComplaint.resolution}</p>
                        {trackedComplaint.resolutionDate && (
                          <span className="text-[11px] text-muted-foreground block mt-1">
                            Resolved on {trackedComplaint.resolutionDate}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Timeline */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary" /> Status Progress Timeline
                      </h4>
                      <div className="space-y-3 border-l-2 border-primary/40 pl-4">
                        {trackedComplaint.timeline && trackedComplaint.timeline.length > 0 ? (
                          trackedComplaint.timeline.map((event: any, i: number) => (
                            <div key={i} className="relative">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-foreground text-xs">{event.title}</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {event.date} {event.time}
                                </span>
                              </div>
                              {event.notes && <p className="text-[11px] text-muted-foreground mt-0.5">{event.notes}</p>}
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-xs">Ticket logged in system.</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
