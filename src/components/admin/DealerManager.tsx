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
  Users,
  Phone,
  MapPin,
  Search,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Trash2,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  TrendingUp,
} from "lucide-react";

export interface IDealerItem {
  id: string;
  dealerId: string;
  dealerName: string;
  contactPerson: string;
  mobile: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city: string;
  district?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  panNumber?: string;
  registrationDate: string;
  active: boolean;
  notes?: string;
  totalClients?: number;
  installedProjects?: number;
  pendingClients?: number;
  totalProjectValue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IDealerClientItem {
  id: string;
  type: "PROJECT" | "LEAD";
  enquiryId: string;
  projectId: string;
  customerName: string;
  mobile: string;
  city: string;
  capacityKW: number;
  company: string;
  product: string;
  installationStatus: string;
  paymentStatus: string;
  loanStatus: string;
  subsidyStatus: string;
  technician: string;
  createdAt: string;
}

export interface IDealerPerformanceItem {
  dealerId: string;
  dealerName: string;
  contactPerson: string;
  mobile: string;
  city: string;
  totalLeads: number;
  convertedCustomers: number;
  installedProjects: number;
  pendingProjects: number;
  rejectedLeads: number;
  totalProjectValue: number;
  paymentReceived: number;
  paymentPending: number;
  complaints: number;
  conversionRate: string;
}

interface DealerManagerProps {
  onOpenProjectMasterFile?: (projectId: string) => void;
  onViewLead?: (leadId: string) => void;
}

export function DealerManager({ onOpenProjectMasterFile, onViewLead }: DealerManagerProps) {
  const [dealers, setDealers] = useState<IDealerItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

  // Sub-view: "list" | "reports"
  const [subView, setSubView] = useState<"list" | "reports">("list");

  // Create / Edit Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDealer, setEditingDealer] = useState<IDealerItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    dealerName: "",
    contactPerson: "",
    mobile: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "",
    district: "",
    state: "Uttar Pradesh",
    pincode: "",
    gstNumber: "",
    panNumber: "",
    active: true,
    notes: "",
  });

  // Delete Dialog
  const [dealerToDelete, setDealerToDelete] = useState<IDealerItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Profile View Modal
  const [selectedDealerProfile, setSelectedDealerProfile] = useState<IDealerItem | null>(null);
  const [dealerStats, setDealerStats] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Clients View Modal
  const [selectedDealerClients, setSelectedDealerClients] = useState<IDealerItem | null>(null);
  const [clientsList, setClientsList] = useState<IDealerClientItem[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isClientsModalOpen, setIsClientsModalOpen] = useState(false);

  // Performance Report State
  const [reportRange, setReportRange] = useState<"today" | "week" | "month" | "year" | "custom">("month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [performanceReports, setPerformanceReports] = useState<IDealerPerformanceItem[]>([]);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const token = localStorage.getItem("admin_token") || "";

  // 1. Fetch Dealers List
  const fetchDealers = useCallback(
    async (pageNumber = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: pageNumber.toString(),
          limit: pagination.limit.toString(),
          status: statusFilter,
        });
        if (search.trim()) params.append("search", search.trim());

        const res = await fetch(`${baseUrl}/api/dealers?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch dealers");

        setDealers(data.dealers || []);
        setPagination(data.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
      } catch (err: any) {
        toast.error(err.message || "Error fetching dealers");
      } finally {
        setIsLoading(false);
      }
    },
    [baseUrl, token, search, statusFilter, pagination.limit]
  );

  useEffect(() => {
    fetchDealers(1);
  }, [fetchDealers]);

  // 2. Open Add Modal
  const openAddModal = () => {
    setEditingDealer(null);
    setFormData({
      dealerName: "",
      contactPerson: "",
      mobile: "",
      whatsapp: "",
      email: "",
      address: "",
      city: "",
      district: "",
      state: "Uttar Pradesh",
      pincode: "",
      gstNumber: "",
      panNumber: "",
      active: true,
      notes: "",
    });
    setIsFormModalOpen(true);
  };

  // 3. Open Edit Modal
  const openEditModal = (d: IDealerItem) => {
    setEditingDealer(d);
    setFormData({
      dealerName: d.dealerName,
      contactPerson: d.contactPerson,
      mobile: d.mobile,
      whatsapp: d.whatsapp || "",
      email: d.email || "",
      address: d.address || "",
      city: d.city,
      district: d.district || "",
      state: d.state || "Uttar Pradesh",
      pincode: d.pincode || "",
      gstNumber: d.gstNumber || "",
      panNumber: d.panNumber || "",
      active: d.active,
      notes: d.notes || "",
    });
    setIsFormModalOpen(true);
  };

  // 4. Save Dealer (Create or Edit)
  const handleSaveDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dealerName.trim() || !formData.contactPerson.trim() || !formData.mobile.trim() || !formData.city.trim()) {
      return toast.error("Please fill in all required fields (Name, Contact Person, Mobile, City)");
    }

    setIsSaving(true);
    try {
      const url = editingDealer ? `${baseUrl}/api/dealers/${editingDealer.dealerId}` : `${baseUrl}/api/dealers`;
      const method = editingDealer ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save dealer");

      toast.success(data.message || (editingDealer ? "Dealer updated" : "Dealer created"));
      setIsFormModalOpen(false);
      fetchDealers(pagination.page);
    } catch (err: any) {
      toast.error(err.message || "Save error");
    } finally {
      setIsSaving(false);
    }
  };

  // 5. Toggle Active Status
  const handleToggleActive = async (dealer: IDealerItem) => {
    try {
      const res = await fetch(`${baseUrl}/api/dealers/${dealer.dealerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !dealer.active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Status toggle failed");

      toast.success(`Dealer ${dealer.dealerName} is now ${!dealer.active ? "Active" : "Inactive"}`);
      fetchDealers(pagination.page);
    } catch (err: any) {
      toast.error(err.message || "Status toggle error");
    }
  };

  // 6. Delete Dealer
  const handleDeleteDealer = async () => {
    if (!dealerToDelete) return;
    try {
      const res = await fetch(`${baseUrl}/api/dealers/${dealerToDelete.dealerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete dealer");

      toast.success(data.message || "Dealer deleted");
      setIsDeleteModalOpen(false);
      setDealerToDelete(null);
      fetchDealers(pagination.page);
    } catch (err: any) {
      toast.error(err.message || "Delete error");
    }
  };

  // 7. View Dealer Profile Modal
  const openProfileModal = async (dealer: IDealerItem) => {
    setSelectedDealerProfile(dealer);
    setIsProfileModalOpen(true);
    setIsLoadingProfile(true);
    try {
      const res = await fetch(`${baseUrl}/api/dealers/${dealer.dealerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedDealerProfile(data.dealer);
        setDealerStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // 8. View Dealer Clients Modal
  const openClientsModal = async (dealer: IDealerItem) => {
    setSelectedDealerClients(dealer);
    setIsClientsModalOpen(true);
    setIsLoadingClients(true);
    try {
      const res = await fetch(`${baseUrl}/api/dealers/${dealer.dealerId}/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setClientsList(data.clients || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingClients(false);
    }
  };

  // 9. Fetch Dealer Performance Report
  const fetchPerformanceReport = useCallback(async () => {
    setIsLoadingReport(true);
    try {
      const params = new URLSearchParams({ range: reportRange });
      if (reportRange === "custom") {
        if (customFrom) params.append("from", customFrom);
        if (customTo) params.append("to", customTo);
      }

      const res = await fetch(`${baseUrl}/api/reports/dealer-performance?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch performance report");

      setPerformanceReports(data.reports || []);
    } catch (err: any) {
      toast.error(err.message || "Report error");
    } finally {
      setIsLoadingReport(false);
    }
  }, [baseUrl, token, reportRange, customFrom, customTo]);

  useEffect(() => {
    if (subView === "reports") {
      fetchPerformanceReport();
    }
  }, [subView, fetchPerformanceReport]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "--";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Dealer & Vendor Network
            </h2>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs font-semibold">
              Referral Partner CRM
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage channel partners, track client leads, monitor installation conversions, and analyze partner performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border/70 p-0.5 bg-muted/40">
            <button
              type="button"
              onClick={() => setSubView("list")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                subView === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dealer Directory
            </button>
            <button
              type="button"
              onClick={() => setSubView("reports")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                subView === "reports" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Performance Reports
            </button>
          </div>

          <Button onClick={openAddModal} className="gap-1.5 text-xs font-semibold">
            <Plus className="h-4 w-4" />
            Register Dealer
          </Button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SUB-VIEW 1: DEALERS DIRECTORY & LIST */}
      {/* ---------------------------------------------------- */}
      {subView === "list" && (
        <>
          {/* Search and Filters Bar */}
          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search dealers by name, contact person, mobile, city, or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="h-9 rounded-md border border-input bg-background px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="ALL">All Status</option>
                      <option value="ACTIVE">Active Only</option>
                      <option value="INACTIVE">Inactive Only</option>
                    </select>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => fetchDealers(1)} className="gap-1 text-xs">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Apply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dealers Table */}
          <Card className="border-border/60 bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="border-b border-border/60 bg-muted/30 text-muted-foreground uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Dealer ID</th>
                    <th className="px-4 py-3">Dealer / Company</th>
                    <th className="px-4 py-3">Contact Person</th>
                    <th className="px-4 py-3">Mobile & City</th>
                    <th className="px-4 py-3 text-center">Reg. Date</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Total Clients</th>
                    <th className="px-4 py-3 text-center">Installed</th>
                    <th className="px-4 py-3 text-center">Pending</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {isLoading ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-muted-foreground">
                        <div className="inline-flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          Loading dealers...
                        </div>
                      </td>
                    </tr>
                  ) : dealers.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Briefcase className="h-8 w-8 text-muted-foreground/50" />
                          <p className="font-medium">No dealers found.</p>
                          <p className="text-xs">Click "Register Dealer" above to add your first referral partner.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    dealers.map((d) => (
                      <tr key={d.id || d.dealerId} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-primary whitespace-nowrap">
                          {d.dealerId}
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">
                          <div>{d.dealerName}</div>
                          {d.gstNumber && <div className="text-[10px] text-muted-foreground font-mono">GST: {d.gstNumber}</div>}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground font-medium">
                          {d.contactPerson}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 font-mono text-foreground">
                            <Phone className="h-3 w-3 text-emerald-500" />
                            {d.mobile}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground/70" />
                            {d.city} {d.district ? `(${d.district})` : ""}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-muted-foreground whitespace-nowrap">
                          {formatDate(d.registrationDate || d.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(d)}
                            title="Click to toggle active/inactive"
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border cursor-pointer transition-all ${
                              d.active
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20"
                                : "bg-rose-500/10 text-rose-600 border-rose-500/30 hover:bg-rose-500/20"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${d.active ? "bg-emerald-500" : "bg-rose-500"}`} />
                            {d.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-foreground">
                          <button
                            type="button"
                            onClick={() => openClientsModal(d)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-muted/60 hover:bg-primary hover:text-white font-mono transition-all"
                            title="Click to inspect clients"
                          >
                            <Users className="h-3 w-3" />
                            {d.totalClients ?? 0}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                          {d.installedProjects ?? 0}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-amber-600 dark:text-amber-400 font-mono">
                          {d.pendingClients ?? 0}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openProfileModal(d)}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                              title="View Dealer Profile"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openClientsModal(d)}
                              className="h-7 px-2 text-xs gap-1 font-semibold text-primary hover:bg-primary/10"
                              title="View Clients List"
                            >
                              <Users className="h-3.5 w-3.5" />
                              Clients
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(d)}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                              title="Edit Dealer"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDealerToDelete(d);
                                setIsDeleteModalOpen(true);
                              }}
                              className="h-7 w-7 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete Dealer"
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

            {/* Pagination footer */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
                <div>
                  Showing {dealers.length} of {pagination.total} dealers
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => fetchDealers(pagination.page - 1)}
                    className="h-7 text-xs"
                  >
                    Previous
                  </Button>
                  <span className="font-semibold text-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchDealers(pagination.page + 1)}
                    className="h-7 text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUB-VIEW 2: DEALER PERFORMANCE REPORT */}
      {/* ---------------------------------------------------- */}
      {subView === "reports" && (
        <div className="space-y-4">
          <Card className="border-border/60 bg-card shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Channel Partner Performance Analysis
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Live MongoDB aggregated reports of leads generated, conversions, total project value, and payment collection by dealer.
                  </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex rounded-lg border border-border/70 p-0.5 bg-muted/40 text-xs">
                    {(["today", "week", "month", "year", "custom"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setReportRange(r)}
                        className={`px-3 py-1 rounded-md font-medium capitalize transition-all ${
                          reportRange === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {r === "week" ? "This Week" : r === "month" ? "This Month" : r === "year" ? "This Year" : r}
                      </button>
                    ))}
                  </div>

                  {reportRange === "custom" && (
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="date"
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="h-8 text-xs w-32"
                      />
                      <span className="text-xs text-muted-foreground">to</span>
                      <Input
                        type="date"
                        value={customTo}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="h-8 text-xs w-32"
                      />
                      <Button size="sm" onClick={fetchPerformanceReport} className="h-8 text-xs">
                        Filter
                      </Button>
                    </div>
                  )}

                  <Button variant="outline" size="sm" onClick={fetchPerformanceReport} className="h-8 text-xs gap-1">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="border-b border-border/60 bg-muted/30 text-muted-foreground uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Dealer Partner</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3 text-center">Total Leads</th>
                    <th className="px-4 py-3 text-center">Converted</th>
                    <th className="px-4 py-3 text-center">Installed</th>
                    <th className="px-4 py-3 text-center">Pending</th>
                    <th className="px-4 py-3 text-center">Rejected</th>
                    <th className="px-4 py-3 text-right">Project Value</th>
                    <th className="px-4 py-3 text-right">Paid (₹)</th>
                    <th className="px-4 py-3 text-right">Pending (₹)</th>
                    <th className="px-4 py-3 text-center">Complaints</th>
                    <th className="px-4 py-3 text-center">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {isLoadingReport ? (
                    <tr>
                      <td colSpan={12} className="py-12 text-center text-muted-foreground">
                        <div className="inline-flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          Calculating partner performance metrics...
                        </div>
                      </td>
                    </tr>
                  ) : performanceReports.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-12 text-center text-muted-foreground">
                        No dealer activity found for the selected date range.
                      </td>
                    </tr>
                  ) : (
                    performanceReports.map((r) => (
                      <tr key={r.dealerId} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-foreground">
                          <div>{r.dealerName}</div>
                          <div className="text-[10px] font-mono text-primary">{r.dealerId}</div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {r.city}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-foreground font-mono">
                          {r.totalLeads}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-indigo-600 font-mono">
                          {r.convertedCustomers}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-emerald-600 font-mono">
                          {r.installedProjects}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-amber-600 font-mono">
                          {r.pendingProjects}
                        </td>
                        <td className="px-4 py-3 text-center text-rose-500 font-mono">
                          {r.rejectedLeads}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-foreground font-mono">
                          ₹{r.totalProjectValue.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-emerald-600 font-mono">
                          ₹{r.paymentReceived.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-amber-600 font-mono">
                          ₹{r.paymentPending.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-center font-mono">
                          {r.complaints > 0 ? (
                            <Badge variant="outline" className="border-rose-500/30 text-rose-600 text-[10px]">
                              {r.complaints} open
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                              parseFloat(r.conversionRate) >= 50
                                ? "bg-emerald-500/10 text-emerald-600"
                                : parseFloat(r.conversionRate) > 0
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {r.conversionRate}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 1: ADD / EDIT DEALER */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              {editingDealer ? `Edit Dealer: ${editingDealer.dealerName}` : "Register New Solar Dealer / Vendor"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {editingDealer
                ? `Update company details, contact person, or location for ${editingDealer.dealerId}.`
                : "Add a channel partner. A unique sequential Dealer ID (MS-DEAL-2026-XXXXXX) will be generated automatically."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveDealer} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Dealer / Business Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Purvanchal Solar Enterprises"
                  value={formData.dealerName}
                  onChange={(e) => setFormData({ ...formData, dealerName: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Owner / Contact Person <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Rajesh Kumar Verma"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Primary Mobile Number <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">WhatsApp Number (Optional)</label>
                <Input
                  type="tel"
                  placeholder="WhatsApp number"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Email Address (Optional)</label>
                <Input
                  type="email"
                  placeholder="dealer@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Gorakhpur, Lucknow"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">District</label>
                <Input
                  placeholder="e.g. Maharajganj"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">State</label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">PIN Code</label>
                <Input
                  placeholder="6-digit PIN"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">GST Number (Optional)</label>
                <Input
                  placeholder="09AAAAA0000A1Z5"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                  className="text-xs font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">PAN Number (Optional)</label>
                <Input
                  placeholder="ABCDE1234F"
                  value={formData.panNumber}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                  className="text-xs font-mono uppercase"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="dealerActiveCheck"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="dealerActiveCheck" className="text-xs font-semibold cursor-pointer">
                  Active Partner (Eligible to receive referrals)
                </label>
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-foreground block mb-1">Full Business Address</label>
              <Input
                placeholder="Shop No., Road, Landmark..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="text-xs">
              <label className="font-semibold text-foreground block mb-1">Internal Notes</label>
              <Textarea
                placeholder="Notes on commission structure, territories, partner remarks..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsFormModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSaving}>
                {isSaving ? "Saving..." : editingDealer ? "Update Dealer" : "Register Dealer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: VIEW DEALER PROFILE */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  {selectedDealerProfile?.dealerName}
                </DialogTitle>
                <DialogDescription className="text-xs font-mono text-primary mt-0.5">
                  ID: {selectedDealerProfile?.dealerId} • Registered {formatDate(selectedDealerProfile?.registrationDate)}
                </DialogDescription>
              </div>
              <Badge
                variant="outline"
                className={
                  selectedDealerProfile?.active
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-600 border-rose-500/30"
                }
              >
                {selectedDealerProfile?.active ? "Active Partner" : "Inactive"}
              </Badge>
            </div>
          </DialogHeader>

          {isLoadingProfile ? (
            <div className="py-12 text-center text-muted-foreground">
              <div className="inline-flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Loading profile breakdown...
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Top Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                  <span className="text-[11px] text-muted-foreground font-semibold block">Total Clients</span>
                  <span className="text-xl font-bold font-mono text-foreground mt-1 block">
                    {dealerStats?.totalClients ?? 0}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Enquiries & Projects</span>
                </div>

                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <span className="text-[11px] text-emerald-600 font-semibold block">Installed Projects</span>
                  <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">
                    {dealerStats?.installedCustomers ?? 0}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Commission Complete</span>
                </div>

                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                  <span className="text-[11px] text-amber-600 font-semibold block">Pending Clients</span>
                  <span className="text-xl font-bold font-mono text-amber-600 mt-1 block">
                    {dealerStats?.pendingCustomers ?? 0}
                  </span>
                  <span className="text-[10px] text-muted-foreground">In pipeline</span>
                </div>

                <div className="rounded-lg border border-border/60 bg-card p-3">
                  <span className="text-[11px] text-muted-foreground font-semibold block">Total Project Value</span>
                  <span className="text-xl font-bold font-mono text-foreground mt-1 block">
                    ₹{(dealerStats?.totalProjectValue ?? 0).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Combined projects</span>
                </div>
              </div>

              {/* Contact & Registration Information */}
              <div className="rounded-lg border border-border/60 p-4 bg-card text-xs space-y-3">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground border-b pb-2">
                  Contact & Business Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Owner / Contact Person</span>
                    <span className="font-semibold text-foreground">{selectedDealerProfile?.contactPerson}</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">Mobile Number</span>
                    <span className="font-mono font-semibold text-foreground">{selectedDealerProfile?.mobile}</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">WhatsApp</span>
                    <span className="font-mono text-foreground">{selectedDealerProfile?.whatsapp || "--"}</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">Email</span>
                    <span className="text-foreground">{selectedDealerProfile?.email || "--"}</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">City & District</span>
                    <span className="text-foreground">
                      {selectedDealerProfile?.city} {selectedDealerProfile?.district ? `, ${selectedDealerProfile.district}` : ""}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">State & PIN</span>
                    <span className="text-foreground">
                      {selectedDealerProfile?.state || "Uttar Pradesh"} {selectedDealerProfile?.pincode ? `(${selectedDealerProfile.pincode})` : ""}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">GST Number</span>
                    <span className="font-mono font-semibold text-foreground uppercase">{selectedDealerProfile?.gstNumber || "N/A"}</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">PAN</span>
                    <span className="font-mono font-semibold text-foreground uppercase">{selectedDealerProfile?.panNumber || "N/A"}</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">Open Complaints</span>
                    <span className="font-mono font-bold text-rose-500">{dealerStats?.openComplaints ?? 0}</span>
                  </div>
                </div>

                {selectedDealerProfile?.address && (
                  <div className="pt-2 border-t border-border/40">
                    <span className="text-muted-foreground block text-[11px]">Full Address</span>
                    <span className="text-foreground">{selectedDealerProfile.address}</span>
                  </div>
                )}

                {selectedDealerProfile?.notes && (
                  <div className="pt-2 border-t border-border/40">
                    <span className="text-muted-foreground block text-[11px]">Notes</span>
                    <span className="text-muted-foreground italic">{selectedDealerProfile.notes}</span>
                  </div>
                )}
              </div>

              {/* Financial Collection Breakdown */}
              <div className="rounded-lg border border-border/60 p-4 bg-muted/20 text-xs">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground border-b pb-2 mb-3">
                  Financial Progress
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Total Project Value</span>
                    <span className="text-base font-bold font-mono text-foreground">
                      ₹{(dealerStats?.totalProjectValue ?? 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-emerald-600 block">Total Paid by Clients</span>
                    <span className="text-base font-bold font-mono text-emerald-600">
                      ₹{(dealerStats?.amountPaid ?? 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-amber-600 block">Pending Balance</span>
                    <span className="text-base font-bold font-mono text-amber-600">
                      ₹{(dealerStats?.amountRemaining ?? 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    if (selectedDealerProfile) openClientsModal(selectedDealerProfile);
                  }}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Users className="h-3.5 w-3.5" />
                  View All Linked Clients
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* MODAL 3: VIEW DEALER CLIENTS */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isClientsModalOpen} onOpenChange={setIsClientsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Clients Referred by {selectedDealerClients?.dealerName}
                </DialogTitle>
                <DialogDescription className="text-xs font-mono text-muted-foreground mt-0.5">
                  Dealer ID: {selectedDealerClients?.dealerId} • Total Clients: {clientsList.length}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {isLoadingClients ? (
            <div className="py-12 text-center text-muted-foreground">
              <div className="inline-flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Loading dealer clients...
              </div>
            </div>
          ) : clientsList.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Users className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="font-medium text-xs">No clients linked to this dealer yet.</p>
              <p className="text-[11px]">When customers apply and select this dealer, their records will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="overflow-x-auto border border-border/60 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="border-b border-border/60 bg-muted/40 text-muted-foreground uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="px-3 py-2.5">Type</th>
                      <th className="px-3 py-2.5">Identifier</th>
                      <th className="px-3 py-2.5">Customer Name</th>
                      <th className="px-3 py-2.5">Mobile</th>
                      <th className="px-3 py-2.5">City</th>
                      <th className="px-3 py-2.5 text-center">KW</th>
                      <th className="px-3 py-2.5">Solar Company</th>
                      <th className="px-3 py-2.5 text-center">Installation</th>
                      <th className="px-3 py-2.5 text-center">Payment</th>
                      <th className="px-3 py-2.5 text-center">Technician</th>
                      <th className="px-3 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {clientsList.map((c) => (
                      <tr key={c.id || c.enquiryId} className="hover:bg-muted/20">
                        <td className="px-3 py-2.5">
                          {c.type === "PROJECT" ? (
                            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-[10px]">
                              Project
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-600 text-[10px]">
                              Enquiry
                            </Badge>
                          )}
                        </td>
                        <td className="px-3 py-2.5 font-mono font-bold text-foreground">
                          {c.projectId || c.enquiryId}
                        </td>
                        <td className="px-3 py-2.5 font-semibold text-foreground">{c.customerName}</td>
                        <td className="px-3 py-2.5 font-mono text-muted-foreground">{c.mobile}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{c.city}</td>
                        <td className="px-3 py-2.5 text-center font-bold font-mono">{c.capacityKW} KW</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{c.company}</td>
                        <td className="px-3 py-2.5 text-center font-semibold text-[11px]">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              c.installationStatus === "COMPLETED"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : c.installationStatus === "ENQUIRY_STAGE"
                                ? "bg-muted text-muted-foreground"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {c.installationStatus}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono font-semibold text-[10px]">
                          {c.paymentStatus}
                        </td>
                        <td className="px-3 py-2.5 text-center text-muted-foreground">{c.technician}</td>
                        <td className="px-3 py-2.5 text-right">
                          {c.type === "PROJECT" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setIsClientsModalOpen(false);
                                if (onOpenProjectMasterFile && c.projectId) {
                                  onOpenProjectMasterFile(c.projectId);
                                }
                              }}
                              className="h-6 px-2 text-[11px] gap-1 text-primary hover:bg-primary hover:text-white"
                            >
                              Open Master File
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setIsClientsModalOpen(false);
                                if (onViewLead && c.id) {
                                  onViewLead(c.id);
                                }
                              }}
                              className="h-6 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                            >
                              View Lead
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* MODAL 4: DELETE DEALER CONFIRMATION */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete Dealer Confirmation
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to permanently delete dealer{" "}
              <span className="font-bold text-foreground">{dealerToDelete?.dealerName}</span> ({dealerToDelete?.dealerId})?
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-muted-foreground">
            This will remove the dealer registration. Any existing leads and projects linked to this dealer will preserve their records.
          </p>

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteDealer}>
              Yes, Delete Dealer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
