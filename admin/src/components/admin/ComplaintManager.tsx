import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Headphones,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Phone,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export interface IComplaintItem {
  id: string;
  complaintId: string;
  customerName: string;
  mobile: string;
  email?: string;
  projectId?: string;
  installationId?: string;
  companyName?: string;
  model?: string;
  category: string;
  description: string;
  preferredContact: string;
  photoUrl?: string;
  status:
    | "RECEIVED"
    | "UNDER_REVIEW"
    | "TECHNICIAN_ASSIGNED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "REJECTED"
    | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  assignedDate?: string;
  visitDate?: string;
  resolution?: string;
  resolutionDate?: string;
  timeline: Array<{
    id: string;
    status: string;
    title: string;
    date: string;
    time?: string;
    user: string;
    notes?: string;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ComplaintManagerProps {
  onRefreshStats?: () => void;
}

export function ComplaintManager({ onRefreshStats }: ComplaintManagerProps) {
  const [complaints, setComplaints] = useState<IComplaintItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // View & Edit Modal
  const [selectedComplaint, setSelectedComplaint] = useState<IComplaintItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit fields
  const [editStatus, setEditStatus] = useState<string>("RECEIVED");
  const [editPriority, setEditPriority] = useState<string>("MEDIUM");
  const [editTechName, setEditTechName] = useState<string>("");
  const [editResolution, setEditResolution] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  // Available Technicians list for assignment
  const [availableTechs, setAvailableTechs] = useState<Array<{ name: string; phone: string; technicianId: string }>>([]);

  // Delete State
  const [itemToDelete, setItemToDelete] = useState<IComplaintItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (priorityFilter !== "ALL") params.append("priority", priorityFilter);
      if (categoryFilter !== "ALL") params.append("category", categoryFilter);

      const res = await fetch(`${baseUrl}/api/complaints?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load complaints");
      setComplaints(data.complaints || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch complaints");
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, search, statusFilter, priorityFilter, categoryFilter]);

  const fetchAvailableTechs = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/api/technicians`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableTechs(data.technicians || []);
      }
    } catch {
      // ignore
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchComplaints();
    fetchAvailableTechs();
  }, [fetchComplaints, fetchAvailableTechs]);

  const openViewModal = (item: IComplaintItem) => {
    setSelectedComplaint(item);
    setIsViewModalOpen(true);
  };

  const openEditModal = (item: IComplaintItem) => {
    setSelectedComplaint(item);
    setEditStatus(item.status);
    setEditPriority(item.priority);
    setEditTechName(item.assignedTechnicianName || "");
    setEditResolution(item.resolution || "");
    setEditNotes(item.notes || "");
    setIsEditModalOpen(true);
  };

  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/complaints/${selectedComplaint.complaintId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify({
          status: editStatus,
          priority: editPriority,
          assignedTechnicianName: editTechName,
          resolution: editResolution,
          notes: editNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update complaint");

      toast.success("Complaint record and timeline updated!");
      setIsEditModalOpen(false);
      fetchComplaints();
      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      toast.error(err.message || "Failed to update complaint");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteComplaint = async () => {
    if (!itemToDelete) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/complaints/${itemToDelete.complaintId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete complaint");

      toast.success("Complaint deleted");
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      fetchComplaints();
      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete complaint");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return <Badge className="bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 text-[11px]">Received</Badge>;
      case "UNDER_REVIEW":
        return <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[11px]">Under Review</Badge>;
      case "TECHNICIAN_ASSIGNED":
        return <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[11px]">Tech Assigned</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/20 text-[11px]">In Progress</Badge>;
      case "RESOLVED":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[11px]">Resolved</Badge>;
      case "CLOSED":
        return <Badge className="bg-gray-500/10 text-gray-600 border border-gray-500/20 text-[11px]">Closed</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[11px]">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <span className="font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded text-[10px] border border-rose-500/30">URGENT</span>;
      case "HIGH":
        return <span className="font-semibold text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded text-[10px]">HIGH</span>;
      case "MEDIUM":
        return <span className="font-medium text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded text-[10px]">MEDIUM</span>;
      case "LOW":
        return <span className="font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded text-[10px]">LOW</span>;
      default:
        return <span>{priority}</span>;
    }
  };

  const openComplaintsCount = complaints.filter((c) =>
    ["RECEIVED", "UNDER_REVIEW", "TECHNICIAN_ASSIGNED", "IN_PROGRESS"].includes(c.status)
  ).length;

  const resolvedCount = complaints.filter((c) => c.status === "RESOLVED" || c.status === "CLOSED").length;

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Support Tickets
            </CardTitle>
            <Headphones className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-foreground">{complaints.length}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Customer complaints & queries</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Open / In Progress
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-amber-600">{openComplaintsCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Requiring action or visit</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Resolved & Closed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-emerald-600">{resolvedCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Successfully resolved</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Urgent Priority
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-rose-600">
              {complaints.filter((c) => c.priority === "URGENT" && c.status !== "RESOLVED" && c.status !== "CLOSED").length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Generation / inverter breakdown</p>
          </CardContent>
        </Card>
      </div>

      {/* Control / Filter Bar */}
      <Card className="border-border/60 bg-card shadow-sm">
        <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ticket ID, customer, phone, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="RECEIVED">Received</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="TECHNICIAN_ASSIGNED">Tech Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Categories</option>
              <option value="Panel Issue">Panel Issue</option>
              <option value="Inverter Issue">Inverter Issue</option>
              <option value="Generation Issue">Generation Issue</option>
              <option value="Net Metering">Net Metering</option>
              <option value="Installation Issue">Installation Issue</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Warranty">Warranty</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchComplaints()}
              disabled={isLoading}
              className="h-9 text-xs gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card className="border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/50 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Technician</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Loading support tickets...
                  </td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    No complaints match the filter criteria.
                  </td>
                </tr>
              ) : (
                complaints.map((item) => (
                  <tr key={item.complaintId} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      {item.complaintId}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{item.customerName}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <a href={`tel:${item.mobile}`} className="hover:text-primary">
                          {item.mobile}
                        </a>
                        <a
                          href={`https://wa.me/91${item.mobile.replace(/[^0-9]/g, "").slice(-10)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-500 hover:text-emerald-600"
                        >
                          <FaWhatsapp className="h-3 w-3" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-foreground">
                      <span className="bg-accent px-2 py-0.5 rounded text-[11px]">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">{getPriorityBadge(item.priority)}</td>

                    <td className="py-3 px-4">{getStatusBadge(item.status)}</td>

                    <td className="py-3 px-4">
                      {item.assignedTechnicianName ? (
                        <div className="flex items-center gap-1 text-foreground font-medium">
                          <Wrench className="h-3 w-3 text-primary" />
                          {item.assignedTechnicianName}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          title="View Details & Timeline"
                          onClick={() => openViewModal(item)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          title="Update Status / Assign"
                          onClick={() => openEditModal(item)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                          title="Delete Ticket"
                          onClick={() => {
                            setItemToDelete(item);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Details & Timeline Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {selectedComplaint.complaintId}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {getPriorityBadge(selectedComplaint.priority)}
                    {getStatusBadge(selectedComplaint.status)}
                  </div>
                </div>
                <DialogTitle className="text-base font-bold mt-2">
                  {selectedComplaint.category}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Submitted by {selectedComplaint.customerName} on{" "}
                  {new Date(selectedComplaint.createdAt).toLocaleString("en-IN")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                <div className="rounded-lg bg-muted/40 p-3 border border-border/60 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Customer Phone:</span>
                      <a href={`tel:${selectedComplaint.mobile}`} className="font-medium hover:text-primary">
                        {selectedComplaint.mobile}
                      </a>
                    </div>
                    {selectedComplaint.email && (
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Email:</span>
                        <span className="font-medium">{selectedComplaint.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Assigned Technician:</span>
                      <span className="font-semibold text-foreground">
                        {selectedComplaint.assignedTechnicianName || "Not assigned yet"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Preferred Contact:</span>
                      <span className="font-medium">{selectedComplaint.preferredContact || "Phone Call"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-1">Issue Description</h4>
                  <p className="rounded-md bg-card p-3 border border-border/60 text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedComplaint.description}
                  </p>
                </div>

                {selectedComplaint.resolution && (
                  <div className="rounded-md bg-emerald-500/10 p-3 border border-emerald-500/20">
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Resolution Record
                    </h4>
                    <p className="text-foreground leading-relaxed">{selectedComplaint.resolution}</p>
                    {selectedComplaint.resolutionDate && (
                      <span className="text-[10px] text-muted-foreground block mt-1">
                        Resolved on {selectedComplaint.resolutionDate}
                      </span>
                    )}
                  </div>
                )}

                {/* Audit Timeline */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" /> Lifecycle Timeline
                  </h4>
                  <div className="space-y-2 border-l-2 border-primary/30 pl-3">
                    {selectedComplaint.timeline && selectedComplaint.timeline.length > 0 ? (
                      selectedComplaint.timeline.map((event, idx) => (
                        <div key={idx} className="relative pb-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground text-[11px]">{event.title}</span>
                            <span className="text-[10px] text-muted-foreground">{event.date} {event.time}</span>
                          </div>
                          {event.notes && <p className="text-[11px] text-muted-foreground mt-0.5">{event.notes}</p>}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-[11px]">No timeline events recorded.</p>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    openEditModal(selectedComplaint);
                  }}
                  className="text-xs bg-primary text-white"
                >
                  <Edit className="h-3.5 w-3.5 mr-1" /> Update Status / Assign
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit / Update Status Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <Edit className="h-4 w-4 text-primary" />
                  Update Ticket — {selectedComplaint.complaintId}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Change workflow status, assign field technician, or enter resolution notes.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-medium text-foreground block mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="RECEIVED">Received</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="TECHNICIAN_ASSIGNED">Technician Assigned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-medium text-foreground block mb-1">Priority</label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">Assign Technician</label>
                  <select
                    value={editTechName}
                    onChange={(e) => setEditTechName(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- Select Technician --</option>
                    {availableTechs.map((t) => (
                      <option key={t.technicianId} value={t.name}>
                        {t.name} ({t.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">Resolution Summary</label>
                  <Textarea
                    placeholder="Describe how the issue was fixed, parts replaced, or findings..."
                    value={editResolution}
                    onChange={(e) => setEditResolution(e.target.value)}
                    className="text-xs min-h-[60px]"
                  />
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">Internal Notes</label>
                  <Input
                    placeholder="Customer contact notes or visit schedule..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpdateComplaint}
                  disabled={isSaving}
                  className="text-xs bg-primary text-white"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-rose-600 flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Delete Ticket?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to remove ticket{" "}
              <strong className="text-foreground">{itemToDelete?.complaintId}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteComplaint}
              disabled={isSaving}
              className="text-xs"
            >
              {isSaving ? "Deleting..." : "Delete Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
