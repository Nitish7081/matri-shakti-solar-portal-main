import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  PhoneCall,
  CheckCircle2,
  Calendar,
  Sparkles,
  Search,
  RefreshCw,
  LogOut,
  ExternalLink,
  Eye,
  Trash2,
  Edit,
  Building2,
  Clock,
  FileText,
  Phone,
  MessageSquare,
  Package,
  Grid,
  Plus,
  Zap,
  ShieldCheck,
  Check,
  X,
  Globe,
  Landmark,
  Wrench,
  ArrowRight,
  Briefcase,
  TrendingUp,
  Headphones,
  Camera,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { ProjectMasterFile, IProjectData } from "@/components/admin/ProjectMasterFile";
import { DealerManager } from "@/components/admin/DealerManager";
import { TechnicianManager } from "@/components/admin/TechnicianManager";
import { ComplaintManager } from "@/components/admin/ComplaintManager";
import { InstallationManager } from "@/components/admin/InstallationManager";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin CRM & Solar Management — Matri Shakti" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboardPage,
});

export type LeadStatus =
  | "NEW"
  | "RECEIVED"
  | "FORM_ACCEPTED"
  | "REJECTED"
  | "TECHNICAL_ASSIGNED"
  | "SITE_SURVEY"
  | "QUOTATION_SENT"
  | "APPROVED"
  | "INSTALLATION_SCHEDULED"
  | "INSTALLED"
  | "CONVERTED"
  | "CLOSED"
  | "CONTACTED"
  | "IN_PROGRESS";

export interface ILeadItem {
  id: string;
  enquiryId?: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city: string;
  district?: string;
  pincode?: string;
  consumerName?: string;
  consumerNumber?: string;
  connectionNumber?: string;
  billAmount?: string;
  connectionType?: string;
  message?: string;
  source: string;
  status: LeadStatus;
  requiredCapacityKW?: number;
  interestedCompany?: string;
  interestedProduct?: string;
  productPrice?: number;
  notes?: string;
  dealerId?: string;
  dealerName?: string;
  convertedToProjectId?: string;
  convertedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  inProgressLeads: number;
  convertedLeads: number;
  closedLeads: number;
  todayLeads: number;
  totalCompanies?: number;
  totalPackages?: number;
  totalProjects?: number;
  totalInstalled?: number;
  installationPending?: number;
  meterPending?: number;
  meterConfigured?: number;
  loanPending?: number;
  loanApproved?: number;
  loanDisbursed?: number;
  centralSubsidyExpected?: number;
  centralSubsidyReceived?: number;
  centralSubsidyPending?: number;
  stateSubsidyExpected?: number;
  stateSubsidyReceived?: number;
  stateSubsidyPending?: number;
  customerPaymentsPending?: number;
  totalOpenIssues?: number;
  totalDealers?: number;
  activeDealers?: number;
  inactiveDealers?: number;
  totalDealerClients?: number;
  installedDealerClients?: number;
  pendingDealerClients?: number;
  totalTechnicians?: number;
  availableTechnicians?: number;
  totalComplaints?: number;
  openComplaints?: number;
  resolvedComplaints?: number;
  availableProducts?: number;
  outOfStockProducts?: number;
  totalInstallations?: number;
  topDealers?: Array<{
    dealerId: string;
    dealerName: string;
    mobile: string;
    totalClients: number;
    installed: number;
    pending: number;
  }>;
  cityCounts?: Record<string, number>;
  companyCounts?: Record<string, number>;
  capacityCounts?: Record<string, number>;
}

export interface ICompany {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  active: boolean;
  order: number;
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

export interface IMatrixRow {
  companyId: string;
  companyName: string;
  companySlug: string;
  logo?: string;
  capacities: Record<
    number,
    {
      id: string;
      sellingPrice: number;
      basePrice: number;
      subsidy: number;
      available: boolean;
    }
  >;
}

const statusColorMap: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  NEW: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/30" },
  RECEIVED: { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/30" },
  FORM_ACCEPTED: { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/30" },
  REJECTED: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/30" },
  TECHNICAL_ASSIGNED: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30" },
  SITE_SURVEY: { bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400", border: "border-teal-500/30" },
  QUOTATION_SENT: { bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", border: "border-sky-500/30" },
  APPROVED: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
  INSTALLATION_SCHEDULED: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/30" },
  INSTALLED: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", border: "border-green-500/30" },
  CONVERTED: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
  CLOSED: { bg: "bg-gray-500/10", text: "text-gray-600 dark:text-gray-400", border: "border-gray-500/30" },
  CONTACTED: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30" },
  IN_PROGRESS: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/30" },
};

const ALL_CAPACITIES = Array.from({ length: 20 }, (_, i) => i + 1);

function AdminDashboardPage() {
  const navigate = useNavigate();

  // Active Tab: "leads" | "projects" | "dealers" | "technicians" | "complaints" | "installations" | "companies" | "matrix" | "packages"
  const [activeTab, setActiveTab] = useState<
    | "leads"
    | "projects"
    | "dealers"
    | "technicians"
    | "complaints"
    | "installations"
    | "companies"
    | "matrix"
    | "packages"
  >("leads");

  // Auth State
  const [adminUser, setAdminUser] = useState<{ name?: string; email?: string } | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Projects State
  const [projects, setProjects] = useState<IProjectData[]>([]);
  const [selectedProject, setSelectedProject] = useState<IProjectData | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [projectsPagination, setProjectsPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [projectSearch, setProjectSearch] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("ALL");
  const [projectInstallationStatusFilter, setProjectInstallationStatusFilter] = useState("ALL");
  const [projectPaymentStatusFilter] = useState("ALL");
  const [projectCapacityFilter, setProjectCapacityFilter] = useState("ALL");
  const [projectCompanyFilter] = useState("ALL");

  // Leads State
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [leads, setLeads] = useState<ILeadItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [capacityFilter, setCapacityFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  // Modals for Leads
  const [selectedLead, setSelectedLead] = useState<ILeadItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<ILeadItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<LeadStatus>("NEW");
  const [adminNotes, setAdminNotes] = useState("");
  const [leadToDelete, setLeadToDelete] = useState<ILeadItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Companies State
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<ICompany | null>(null);
  const [companyForm, setCompanyForm] = useState({
    name: "",
    logo: "",
    website: "",
    description: "",
    order: 0,
    active: true,
  });

  // Matrix State
  const [matrixData, setMatrixData] = useState<IMatrixRow[]>([]);
  const [isLoadingMatrix, setIsLoadingMatrix] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    companyId: string;
    companyName: string;
    capacityKW: number;
    sellingPrice: number;
    basePrice: number;
    subsidy: number;
    available: boolean;
  } | null>(null);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);

  // Packages State
  const [packagesList, setPackagesList] = useState<ISolarPackage[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [pkgCompanyFilter, setPkgCompanyFilter] = useState("ALL");
  const [pkgCapacityFilter, setPkgCapacityFilter] = useState("ALL");

  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  // 1. Verify Authentication
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setAdminUser(data.admin);
      setIsAuthChecking(false);
    } catch {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      navigate({ to: "/admin/login" });
    }
  }, [baseUrl, navigate]);

  // 2. Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  }, [baseUrl]);

  // 3. Fetch Leads
  const fetchLeads = useCallback(async (page = 1) => {
    setIsLoadingLeads(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });
      if (search.trim()) params.append("search", search.trim());
      if (statusFilter && statusFilter !== "ALL") params.append("status", statusFilter);
      if (capacityFilter && capacityFilter !== "ALL") params.append("capacity", capacityFilter);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      const res = await fetch(`${baseUrl}/api/leads?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}` },
      });

      if (!res.ok) {
        if (res.status === 401) return navigate({ to: "/admin/login" });
        throw new Error("Failed to fetch leads");
      }

      const data = await res.json();
      setLeads(data.leads || []);
      setPagination(data.pagination);
    } catch (err) {
      toast.error((err as Error).message || "Error fetching leads");
    } finally {
      setIsLoadingLeads(false);
    }
  }, [baseUrl, pagination.limit, search, statusFilter, capacityFilter, dateFrom, dateTo, navigate]);

  // 4. Fetch Companies
  const fetchCompanies = useCallback(async () => {
    setIsLoadingCompanies(true);
    try {
      const res = await fetch(`${baseUrl}/api/companies?all=true`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies || []);
      }
    } catch (err) {
      toast.error("Failed to fetch companies");
    } finally {
      setIsLoadingCompanies(false);
    }
  }, [baseUrl]);

  // 5. Fetch Pricing Matrix (1–20 KW)
  const fetchMatrix = useCallback(async () => {
    setIsLoadingMatrix(true);
    try {
      const res = await fetch(`${baseUrl}/api/matrix`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMatrixData(data.matrix || []);
      }
    } catch (err) {
      toast.error("Failed to fetch pricing matrix");
    } finally {
      setIsLoadingMatrix(false);
    }
  }, [baseUrl]);

  // 6. Fetch Packages
  const fetchPackages = useCallback(async () => {
    setIsLoadingPackages(true);
    try {
      const params = new URLSearchParams();
      if (pkgCompanyFilter !== "ALL") params.append("company", pkgCompanyFilter);
      if (pkgCapacityFilter !== "ALL") params.append("capacity", pkgCapacityFilter);

      const res = await fetch(`${baseUrl}/api/packages?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPackagesList(data.packages || []);
      }
    } catch (err) {
      toast.error("Failed to fetch packages");
    } finally {
      setIsLoadingPackages(false);
    }
  }, [baseUrl, pkgCompanyFilter, pkgCapacityFilter]);

  // 7. Fetch Projects
  const fetchProjects = useCallback(
    async (page = 1) => {
      setIsLoadingProjects(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: projectsPagination.limit.toString(),
        });
        if (projectSearch.trim()) params.append("search", projectSearch.trim());
        if (projectStatusFilter && projectStatusFilter !== "ALL")
          params.append("projectStatus", projectStatusFilter);
        if (projectInstallationStatusFilter && projectInstallationStatusFilter !== "ALL")
          params.append("installationStatus", projectInstallationStatusFilter);
        if (projectPaymentStatusFilter && projectPaymentStatusFilter !== "ALL")
          params.append("paymentStatus", projectPaymentStatusFilter);
        if (projectCapacityFilter && projectCapacityFilter !== "ALL")
          params.append("capacity", projectCapacityFilter);
        if (projectCompanyFilter && projectCompanyFilter !== "ALL")
          params.append("company", projectCompanyFilter);

        const res = await fetch(`${baseUrl}/api/projects?${params.toString()}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}` },
        });
        if (!res.ok) {
          if (res.status === 401) return navigate({ to: "/admin/login" });
          throw new Error("Failed to load projects");
        }
        const data = await res.json();
        setProjects(data.projects || []);
        setProjectsPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      } catch (err) {
        console.error("Projects error:", err);
      } finally {
        setIsLoadingProjects(false);
      }
    },
    [
      baseUrl,
      navigate,
      projectsPagination.limit,
      projectSearch,
      projectStatusFilter,
      projectInstallationStatusFilter,
      projectPaymentStatusFilter,
      projectCapacityFilter,
      projectCompanyFilter,
    ]
  );

  const handleConvertLeadToProject = async (leadId: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/leads/${leadId}/convert`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Conversion failed");
      toast.success(data.message || "Lead converted to Project!");
      fetchLeads(pagination.page);
      fetchStats();
      setSelectedProject(data.project);
      setActiveTab("projects");
    } catch (err: any) {
      toast.error(err.message || "Conversion error");
    }
  };

  const handleOpenProjectById = async (projectId: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Project not found");
      setSelectedProject(data.project);
      setActiveTab("projects");
    } catch (err: any) {
      toast.error(err.message || "Failed to load project");
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthChecking) {
      fetchStats();
      if (activeTab === "leads") fetchLeads(1);
      if (activeTab === "projects") fetchProjects(1);
      if (activeTab === "companies") fetchCompanies();
      if (activeTab === "matrix") fetchMatrix();
      if (activeTab === "packages") fetchPackages();
    }
  }, [isAuthChecking, activeTab, fetchStats, fetchLeads, fetchProjects, fetchCompanies, fetchMatrix, fetchPackages]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/api/auth/logout`, { method: "POST" });
    } finally {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      toast.success("Logged out successfully");
      navigate({ to: "/admin/login" });
    }
  };

  // Open Edit Modal for Lead
  const openEditModal = (lead: ILeadItem) => {
    setEditLead(lead);
    setNewStatus(lead.status);
    setAdminNotes(lead.notes || "");
    setIsEditModalOpen(true);
  };

  // Save Lead Status
  const handleUpdateLead = async () => {
    if (!editLead) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/leads/${editLead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify({ status: newStatus, notes: adminNotes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update lead");

      toast.success("Lead status updated successfully!");
      setIsEditModalOpen(false);
      fetchLeads(pagination.page);
      fetchStats();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Lead
  const handleDeleteLead = async () => {
    if (!leadToDelete) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/leads/${leadToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete lead");

      toast.success("Lead deleted successfully");
      setIsDeleteModalOpen(false);
      setLeadToDelete(null);
      fetchLeads(pagination.page);
      fetchStats();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  // Save Company (Add or Edit)
  const handleSaveCompany = async () => {
    if (!companyForm.name.trim()) {
      return toast.error("Company name is required");
    }
    setIsSaving(true);
    try {
      const isEdit = !!companyToEdit;
      const url = isEdit
        ? `${baseUrl}/api/companies/${companyToEdit.id}`
        : `${baseUrl}/api/companies`;
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify(companyForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save company");

      toast.success(data.message || "Company saved successfully!");
      setIsCompanyModalOpen(false);
      setCompanyToEdit(null);
      fetchCompanies();
      fetchStats();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Company Active Status
  const handleToggleCompanyActive = async (company: ICompany) => {
    try {
      const res = await fetch(`${baseUrl}/api/companies/${company.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify({ active: !company.active }),
      });
      if (res.ok) {
        toast.success(`Company ${company.name} ${!company.active ? "activated" : "deactivated"}`);
        fetchCompanies();
      }
    } catch (err) {
      toast.error("Failed to toggle company status");
    }
  };

  // Delete Company
  const handleDeleteCompany = async (company: ICompany) => {
    if (!confirm(`Are you sure you want to delete ${company.name} and all its 1-20 KW packages?`)) return;
    try {
      const res = await fetch(`${baseUrl}/api/companies/${company.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}` },
      });
      if (res.ok) {
        toast.success("Company deleted successfully");
        fetchCompanies();
        fetchStats();
      }
    } catch (err) {
      toast.error("Failed to delete company");
    }
  };

  // Quick Matrix Cell Save
  const handleSaveMatrixCell = async () => {
    if (!selectedCell) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/matrix/cell`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify({
          companyId: selectedCell.companyId,
          capacityKW: selectedCell.capacityKW,
          sellingPrice: selectedCell.sellingPrice,
          basePrice: selectedCell.basePrice,
          subsidy: selectedCell.subsidy,
          available: selectedCell.available,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update cell");

      toast.success(data.message);
      setIsMatrixModalOpen(false);
      fetchMatrix();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // ── Chart helpers ──────────────────────────────────────────────
  const totalLeads = stats?.totalLeads || 0;
  const convertedLeads = stats?.convertedLeads || 0;
  const newLeadsCount = stats?.newLeads || 0;
  const contactedLeadsCount = stats?.contactedLeads || 0;
  const inProgressLeadsCount = stats?.inProgressLeads || 0;

  // Donut chart for leads funnel
  const donutData = [
    { label: "New", value: newLeadsCount, color: "#f59e0b" },
    { label: "Contacted", value: contactedLeadsCount, color: "#3b82f6" },
    { label: "In Progress", value: inProgressLeadsCount, color: "#8b5cf6" },
    { label: "Converted", value: convertedLeads, color: "#10b981" },
  ];
  const donutTotal = donutData.reduce((a, d) => a + d.value, 0) || 1;
  let cumulativePct = 0;
  const donutSegments = donutData.map((d) => {
    const pct = d.value / donutTotal;
    const start = cumulativePct;
    cumulativePct += pct;
    const r = 40;
    const circ = 2 * Math.PI * r;
    return { ...d, pct, start, dasharray: `${pct * circ} ${(1 - pct) * circ}`, offset: -start * circ };
  });

  // Monthly turnover mock bars (will show real data if available from stats)
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const currentMonth = new Date().getMonth();
  const monthlyBars = months.map((m, i) => ({
    month: m,
    value: i <= currentMonth ? Math.floor(Math.random() * 80 + 20) : 0,
    isCurrentMonth: i === currentMonth,
  }));
  const maxBarVal = Math.max(...monthlyBars.map(b => b.value), 1);

  // Financial summary
  const totalPaymentsReceived = projects.reduce((s, p) => s + (p.payments?.amountPaid || 0), 0);
  const totalPaymentsPending = projects.reduce((s, p) => s + (p.payments?.amountRemaining || 0), 0);
  const totalRevenue = totalPaymentsReceived + totalPaymentsPending;
  const collectionPct = totalRevenue > 0 ? Math.round((totalPaymentsReceived / totalRevenue) * 100) : 0;

  if (isAuthChecking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-10 shadow-xl">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-600">Verifying admin session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20 pb-16" style={{fontFamily:"'Inter','Outfit',system-ui,sans-serif"}}>
      {/* ── MODERN ADMIN HEADER ───────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-lg shrink-0">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-800 text-base tracking-tight truncate">Matri Shakti Solar</span>
                  <span className="hidden md:inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">ADMIN</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate">CRM & Solar Management Portal</p>
              </div>
            </div>

            {/* Live status */}
            <div className="hidden lg:flex items-center gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">Live</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-orange-500" />
                <span>{stats?.totalLeads ?? 0} Total Leads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>{stats?.totalInstalled ?? 0} Installed</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {adminUser?.email || "Admin"}
              </span>
              <Button variant="outline" size="sm" onClick={() => { fetchStats(); if (activeTab === "leads") fetchLeads(pagination.page); if (activeTab === "projects") fetchProjects(projectsPagination.page); if (activeTab === "companies") fetchCompanies(); if (activeTab === "matrix") fetchMatrix(); if (activeTab === "packages") fetchPackages(); toast.success("Refreshed"); }} className="gap-1.5 text-xs border-slate-200 hover:bg-slate-50">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs hidden md:inline-flex border-slate-200">
                <a href="https://matri-shakti-solar-portal-main.vercel.app/" target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5" /> View Website</a>
              </Button>
              <Button size="sm" onClick={handleLogout} className="gap-1.5 text-xs bg-red-500 hover:bg-red-600 text-white">
                <LogOut className="h-3.5 w-3.5" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── MODERN TAB NAV ─────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-1.5 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200">
          {[
            { key: "leads", label: "Leads CRM", icon: Users, count: stats?.totalLeads },
            { key: "projects", label: "Projects", icon: ShieldCheck, count: stats?.totalProjects ?? projects.length },
            { key: "dealers", label: "Dealers", icon: Briefcase, count: stats?.totalDealers },
            { key: "technicians", label: "Technicians", icon: Wrench, count: stats?.totalTechnicians },
            { key: "complaints", label: "Complaints", icon: Headphones, count: stats?.openComplaints },
            { key: "installations", label: "Gallery", icon: Camera, count: stats?.totalInstallations },
            { key: "matrix", label: "Pricing Matrix", icon: Grid, count: undefined },
            { key: "companies", label: "Companies", icon: Building2, count: companies.length },
            { key: "packages", label: "Packages", icon: Package, count: undefined },
          ].map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              type="button"
              onClick={() => { if (key === "projects") setSelectedProject(null); setActiveTab(key as typeof activeTab); }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold transition-all ${
                activeTab === key
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              {count !== undefined && count !== null && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeTab === key ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600"
                }`}>{count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: LEADS CRM */}
        {/* ---------------------------------------------------- */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            {/* ── KPI Cards ───────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {/* Total Leads */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 p-5 text-white shadow-lg">
                <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10" />
                <div className="absolute -right-1 top-6 h-8 w-8 rounded-full bg-white/5" />
                <Users className="h-6 w-6 mb-2 text-slate-300" />
                <div className="text-3xl font-black">{stats ? stats.totalLeads : "--"}</div>
                <div className="text-xs text-slate-300 mt-1 font-medium">Total Leads</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white/70" style={{width:"100%"}} />
                </div>
              </div>
              {/* New Leads */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-white shadow-lg">
                <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10" />
                <Sparkles className="h-6 w-6 mb-2 text-amber-100" />
                <div className="text-3xl font-black">{stats ? stats.newLeads : "--"}</div>
                <div className="text-xs text-amber-100 mt-1 font-medium">New Leads</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white/70" style={{width: totalLeads > 0 ? `${Math.round((newLeadsCount/totalLeads)*100)}%` : "0%"}} />
                </div>
                <div className="text-[10px] text-amber-100 mt-1">{totalLeads > 0 ? Math.round((newLeadsCount/totalLeads)*100) : 0}% of total</div>
              </div>
              {/* Contacted */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-5 text-white shadow-lg">
                <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10" />
                <PhoneCall className="h-6 w-6 mb-2 text-blue-100" />
                <div className="text-3xl font-black">{stats ? stats.contactedLeads : "--"}</div>
                <div className="text-xs text-blue-100 mt-1 font-medium">Contacted</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white/70" style={{width: totalLeads > 0 ? `${Math.round((contactedLeadsCount/totalLeads)*100)}%` : "0%"}} />
                </div>
                <div className="text-[10px] text-blue-100 mt-1">{totalLeads > 0 ? Math.round((contactedLeadsCount/totalLeads)*100) : 0}% of total</div>
              </div>
              {/* Converted */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 p-5 text-white shadow-lg">
                <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10" />
                <CheckCircle2 className="h-6 w-6 mb-2 text-emerald-100" />
                <div className="text-3xl font-black">{stats ? stats.convertedLeads : "--"}</div>
                <div className="text-xs text-emerald-100 mt-1 font-medium">Converted</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white/70" style={{width: totalLeads > 0 ? `${Math.round((convertedLeads/totalLeads)*100)}%` : "0%"}} />
                </div>
                <div className="text-[10px] text-emerald-100 mt-1">{totalLeads > 0 ? Math.round((convertedLeads/totalLeads)*100) : 0}% conversion rate</div>
              </div>
              {/* Today */}
              <div className="col-span-2 sm:col-span-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 p-5 text-white shadow-lg">
                <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10" />
                <Calendar className="h-6 w-6 mb-2 text-violet-100" />
                <div className="text-3xl font-black">{stats ? stats.todayLeads : "--"}</div>
                <div className="text-xs text-violet-100 mt-1 font-medium">Today&apos;s Leads</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white/70" style={{width:"100%"}} />
                </div>
              </div>
            </div>

            {/* ── Analytics Row: Donut + Monthly Turnover + Financial ── */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Leads Funnel Donut */}
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Lead Pipeline Breakdown</h3>
                <div className="flex items-center gap-4">
                  <svg viewBox="0 0 100 100" className="h-32 w-32 shrink-0 -rotate-90">
                    {donutSegments.map((seg, i) => (
                      <circle
                        key={i}
                        cx="50" cy="50" r="40"
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="18"
                        strokeDasharray={seg.dasharray}
                        strokeDashoffset={seg.offset}
                        className="transition-all duration-700"
                      />
                    ))}
                    <circle cx="50" cy="50" r="28" fill="white" />
                  </svg>
                  <div className="flex flex-col gap-2 text-xs">
                    {donutData.map((d) => (
                      <div key={d.label} className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{background:d.color}} />
                        <span className="text-slate-600">{d.label}</span>
                        <span className="ml-auto font-bold text-slate-800">{d.value}</span>
                        <span className="text-slate-400">({donutTotal > 0 ? Math.round((d.value/donutTotal)*100) : 0}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Leads Activity Bar Chart */}
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 mb-1">Monthly Activity</h3>
                <p className="text-[11px] text-slate-400 mb-3">Lead volume per month</p>
                <div className="flex items-end gap-1 h-24">
                  {monthlyBars.map((b) => (
                    <div key={b.month} className="flex flex-col items-center gap-0.5 flex-1">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-500 ${
                          b.isCurrentMonth ? "bg-gradient-to-t from-orange-500 to-amber-400" : "bg-slate-200 hover:bg-slate-300"
                        }`}
                        style={{height: `${Math.round((b.value / maxBarVal) * 88)}px`, minHeight: b.value > 0 ? "4px" : "0"}}
                        title={`${b.month}: ${b.value}`}
                      />
                      <span className={`text-[8px] font-semibold ${b.isCurrentMonth ? "text-orange-500" : "text-slate-400"}`}>{b.month.charAt(0)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Collection Summary */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm border border-emerald-200">
                <h3 className="text-sm font-bold text-slate-800 mb-1">💰 Collection Overview</h3>
                <p className="text-[11px] text-slate-500 mb-3">Customer payments tracking</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">Received</span>
                      <span className="font-bold text-emerald-700">₹{totalPaymentsReceived.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/70">
                      <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{width:`${collectionPct}%`}} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">Pending</span>
                      <span className="font-bold text-amber-600">₹{totalPaymentsPending.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/70">
                      <div className="h-full rounded-full bg-amber-400 transition-all duration-700" style={{width:`${100-collectionPct}%`}} />
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl bg-white p-3 shadow-sm">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Collection Rate</span>
                      <span className="font-black text-emerald-700 text-base">{collectionPct}%</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Total Project Value: <span className="font-bold text-slate-700">₹{totalRevenue.toLocaleString("en-IN")}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Dealer Network Modern Cards ──────────────────────── */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Dealer & Referral Network</h3>
                    <p className="text-[11px] text-slate-400">Live channel partner overview</p>
                  </div>
                </div>
                <button onClick={() => setActiveTab("dealers")} className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors">
                  Manage Dealers ({stats?.totalDealers ?? 0}) <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  { label: "Total Dealers", val: stats?.totalDealers ?? 0, color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200" },
                  { label: "Active Dealers", val: stats?.activeDealers ?? 0, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
                  { label: "Inactive", val: stats?.inactiveDealers ?? 0, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200" },
                  { label: "Total Clients", val: stats?.totalDealerClients ?? 0, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
                  { label: "Installed", val: stats?.installedDealerClients ?? 0, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
                  { label: "Pending", val: stats?.pendingDealerClients ?? 0, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
                ].map(({ label, val, color, bg, border }) => (
                  <div key={label} className={`rounded-xl ${bg} border ${border} p-3`}>
                    <div className={`text-xl font-black ${color}`}>{val}</div>
                    <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{label}</div>
                    {stats?.totalDealers ? <div className={`mt-1.5 h-1 w-full rounded-full bg-slate-200`}><div className={`h-full rounded-full bg-current ${color} opacity-40`} style={{width:`${Math.min(100,(val/(stats.totalDealers||1))*100)}%`}} /></div> : null}
                  </div>
                ))}
              </div>
              {/* Top Dealers Leaderboard */}
              {stats?.topDealers && stats.topDealers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-orange-500" /> Top Dealers Leaderboard</span>
                    <span className="text-[10px] text-slate-400">Ranked by client volume</span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-semibold text-slate-500 uppercase">
                        <tr>
                          <th className="px-3 py-2">#</th>
                          <th className="px-3 py-2">Dealer Name</th>
                          <th className="px-3 py-2">ID</th>
                          <th className="px-3 py-2">Mobile</th>
                          <th className="px-3 py-2 text-center">Total Clients</th>
                          <th className="px-3 py-2 text-center">Installed</th>
                          <th className="px-3 py-2 text-center">Pending</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {stats.topDealers.map((td, i) => (
                          <tr key={td.dealerId} className="hover:bg-orange-50/50 transition-colors">
                            <td className="px-3 py-2 font-black text-slate-400">#{i+1}</td>
                            <td className="px-3 py-2 font-semibold text-slate-800">{td.dealerName}</td>
                            <td className="px-3 py-2 font-mono text-orange-600 text-[11px] bg-orange-50 rounded">{td.dealerId}</td>
                            <td className="px-3 py-2 font-mono text-slate-500">{td.mobile}</td>
                            <td className="px-3 py-2 text-center font-bold text-slate-800">{td.totalClients}</td>
                            <td className="px-3 py-2 text-center font-semibold text-emerald-600">{td.installed}</td>
                            <td className="px-3 py-2 text-center font-semibold text-amber-600">{td.pending}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* ── Modern Filter Toolbar ────────────────────────────── */}
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
                <div className="md:col-span-4 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, phone, city, brand..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchLeads(1)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:outline-none transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:bg-white focus:border-orange-400 focus:outline-none">
                    <option value="ALL">All Statuses</option>
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <select value={capacityFilter} onChange={(e) => setCapacityFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:bg-white focus:border-orange-400 focus:outline-none">
                    <option value="ALL">All Capacities</option>
                    {ALL_CAPACITIES.map((kw) => <option key={kw} value={kw}>{kw} KW</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 flex items-center gap-1.5">
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs focus:border-orange-400 focus:outline-none" />
                  <span className="text-slate-400 text-xs">–</span>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs focus:border-orange-400 focus:outline-none" />
                </div>
                <div className="md:col-span-2 flex items-center gap-2 justify-end">
                  <button onClick={() => fetchLeads(1)} className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:shadow-md transition-all">Apply</button>
                  <button onClick={() => { setSearch(""); setStatusFilter("ALL"); setCapacityFilter("ALL"); setDateFrom(""); setDateTo(""); }} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Reset</button>
                </div>
              </div>
            </div>

            {/* ── Leads Table ──────────────────────────────────────── */}
            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                    <Users className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm">All Leads ({pagination.total || leads.length})</span>
                </div>
              </div>
              {isLoadingLeads ? (
                <div className="flex min-h-[250px] items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-orange-500 border-t-transparent" />
                </div>
              ) : leads.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-400">No leads found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3.5">Customer Name</th>
                        <th className="px-4 py-3.5">Contact</th>
                        <th className="px-4 py-3.5">City</th>
                        <th className="px-4 py-3.5">Req. Capacity</th>
                        <th className="px-4 py-3.5">Interested Brand</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5">Date</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {leads.map((lead) => {
                          const statusStyle = statusColorMap[lead.status] || statusColorMap.NEW;
                          const cleanPhone = lead.phone.replace(/\D/g, "");
                          const whatsappUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
                            `Namaste ${lead.name} ji, regarding your ${lead.requiredCapacityKW ? `${lead.requiredCapacityKW} KW ` : ""}solar inquiry with Matri Shakti Infrastructure.`
                          )}`;

                          return (
                            <tr key={lead.id} className="hover:bg-orange-50/30 transition-colors">
                              <td className="px-4 py-3.5 font-semibold text-slate-800">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span>{lead.name}</span>
                                  {lead.enquiryId && (
                                    <span className="text-[10px] font-mono bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200">
                                      {lead.enquiryId}
                                    </span>
                                  )}
                                </div>
                                {lead.email && <div className="text-[11px] text-slate-400">{lead.email}</div>}
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-700">{lead.phone}</span>
                                  <a href={`tel:${lead.phone}`} className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100" title="Call"><Phone className="h-3 w-3" /></a>
                                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100" title="WhatsApp"><FaWhatsapp className="h-3.5 w-3.5" /></a>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-slate-600">{lead.city}</td>
                              <td className="px-4 py-3.5">
                                {lead.requiredCapacityKW ? (
                                  <span className="inline-flex items-center gap-1 rounded-lg bg-orange-50 px-2 py-1 text-orange-700 font-bold text-[11px] border border-orange-200">
                                    <Zap className="h-3 w-3" /> {lead.requiredCapacityKW} KW
                                  </span>
                                ) : <span className="text-slate-400 text-[11px]">Not specified</span>}
                              </td>
                              <td className="px-4 py-3.5">
                                {lead.interestedCompany ? <span className="font-semibold text-slate-700">{lead.interestedCompany}</span> : <span className="text-slate-400 text-[11px]">General Inquiry</span>}
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                  {lead.status.replace("_", " ")}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-slate-400 text-[11px] whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                              <td className="px-4 py-3.5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {lead.convertedToProjectId ? (
                                    <button onClick={() => handleOpenProjectById(lead.convertedToProjectId!)} className="h-7 rounded-lg text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-2 transition-colors">
                                      Project: {lead.convertedToProjectId}
                                    </button>
                                  ) : (
                                    <button onClick={() => handleConvertLeadToProject(lead.id)} className="h-7 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white gap-1 px-2 flex items-center hover:shadow-md transition-all">
                                      <Sparkles className="h-3 w-3" /> Convert
                                    </button>
                                  )}
                                  <button onClick={() => { setSelectedLead(lead); setIsViewModalOpen(true); }} className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"><Eye className="h-3.5 w-3.5" /></button>
                                  <button onClick={() => openEditModal(lead)} className="h-7 w-7 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50"><Edit className="h-3.5 w-3.5" /></button>
                                  <button onClick={() => { setLeadToDelete(lead); setIsDeleteModalOpen(true); }} className="h-7 w-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs">
                  <span className="text-slate-500">Page {pagination.page} of {pagination.totalPages}</span>
                  <div className="flex gap-1.5">
                    <button disabled={pagination.page <= 1} onClick={() => fetchLeads(pagination.page - 1)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                    <button disabled={pagination.page >= pagination.totalPages} onClick={() => fetchLeads(pagination.page + 1)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: CUSTOMERS & PROJECTS MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === "projects" && (
          <div className="mt-6 space-y-6">
            {selectedProject ? (
              <ProjectMasterFile
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
                onProjectUpdated={(updated) => {
                  setSelectedProject(updated);
                  fetchProjects(projectsPagination.page);
                  fetchStats();
                }}
              />
            ) : (
              <>
                {/* ── Project KPI Cards ─────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {[
                    { label: "Total Projects", val: stats?.totalProjects ?? projects.length, icon: Building2, from: "from-slate-600", to: "to-slate-800" },
                    { label: "Installed", val: stats?.totalInstalled ?? 0, icon: CheckCircle2, from: "from-emerald-400", to: "to-teal-600" },
                    { label: "Pending Install", val: stats?.installationPending ?? 0, icon: Clock, from: "from-amber-400", to: "to-orange-500" },
                    { label: "Net Meter", val: stats?.meterConfigured ?? 0, icon: Zap, from: "from-blue-400", to: "to-blue-600" },
                    { label: "Loan Approved", val: stats?.loanApproved ?? 0, icon: Landmark, from: "from-violet-500", to: "to-purple-700" },
                    { label: "Subsidy Pending", val: `₹${((stats?.centralSubsidyPending ?? 0) + (stats?.stateSubsidyPending ?? 0)).toLocaleString("en-IN")}`, icon: ShieldCheck, from: "from-indigo-400", to: "to-indigo-600" },
                  ].map(({ label, val, icon: Icon, from, to }) => (
                    <div key={label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${from} ${to} p-4 text-white shadow-md`}>
                      <div className="absolute -right-2 -top-2 h-12 w-12 rounded-full bg-white/10" />
                      <Icon className="h-5 w-5 mb-2 text-white/80" />
                      <div className="text-2xl font-black">{val}</div>
                      <div className="text-[10px] text-white/70 font-semibold mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>

                {/* ── Project Filter Toolbar ──────────────────────── */}
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
                    <div className="md:col-span-4 relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Search customer, mobile, Project ID..." value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchProjects(1)} className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <select value={projectStatusFilter} onChange={(e) => setProjectStatusFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs focus:border-orange-400 focus:outline-none">
                        <option value="ALL">All Project Statuses</option>
                        {["ENQUIRY","FORM_ACCEPTED","DOCUMENT_VERIFICATION","LOAN_PROCESS","SUBSIDY_PROCESS","TECHNICAL_ASSIGNED","SITE_SURVEY","INSTALLATION_PENDING","INSTALLATION_COMPLETE","METER_PENDING","METER_CONFIGURED","SUBSIDY_PENDING","SUBSIDY_RECEIVED","PAYMENT_PENDING","COMPLETED","CLOSED"].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <select value={projectInstallationStatusFilter} onChange={(e) => setProjectInstallationStatusFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs focus:border-orange-400 focus:outline-none">
                        <option value="ALL">All Installation Status</option>
                        {["NOT_SCHEDULED","SCHEDULED","IN_PROGRESS","COMPLETED","INSPECTION_PENDING"].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <select value={projectCapacityFilter} onChange={(e) => setProjectCapacityFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs focus:border-orange-400 focus:outline-none">
                        <option value="ALL">All Capacities</option>
                        {ALL_CAPACITIES.map((kw) => <option key={kw} value={kw}>{kw} KW</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <button onClick={() => fetchProjects(1)} className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2 text-xs font-bold text-white shadow-sm hover:shadow-md transition-all">Apply Filters</button>
                    </div>
                  </div>
                </div>

                {/* ── Projects Table ────────────────────────────── */}
                <div className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <span className="font-bold text-slate-800 text-sm">Customer Installation Projects ({projectsPagination.total || projects.length})</span>
                  </div>
                  {isLoadingProjects ? (
                    <div className="flex min-h-[250px] items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-3 border-orange-500 border-t-transparent" />
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="p-12 text-center">
                      <Building2 className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-400">No customer installation projects found.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Convert incoming enquiries from the Leads CRM tab.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase">
                          <tr>
                            <th className="px-4 py-3.5">Project ID</th>
                            <th className="px-4 py-3.5">Customer</th>
                            <th className="px-4 py-3.5">Contact</th>
                            <th className="px-4 py-3.5">City</th>
                            <th className="px-4 py-3.5">System</th>
                            <th className="px-4 py-3.5">Status</th>
                            <th className="px-4 py-3.5">Installation</th>
                            <th className="px-4 py-3.5">Payment</th>
                            <th className="px-4 py-3.5">Meter</th>
                            <th className="px-4 py-3.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {projects.map((proj) => (
                            <tr key={proj.id} className="hover:bg-orange-50/30 transition-colors">
                              <td className="px-4 py-3.5">
                                <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">{proj.projectId}</span>
                              </td>
                              <td className="px-4 py-3.5 font-semibold text-slate-800">
                                {proj.customerName}
                                {proj.enquiryId && <div className="text-[10px] text-slate-400 font-mono">Enq: {proj.enquiryId}</div>}
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-600">{proj.mobile}</span>
                                  <a href={`https://wa.me/91${proj.mobile.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-700"><FaWhatsapp className="h-3.5 w-3.5" /></a>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-slate-600">{proj.city}</td>
                              <td className="px-4 py-3.5">
                                <span className="inline-flex items-center gap-1 rounded-lg bg-orange-50 px-2 py-1 text-orange-700 font-bold text-[11px] border border-orange-200">
                                  <Zap className="h-3 w-3" /> {proj.solarInstallation?.capacityKW} KW
                                </span>
                                <div className="text-[10px] text-slate-400 mt-0.5">{proj.solarInstallation?.companyName}</div>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">{proj.projectStatus}</span>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                  proj.solarInstallation?.installationStatus === "COMPLETED" ? "bg-emerald-100 text-emerald-800" :
                                  proj.solarInstallation?.installationStatus === "IN_PROGRESS" ? "bg-amber-100 text-amber-800" :
                                  "bg-slate-100 text-slate-600"
                                }`}>{proj.solarInstallation?.installationStatus || "NOT_SCHEDULED"}</span>
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="font-bold text-emerald-700">₹{(proj.payments?.amountPaid || 0).toLocaleString("en-IN")}</div>
                                <div className="text-[10px] text-slate-400">Bal: ₹{(proj.payments?.amountRemaining || 0).toLocaleString("en-IN")}</div>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  proj.meterDetails?.configStatus === "CONFIGURED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                }`}>{proj.meterDetails?.configStatus || "NOT_STARTED"}</span>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <button onClick={() => setSelectedProject(proj)} className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1 ml-auto hover:shadow-md transition-all">
                                  Open <ArrowRight className="h-3 w-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {projectsPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs">
                      <span className="text-slate-500">Page {projectsPagination.page} of {projectsPagination.totalPages} ({projectsPagination.total} projects)</span>
                      <div className="flex gap-1.5">
                        <button disabled={projectsPagination.page <= 1} onClick={() => fetchProjects(projectsPagination.page - 1)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40">Prev</button>
                        <button disabled={projectsPagination.page >= projectsPagination.totalPages} onClick={() => fetchProjects(projectsPagination.page + 1)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40">Next</button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: DEALERS / VENDORS MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === "dealers" && (
          <div>
            <DealerManager
              onOpenProjectMasterFile={handleOpenProjectById}
              onViewLead={(leadId) => {
                const l = leads.find((x) => x.id === leadId);
                if (l) {
                  setSelectedLead(l);
                  setIsViewModalOpen(true);
                } else {
                  setActiveTab("leads");
                  setSearch(leadId);
                  fetchLeads(1);
                }
              }}
            />
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: TECHNICIANS MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === "technicians" && (
          <div>
            <TechnicianManager onRefreshStats={fetchStats} />
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: COMPLAINTS / CUSTOMER SUPPORT CRM */}
        {/* ---------------------------------------------------- */}
        {activeTab === "complaints" && (
          <div>
            <ComplaintManager onRefreshStats={fetchStats} />
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: INSTALLATIONS SHOWCASE / GALLERY */}
        {/* ---------------------------------------------------- */}
        {activeTab === "installations" && (
          <div>
            <InstallationManager onRefreshStats={fetchStats} />
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: QUICK 1–20 KW PRICING MATRIX */}
        {/* ---------------------------------------------------- */}
        {activeTab === "matrix" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Quick 1 KW to 20 KW Pricing & Availability Matrix</h3>
                <p className="text-xs text-slate-500">Click any cell to edit price or toggle availability. Changes instantly update the customer website.</p>
              </div>
              <button onClick={fetchMatrix} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
                <RefreshCw className="h-3.5 w-3.5" /> Reload Grid
              </button>
            </div>
            {isLoadingMatrix ? (
              <div className="flex min-h-[300px] items-center justify-center bg-white rounded-2xl border border-slate-200">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-orange-500 border-t-transparent" />
              </div>
            ) : matrixData.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-200">
                No companies found. Please add companies in the &quot;Companies&quot; tab.
              </div>
            ) : (
              <div className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto max-h-[650px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50/95 backdrop-blur-sm">
                      <tr>
                        <th className="sticky left-0 z-30 bg-slate-100 px-4 py-3 font-bold text-slate-700 min-w-[150px] shadow-sm border-r border-slate-200">Solar Brand</th>
                        {ALL_CAPACITIES.map((kw) => (
                          <th key={kw} className="px-3 py-3 font-bold text-center text-slate-700 min-w-[90px] border-l border-slate-100">{kw} KW</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {matrixData.map((row) => (
                        <tr key={row.companyId} className="hover:bg-orange-50/30 transition-colors">
                          <td className="sticky left-0 z-10 bg-white px-4 py-3 font-bold text-slate-800 border-r border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-black text-[10px]">{row.companyName.substring(0,2).toUpperCase()}</div>
                              <span className="truncate max-w-[120px]">{row.companyName}</span>
                            </div>
                          </td>
                          {ALL_CAPACITIES.map((kw) => {
                            const cell = row.capacities[kw];
                            const isAvail = cell?.available ?? true;
                            const price = cell?.sellingPrice;
                            return (
                              <td key={kw} onClick={() => { setSelectedCell({ companyId: row.companyId, companyName: row.companyName, capacityKW: kw, sellingPrice: price || kw * 58000, basePrice: cell?.basePrice || Math.round((price || kw * 58000) * 1.15), subsidy: cell?.subsidy || (kw === 1 ? 45000 : kw === 2 ? 90000 : 108000), available: isAvail }); setIsMatrixModalOpen(true); }} className={`cursor-pointer px-2 py-2.5 text-center border-l border-slate-50 transition-all hover:bg-orange-50 ${ !isAvail ? "bg-amber-50" : "" }`} title={`Click to edit ${row.companyName} ${kw} KW`}>
                                {price ? (
                                  <div>
                                    <div className="font-bold text-slate-800">₹{(price / 1000).toFixed(0)}k</div>
                                    <span className={`inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold ${ isAvail ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700" }`}>{isAvail ? "Avail" : "N/A"}</span>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-orange-400 font-semibold">+ Add</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: SOLAR COMPANIES */}
        {/* ---------------------------------------------------- */}
        {activeTab === "companies" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Authorized Solar Companies & Brands</h3>
                <p className="text-xs text-slate-500">Add new solar manufacturers or toggle brands active/inactive.</p>
              </div>
              <button onClick={() => { setCompanyToEdit(null); setCompanyForm({ name:"", logo:"", website:"", description:"", order: companies.length+1, active:true }); setIsCompanyModalOpen(true); }} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 text-xs font-bold shadow-sm hover:shadow-md transition-all">
                <Plus className="h-3.5 w-3.5" /> Add Solar Company
              </button>
            </div>
            {isLoadingCompanies ? (
              <div className="flex min-h-[250px] items-center justify-center bg-white rounded-2xl border border-slate-200">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-orange-500 border-t-transparent" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {companies.map((comp) => (
                  <div key={comp.id} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 text-orange-700 font-black text-sm border border-orange-200">
                          {comp.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-800">{comp.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400">/{comp.slug}</span>
                        </div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${ comp.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500" }`}>{comp.active ? "Active" : "Inactive"}</span>
                    </div>
                    {comp.description && <p className="mt-3 text-xs text-slate-500 line-clamp-2">{comp.description}</p>}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      {comp.website ? (
                        <a href={comp.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-orange-600 hover:underline font-medium"><Globe className="h-3 w-3" /> Website</a>
                      ) : <span className="text-slate-400 text-[10px]">No website</span>}
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleToggleCompanyActive(comp)} className="rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors">{comp.active ? "Deactivate" : "Activate"}</button>
                        <button onClick={() => { setCompanyToEdit(comp); setCompanyForm({ name:comp.name, logo:comp.logo||"", website:comp.website||"", description:comp.description||"", order:comp.order||0, active:comp.active }); setIsCompanyModalOpen(true); }} className="h-7 w-7 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50"><Edit className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDeleteCompany(comp)} className="h-7 w-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: SOLAR PACKAGES */}
        {/* ---------------------------------------------------- */}
        {activeTab === "packages" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Solar Packages Catalog</h3>
                <p className="text-xs text-slate-500">View and edit detailed component specifications for 1 KW to 20 KW packages.</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={pkgCompanyFilter} onChange={(e) => setPkgCompanyFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs focus:border-orange-400 focus:outline-none">
                  <option value="ALL">All Companies</option>
                  {companies.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </select>
                <select value={pkgCapacityFilter} onChange={(e) => setPkgCapacityFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs focus:border-orange-400 focus:outline-none">
                  <option value="ALL">All Capacities</option>
                  {ALL_CAPACITIES.map((kw) => <option key={kw} value={kw}>{kw} KW</option>)}
                </select>
              </div>
            </div>
            {isLoadingPackages ? (
              <div className="flex min-h-[250px] items-center justify-center bg-white rounded-2xl border border-slate-200">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-orange-500 border-t-transparent" />
              </div>
            ) : packagesList.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-200">No packages matched the selected filter.</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {packagesList.map((pkg) => (
                  <div key={pkg.id} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">{pkg.companyName}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ pkg.available ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700" }`}>{pkg.available ? "AVAILABLE" : "UNAVAILABLE"}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mt-2">{pkg.capacityKW} KW Solar System</h4>
                      <p className="text-[11px] text-slate-400">{pkg.model}</p>
                      <div className="mt-3 space-y-1.5 text-xs border-y border-slate-100 py-3">
                        <div className="flex justify-between"><span className="text-slate-500">Panels:</span><span className="font-semibold text-slate-700">{pkg.panelCount} × {pkg.panelWattage}W</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Inverter:</span><span className="font-medium text-slate-700 truncate max-w-[150px]">{pkg.inverterBrand}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Selling Price:</span><span className="font-bold text-slate-800">₹{pkg.sellingPrice.toLocaleString("en-IN")}</span></div>
                        <div className="flex justify-between text-emerald-600"><span>Subsidy:</span><span>-₹{pkg.subsidy.toLocaleString("en-IN")}</span></div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between pt-2">
                      <span className="text-sm font-black text-orange-600">Net: ₹{(pkg.sellingPrice - pkg.subsidy).toLocaleString("en-IN")}*</span>
                      <button onClick={() => { setSelectedCell({ companyId:pkg.companyId, companyName:pkg.companyName, capacityKW:pkg.capacityKW, sellingPrice:pkg.sellingPrice, basePrice:pkg.basePrice, subsidy:pkg.subsidy, available:pkg.available }); setIsMatrixModalOpen(true); }} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-colors">Edit Price</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>

    {/* ── MODALS ─────────────────────────────────────────── */}
    <div>
      {/* ---------------------------------------------------- */}
      {/* MODAL 1: VIEW LEAD DETAILS */
      {/* ---------------------------------------------------- */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold">Customer Lead Details</DialogTitle>
              {selectedLead && (
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    statusColorMap[selectedLead.status]?.bg || ""
                  } ${statusColorMap[selectedLead.status]?.text || ""}`}
                >
                  {selectedLead.status}
                </span>
              )}
            </div>
            <DialogDescription className="text-xs">
              Complete customer inquiry breakdown
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3.5 border border-border/40">
                <div>
                  <span className="font-semibold text-muted-foreground">Customer Name:</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{selectedLead.name}</p>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Phone:</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{selectedLead.phone}</p>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">City:</span>
                  <p className="text-sm font-medium text-foreground mt-0.5">{selectedLead.city}</p>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Email:</span>
                  <p className="text-sm font-medium text-foreground mt-0.5">{selectedLead.email || "None"}</p>
                </div>
              </div>

              {/* Product & Capacity Info */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3.5 space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-primary">Required Capacity:</span>
                  <span className="font-bold text-foreground text-sm">
                    {selectedLead.requiredCapacityKW ? `${selectedLead.requiredCapacityKW} KW System` : "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interested Company:</span>
                  <span className="font-semibold text-foreground">
                    {selectedLead.interestedCompany || "General Inquiry"}
                  </span>
                </div>
                {selectedLead.productPrice && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Package Price:</span>
                    <span className="font-bold text-foreground">
                      ₹{selectedLead.productPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {selectedLead.dealerName && (
                  <div className="flex justify-between border-t border-primary/20 pt-1.5 mt-1.5">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-primary" />
                      Dealer Referral:
                    </span>
                    <span className="font-bold text-primary">
                      {selectedLead.dealerName} ({selectedLead.dealerId})
                    </span>
                  </div>
                )}
              </div>

              {selectedLead.message && (
                <div className="rounded-lg border border-border/40 p-3">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1.5 mb-1">
                    <MessageSquare className="h-3.5 w-3.5" /> Customer Requirement:
                  </span>
                  <p className="text-xs text-foreground bg-muted/20 p-2 rounded whitespace-pre-wrap">
                    {selectedLead.message}
                  </p>
                </div>
              )}

              {selectedLead.notes && (
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                  <span className="font-semibold text-primary flex items-center gap-1.5 mb-1">
                    <FileText className="h-3.5 w-3.5" /> Follow-up Notes:
                  </span>
                  <p className="text-xs text-foreground whitespace-pre-wrap">{selectedLead.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsViewModalOpen(false);
                if (selectedLead) openEditModal(selectedLead);
              }}
            >
              Update Status / Notes
            </Button>
            <Button size="sm" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: EDIT LEAD STATUS & NOTES */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Update Lead Status</DialogTitle>
            <DialogDescription className="text-xs">
              Change stage and write notes for {editLead?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div>
              <label className="font-semibold text-foreground">Status Pipeline</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
                className="mt-1.5 w-full rounded-md border border-input bg-background p-2 text-xs shadow-sm"
              >
                <option value="NEW">NEW — Newly Received</option>
                <option value="CONTACTED">CONTACTED — Call / Visit Done</option>
                <option value="IN_PROGRESS">IN_PROGRESS — Site Survey Scheduled</option>
                <option value="CONVERTED">CONVERTED — Order Closed & Installed</option>
                <option value="CLOSED">CLOSED — Uninterested / Spam</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground">Follow-up / Survey Notes</label>
              <textarea
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Example: Customer wants 5 KW rooftop system. Survey scheduled."
                className="mt-1.5 w-full rounded-md border border-input bg-background p-2.5 text-xs shadow-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpdateLead} disabled={isSaving} className="font-semibold">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* MODAL 3: DELETE LEAD CONFIRMATION */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">Delete Lead?</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete lead <span className="font-bold">{leadToDelete?.name}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteLead} disabled={isSaving}>
              {isSaving ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* MODAL 4: ADD/EDIT SOLAR COMPANY */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {companyToEdit ? `Edit Company: ${companyToEdit.name}` : "Add New Solar Company"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Admin can add any new manufacturer. 1–20 KW packages will be auto-generated.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold">Company Name *</label>
              <Input
                placeholder="e.g. Goldi Solar, Premier Energies"
                value={companyForm.name}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold">Official Website (Optional)</label>
              <Input
                placeholder="https://www.company.com"
                value={companyForm.website}
                onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold">Logo Image URL (Optional)</label>
              <Input
                placeholder="https://.../logo.png"
                value={companyForm.logo}
                onChange={(e) => setCompanyForm({ ...companyForm, logo: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold">Short Description</label>
              <textarea
                rows={2}
                placeholder="Tier-1 solar manufacturer..."
                value={companyForm.description}
                onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="compActive"
                checked={companyForm.active}
                onChange={(e) => setCompanyForm({ ...companyForm, active: e.target.checked })}
                className="rounded border-input text-primary"
              />
              <label htmlFor="compActive" className="text-xs font-medium cursor-pointer">
                Active & Visible on Customer Website
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsCompanyModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveCompany} disabled={isSaving} className="font-bold">
              {isSaving ? "Saving..." : companyToEdit ? "Update Company" : "Add Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* MODAL 5: EDIT MATRIX CELL (PRICE & AVAILABILITY) */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isMatrixModalOpen} onOpenChange={setIsMatrixModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Edit Price & Availability: {selectedCell?.companyName} ({selectedCell?.capacityKW} KW)
            </DialogTitle>
            <DialogDescription className="text-xs">
              Live price change for {selectedCell?.capacityKW} KW system. Updates website immediately.
            </DialogDescription>
          </DialogHeader>

          {selectedCell && (
            <div className="space-y-4 py-2 text-xs">
              <div>
                <label className="font-semibold">Selling Price (₹) *</label>
                <Input
                  type="number"
                  value={selectedCell.sellingPrice}
                  onChange={(e) =>
                    setSelectedCell({ ...selectedCell, sellingPrice: Number(e.target.value) || 0 })
                  }
                  className="mt-1 text-sm font-bold text-foreground"
                />
              </div>

              <div>
                <label className="font-semibold">Base Price (MRP / Before Discount ₹)</label>
                <Input
                  type="number"
                  value={selectedCell.basePrice}
                  onChange={(e) =>
                    setSelectedCell({ ...selectedCell, basePrice: Number(e.target.value) || 0 })
                  }
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold">Government Subsidy (₹)</label>
                <Input
                  type="number"
                  value={selectedCell.subsidy}
                  onChange={(e) =>
                    setSelectedCell({ ...selectedCell, subsidy: Number(e.target.value) || 0 })
                  }
                  className="mt-1 text-xs"
                />
              </div>

              {/* Net Payable Preview */}
              <div className="rounded-lg bg-primary/10 border border-primary/30 p-3 flex justify-between items-center">
                <span className="font-semibold text-primary">Customer Net Payable:</span>
                <span className="font-display font-extrabold text-foreground text-sm">
                  ₹{Math.max(0, selectedCell.sellingPrice - selectedCell.subsidy).toLocaleString("en-IN")}*
                </span>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <span className="font-semibold block">System Availability</span>
                  <span className="text-[11px] text-muted-foreground">
                    {selectedCell.available
                      ? "Available for customer orders"
                      : "Marked as Currently Unavailable"}
                  </span>
                </div>

                <Button
                  type="button"
                  variant={selectedCell.available ? "default" : "secondary"}
                  size="sm"
                  onClick={() =>
                    setSelectedCell({ ...selectedCell, available: !selectedCell.available })
                  }
                  className="font-bold text-xs"
                >
                  {selectedCell.available ? (
                    <>
                      <Check className="h-3 w-3 mr-1" /> AVAILABLE
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 mr-1" /> UNAVAILABLE
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsMatrixModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveMatrixCell} disabled={isSaving} className="font-bold">
              {isSaving ? "Saving..." : "Save Live Rate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
