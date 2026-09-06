import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Wrench,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Search,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  Award,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export interface ITechnicianItem {
  id: string;
  technicianId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  specialization: string;
  active: boolean;
  availability: "AVAILABLE" | "ON_JOB" | "ON_LEAVE";
  assignedJobsCount: number;
  assignedProjectIds: string[];
  assignedComplaintIds: string[];
  notes?: string;
  createdAt: string;
}

interface TechnicianManagerProps {
  onRefreshStats?: () => void;
}

export function TechnicianManager({ onRefreshStats }: TechnicianManagerProps) {
  const [technicians, setTechnicians] = useState<ITechnicianItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL");
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [technicianToEdit, setTechnicianToEdit] = useState<ITechnicianItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    specialization: "Solar Rooftop & Inverter Systems",
    availability: "AVAILABLE" as "AVAILABLE" | "ON_JOB" | "ON_LEAVE",
    active: true,
    notes: "",
  });

  // Delete State
  const [techToDelete, setTechToDelete] = useState<ITechnicianItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  const fetchTechnicians = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (availabilityFilter !== "ALL") params.append("availability", availabilityFilter);
      if (activeFilter === "ACTIVE") params.append("active", "true");
      if (activeFilter === "INACTIVE") params.append("active", "false");

      const res = await fetch(`${baseUrl}/api/technicians?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load technicians");
      setTechnicians(data.technicians || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch technicians");
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, search, availabilityFilter, activeFilter]);

  useEffect(() => {
    fetchTechnicians();
  }, [fetchTechnicians]);

  const openAddModal = () => {
    setTechnicianToEdit(null);
    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      specialization: "Solar Rooftop & Inverter Systems",
      availability: "AVAILABLE",
      active: true,
      notes: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tech: ITechnicianItem) => {
    setTechnicianToEdit(tech);
    setForm({
      name: tech.name,
      phone: tech.phone,
      email: tech.email || "",
      address: tech.address || "",
      specialization: tech.specialization || "Solar Rooftop & Inverter Systems",
      availability: tech.availability,
      active: tech.active,
      notes: tech.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveTechnician = async () => {
    if (!form.name.trim()) return toast.error("Technician name is required");
    if (!form.phone.trim() || form.phone.length < 10)
      return toast.error("Valid 10-digit phone number is required");

    setIsSaving(true);
    try {
      const isEdit = !!technicianToEdit;
      const url = isEdit
        ? `${baseUrl}/api/technicians/${technicianToEdit.technicianId}`
        : `${baseUrl}/api/technicians`;
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save technician");

      toast.success(isEdit ? "Technician updated successfully" : "Technician registered successfully!");
      setIsModalOpen(false);
      fetchTechnicians();
      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      toast.error(err.message || "Failed to save technician");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTechnician = async () => {
    if (!techToDelete) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/technicians/${techToDelete.technicianId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete technician");

      toast.success("Technician deleted successfully");
      setIsDeleteModalOpen(false);
      setTechToDelete(null);
      fetchTechnicians();
      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete technician");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (tech: ITechnicianItem) => {
    try {
      const res = await fetch(`${baseUrl}/api/technicians/${tech.technicianId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify({ active: !tech.active }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Technician marked as ${!tech.active ? "Active" : "Inactive"}`);
      fetchTechnicians();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1 font-semibold text-[11px]">
            <CheckCircle2 className="h-3 w-3" /> Available
          </Badge>
        );
      case "ON_JOB":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1 font-semibold text-[11px]">
            <Clock className="h-3 w-3" /> On Job
          </Badge>
        );
      case "ON_LEAVE":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center gap-1 font-semibold text-[11px]">
            <AlertCircle className="h-3 w-3" /> On Leave
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const availableCount = technicians.filter((t) => t.active && t.availability === "AVAILABLE").length;
  const onJobCount = technicians.filter((t) => t.active && t.availability === "ON_JOB").length;

  return (
    <div className="space-y-6">
      {/* KPI Top Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Technicians
            </CardTitle>
            <Wrench className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-foreground">{technicians.length}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Field engineers & mechanics</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Available Now
            </CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-emerald-600">{availableCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Ready for assignment</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Currently On Job
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-amber-600">{onJobCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Active on survey/install</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Total Active
            </CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-blue-600">
              {technicians.filter((t) => t.active).length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Operational staff</p>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar */}
      <Card className="border-border/60 bg-card shadow-sm">
        <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, phone, ID, skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Availabilities</option>
              <option value="AVAILABLE">Available</option>
              <option value="ON_JOB">On Job</option>
              <option value="ON_LEAVE">On Leave</option>
            </select>

            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchTechnicians()}
              disabled={isLoading}
              className="h-9 text-xs gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button
              size="sm"
              onClick={openAddModal}
              className="h-9 text-xs gap-1.5 bg-primary text-white hover:bg-primary/90 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Technician
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Technicians List / Cards */}
      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
          Loading technicians...
        </div>
      ) : technicians.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 p-12 text-center">
          <Wrench className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-sm font-semibold text-foreground">No Technicians Found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {search ? "Try adjusting your search criteria" : "Register field technicians to assign site survey and installation tasks."}
          </p>
          <Button size="sm" onClick={openAddModal} className="mt-4 text-xs gap-1.5 bg-primary text-white">
            <Plus className="h-4 w-4" /> Add First Technician
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {technicians.map((tech) => (
            <Card
              key={tech.technicianId}
              className={`border-border/60 bg-card shadow-sm transition-all hover:shadow-md ${
                !tech.active ? "opacity-60 bg-muted/30" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {tech.technicianId}
                      </span>
                      {getAvailabilityBadge(tech.availability)}
                    </div>
                    <CardTitle className="text-base font-bold text-foreground mt-2">{tech.name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Award className="h-3 w-3 text-amber-500" />
                      {tech.specialization}
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => openEditModal(tech)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      onClick={() => {
                        setTechToDelete(tech);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0 text-xs">
                <div className="space-y-1.5 border-t border-border/50 pt-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-primary" /> Phone
                    </span>
                    <div className="flex items-center gap-2 font-medium">
                      <a href={`tel:${tech.phone}`} className="hover:text-primary hover:underline">
                        {tech.phone}
                      </a>
                      <a
                        href={`https://wa.me/91${tech.phone.replace(/[^0-9]/g, "").slice(-10)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-500 hover:text-emerald-600"
                        title="Chat on WhatsApp"
                      >
                        <FaWhatsapp className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                  {tech.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-primary" /> Email
                      </span>
                      <a href={`mailto:${tech.email}`} className="text-foreground hover:text-primary font-medium truncate max-w-[180px]">
                        {tech.email}
                      </a>
                    </div>
                  )}

                  {tech.address && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-primary" /> Address
                      </span>
                      <span className="text-foreground font-medium truncate max-w-[180px]">{tech.address}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Briefcase className="h-3 w-3 text-primary" /> Assigned Workload
                    </span>
                    <span className="font-bold text-foreground bg-accent px-2 py-0.5 rounded text-[11px]">
                      {tech.assignedJobsCount || 0} active jobs
                    </span>
                  </div>
                </div>

                {tech.notes && (
                  <p className="rounded bg-muted/50 p-2 text-[11px] text-muted-foreground italic border border-border/40">
                    &ldquo;{tech.notes}&rdquo;
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <span className="text-[11px] text-muted-foreground">
                    Status:{" "}
                    <span className={tech.active ? "text-emerald-600 font-semibold" : "text-muted-foreground"}>
                      {tech.active ? "Active" : "Inactive"}
                    </span>
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] px-2.5"
                    onClick={() => toggleStatus(tech)}
                  >
                    {tech.active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Technician Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              {technicianToEdit ? `Edit Technician — ${technicianToEdit.technicianId}` : "Register New Technician"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Fill in the staff details for solar surveys, electrical commissioning, and complaint dispatches.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">
                Technician Name <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Ramesh Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-medium text-foreground block mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="10-digit mobile"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <label className="font-medium text-foreground block mb-1">Email (Optional)</label>
                <Input
                  placeholder="tech@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">Specialization / Skills</label>
              <Input
                placeholder="e.g. Rooftop Solar, Inverter Wiring, Net Metering"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-medium text-foreground block mb-1">Availability Status</label>
                <select
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value as any })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="ON_JOB">On Job</option>
                  <option value="ON_LEAVE">On Leave</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">Active Status</label>
                <select
                  value={form.active ? "true" : "false"}
                  onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="true">Active Staff</option>
                  <option value="false">Inactive / Suspended</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">Base Location / Address</label>
              <Input
                placeholder="e.g. Paniyara, Maharajganj"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">Notes & Certifications</label>
              <Textarea
                placeholder="Experience details, toolkit assignment, certifications..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="text-xs min-h-[60px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveTechnician}
              disabled={isSaving}
              className="text-xs bg-primary text-white hover:bg-primary/90"
            >
              {isSaving ? "Saving..." : technicianToEdit ? "Update Technician" : "Save Technician"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-rose-600 flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Delete Technician?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to remove{" "}
              <strong className="text-foreground">{techToDelete?.name}</strong> ({techToDelete?.technicianId})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteTechnician}
              disabled={isSaving}
              className="text-xs"
            >
              {isSaving ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
