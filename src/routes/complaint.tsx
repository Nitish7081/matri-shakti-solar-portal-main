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
} from "lucide-react";

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

                  <CardContent className="p-6 space-y-5 text-xs">
                    <div className="grid gap-3 sm:grid-cols-2 rounded-lg bg-muted/30 p-4 border border-border/60">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Customer Name</span>
                        <span className="font-bold text-foreground text-sm">{trackedComplaint.customerName}</span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">Assigned Technician</span>
                        <span className="font-bold text-foreground flex items-center gap-1 text-sm">
                          <Wrench className="h-3.5 w-3.5 text-primary" />
                          {trackedComplaint.assignedTechnicianName || "Under Review (Dispatch Pending)"}
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
