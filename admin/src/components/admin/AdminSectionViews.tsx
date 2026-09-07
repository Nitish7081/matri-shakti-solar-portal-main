import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  ShieldCheck,
  Building2,
  Zap,
  Landmark,
  IndianRupee,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  Search,
  ExternalLink,
  Plus,
  Cpu,
  ArrowRight,
  TrendingUp,
  Settings,
  Phone,
  Sun,
  Camera,
  Briefcase,
  Wrench,
  Check,
  Globe,
  RefreshCw,
  Database,
  Lock,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Percent,
  Layers,
  Award,
  Trash2,
  Edit,
  Upload,
  Download,
  Printer,
  Eye,
  X,
  FileCheck,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { IProjectData } from "./ProjectMasterFile";
import { ILeadItem, IDashboardStats } from "../../pages/DashboardPage";
import { AdminTab } from "./AdminSidebar";

interface SectionViewProps {
  projects: IProjectData[];
  leads: ILeadItem[];
  stats: IDashboardStats | null;
  adminUser: { name?: string; email?: string } | null;
  onOpenProject: (proj: IProjectData, subTab?: string) => void;
  onOpenLead: (lead: ILeadItem) => void;
  onNewProject: () => void;
  onSwitchTab: (tab: AdminTab) => void;
  onRefresh: () => void;
}

// ----------------------------------------------------
// 1. DASHBOARD EXECUTIVE OVERVIEW (MODERN LIGHT THEME)
// ----------------------------------------------------
export function DashboardOverviewView({
  projects,
  leads,
  stats,
  adminUser,
  onOpenProject,
  onOpenLead,
  onNewProject,
  onSwitchTab,
  onRefresh,
}: SectionViewProps) {
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>("ALL");

  // ── Financial Turnover & Collection Calculations ──
  const totalCost = projects.reduce(
    (acc, p) => acc + (p.payments?.totalProjectCost || p.solarInstallation?.capacityKW ? (p.solarInstallation?.capacityKW || 3) * 65000 : 0),
    0
  );
  const totalCustomerPaid = projects.reduce(
    (acc, p) => acc + (p.payments?.amountPaid || 0),
    0
  );
  const totalBankDisbursed = projects.reduce(
    (acc, p) => acc + (p.bankLoan?.loanAmountDisbursed || 0),
    0
  );
  const totalMoneyCollected = totalCustomerPaid + totalBankDisbursed;
  const totalPendingBalance = Math.max(0, totalCost - totalMoneyCollected);
  const collectionPercentage = totalCost > 0 ? Math.min(100, Math.round((totalMoneyCollected / totalCost) * 100)) : 0;

  // Monthly breakdown
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = new Date().getMonth();

  const monthlyFinancialData = months.map((m, idx) => {
    const monthProjects = projects.filter((p) => {
      const d = p.enquiryDate ? new Date(p.enquiryDate) : null;
      return d && d.getMonth() === idx;
    });

    const mTurnover = monthProjects.reduce(
      (acc, p) => acc + (p.payments?.totalProjectCost || (p.solarInstallation?.capacityKW || 3) * 65000),
      0
    );
    const mCollected = monthProjects.reduce(
      (acc, p) => acc + (p.payments?.amountPaid || 0) + (p.bankLoan?.loanAmountDisbursed || 0),
      0
    );
    const mTurnoverLakh = Number((mTurnover / 100000).toFixed(2));
    const mCollectedLakh = Number((mCollected / 100000).toFixed(2));
    const mRatePct = mTurnover > 0 ? Math.min(100, Math.round((mCollected / mTurnover) * 100)) : 0;

    return {
      month: m,
      short: m[0],
      turnoverLakh: mTurnoverLakh,
      collectedLakh: mCollectedLakh,
      ratePct: mRatePct,
      isCurrentMonth: idx === currentMonthIdx,
    };
  });

  // ── Inquiries vs Interested in Solar (Lagwane Me Interested) ──
  const totalLeadsCount = stats?.totalLeads ?? leads.length;
  const interestedLeadsCount = leads.filter((l) =>
    [
      "CONVERTED",
      "INSTALLED",
      "APPROVED",
      "INSTALLATION_SCHEDULED",
      "QUOTATION_SENT",
      "SITE_SURVEY",
      "TECHNICAL_ASSIGNED",
      "IN_PROGRESS",
    ].includes(l.status)
  ).length;
  const convertedLeadsCount = stats?.convertedLeads ?? leads.filter((l) => l.status === "CONVERTED" || l.status === "INSTALLED").length;
  const interestRatePct = totalLeadsCount > 0 ? Math.round((interestedLeadsCount / totalLeadsCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ── 1. Executive Solar Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15 border border-orange-400/40">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-10 h-40 w-40 rounded-full bg-amber-300/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/30">
                <Sun className="h-3.5 w-3.5 text-amber-200 fill-amber-200" />
                Matri Shakti Solar Infrastructure
              </span>
              <span className="rounded-full bg-emerald-500/90 text-white font-bold text-[10px] px-2.5 py-0.5 shadow-xs">
                UPNEDA Authorized Partner
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
              Solar CRM & Monthly Turnover Dashboard
            </h2>

            <p className="text-xs sm:text-sm text-orange-50 max-w-2xl font-medium leading-relaxed">
              PM Surya Ghar Muft Bijli Yojana rooftop installation portal, ₹1,08,000 maximum Central & State subsidy tracker, bank loan disbursals, and bi-directional smart net-metering.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-semibold text-orange-100">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Live Portals: PM Surya Ghar • UPNEDA • UPPCL DISCOM
              </div>
              <div className="hidden sm:inline-block text-orange-300">•</div>
              <div>Turnover Efficiency: <span className="text-white font-bold">{collectionPercentage}%</span></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={onNewProject}
              className="bg-white hover:bg-orange-50 text-orange-600 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-black/10 gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer border border-orange-100"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>➕ Naya / Manual Solar Entry</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => onSwitchTab("matrix")}
              className="bg-orange-600/50 hover:bg-orange-600 text-white border border-white/40 text-xs font-bold px-3.5 py-2.5 rounded-xl backdrop-blur-sm transition-all cursor-pointer"
            >
              <Layers className="h-4 w-4 mr-1.5" />
              1–20 KW Matrix
            </Button>
          </div>
        </div>
      </div>

      {/* ── 2. ENQUIRIES VS INTERESTED METRICS (USER REQUIREMENT) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/60 to-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-blue-600" />
              Kul Enquiries (Total Inquiries)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
              Received
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-display mt-2">
            {totalLeadsCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Website portal, manual entry & dealer leads
          </p>
        </div>

        {/* Interested in Solar (Lagwane Me Interested) */}
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Lagwane Me Interested
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              {interestRatePct}% Ruchi
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 font-display mt-2">
            {interestedLeadsCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Quotation, survey & active interest customers
          </p>
        </div>

        {/* Converted & Installed */}
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/60 to-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-amber-600" />
              Final Converted Projects
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
              Ready / Installed
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-display mt-2">
            {convertedLeadsCount + projects.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Signed agreement & active rooftop installation
          </p>
        </div>

        {/* Money Collected */}
        <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50/60 to-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4 text-purple-600" />
              Total Money Collected
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
              {collectionPercentage}%
            </span>
          </div>
          <div className="text-3xl font-extrabold text-purple-700 font-display mt-2">
            ₹{(totalMoneyCollected / 100000).toFixed(2)} L
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Customer advances + bank disbursements
          </p>
        </div>
      </div>

      {/* ── 3. Quick Table of Recent Projects ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Solar Customer Projects
              </h3>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSwitchTab("projects")}
              className="h-7 text-xs border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 font-semibold"
            >
              View All ({projects.length})
            </Button>
          </div>

          {projects.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No solar projects recorded yet. Use &quot;Manual Data Bharein&quot; to add.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {projects.slice(0, 5).map((p) => (
                <div
                  key={p.id || p.projectId}
                  className="py-3 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{p.customerName}</span>
                      <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-700 bg-emerald-50 py-0">
                        {p.projectId}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {p.mobile} • {p.city} • {p.solarInstallation?.capacityKW || 3} KW
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onOpenProject(p)}
                    className="h-7 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-bold"
                  >
                    Open Master File
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Customer Inquiries & Leads
              </h3>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSwitchTab("leads")}
              className="h-7 text-xs border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 font-semibold"
            >
              View All ({leads.length})
            </Button>
          </div>

          {leads.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No leads currently recorded.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="py-3 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{lead.name}</span>
                      <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 bg-amber-50 py-0 font-semibold">
                        {lead.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {lead.phone} • {lead.city} • {lead.requiredCapacityKW || 3} KW
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onOpenLead(lead)}
                    className="h-7 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-bold"
                  >
                    View Lead
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. PAYMENTS & FINANCIALS VIEW (LIGHT THEME)
// ----------------------------------------------------
export function PaymentsView({
  projects,
  onOpenProject,
  onNewProject,
  onRefresh,
}: SectionViewProps) {
  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  // Status Change Dialog State
  const [selectedProjectForStatus, setSelectedProjectForStatus] = useState<IProjectData | null>(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState<string>("Payment Done");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Delete Transaction / Payment Dialog State
  const [projectToDeletePayment, setProjectToDeletePayment] = useState<IProjectData | null>(null);
  const [isDeletePaymentDialogOpen, setIsDeletePaymentDialogOpen] = useState(false);
  const [isDeletingPayment, setIsDeletingPayment] = useState(false);

  const totalCost = projects.reduce(
    (acc, p) => acc + (p.payments?.totalProjectCost || (p.solarInstallation?.capacityKW || 3) * 65000),
    0
  );
  const totalCustomerPaid = projects.reduce(
    (acc, p) => acc + (p.payments?.amountPaid || 0),
    0
  );
  const totalBankDisbursed = projects.reduce(
    (acc, p) => acc + (p.bankLoan?.loanAmountDisbursed || 0),
    0
  );
  const totalBalanceDue = projects.reduce(
    (acc, p) => acc + (p.payments?.amountRemaining ?? Math.max(0, (p.payments?.totalProjectCost || 0) - (p.payments?.amountPaid || 0))),
    0
  );

  const handleUpdatePaymentStatusSubmit = async () => {
    if (!selectedProjectForStatus) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`${baseUrl}/api/projects/${selectedProjectForStatus.id || selectedProjectForStatus.projectId}/payments`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update payment status");
      toast.success(`Payment status updated to "${newPaymentStatus}"`);
      setIsStatusDialogOpen(false);
      setSelectedProjectForStatus(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update payment status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleResetOrDeletePayment = async () => {
    if (!projectToDeletePayment) return;
    setIsDeletingPayment(true);
    try {
      // If project has transactions, delete them or reset payments
      const txns = projectToDeletePayment.payments?.transactions || [];
      if (txns.length > 0) {
        for (const txn of txns) {
          await fetch(`${baseUrl}/api/projects/${projectToDeletePayment.id || projectToDeletePayment.projectId}/payments/${txn.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}` },
          });
        }
      }
      // Also update payment status to Not Given
      await fetch(`${baseUrl}/api/projects/${projectToDeletePayment.id || projectToDeletePayment.projectId}/payments`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify({ paymentStatus: "Not Given", amountPaid: 0 }),
      });

      toast.success("Payment records deleted / reset successfully");
      setIsDeletePaymentDialogOpen(false);
      setProjectToDeletePayment(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete payment records");
    } finally {
      setIsDeletingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
            <IndianRupee className="h-5 w-5 text-orange-500" />
            Customer Payments, Installments & Bank Loan Disbursals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Set Payment Status (Payment Done, Pending, Not Given, Other) and manage payment receipts.
          </p>
        </div>
        <Button
          onClick={onNewProject}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Naya Payment Record
        </Button>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">
            Total Project Value
          </span>
          <div className="text-2xl font-extrabold font-display text-slate-900 mt-1">
            ₹{totalCost.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">All customer projects</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase block">
            Customer Payments Collected
          </span>
          <div className="text-2xl font-extrabold font-display text-emerald-700 mt-1">
            ₹{totalCustomerPaid.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Advance & Installments</p>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-purple-700 uppercase block">
            Bank Loan Disbursed
          </span>
          <div className="text-2xl font-extrabold font-display text-purple-700 mt-1">
            ₹{totalBankDisbursed.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Financed by partner banks</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase block">
            Balance Due / Pending
          </span>
          <div className="text-2xl font-extrabold font-display text-amber-700 mt-1">
            ₹{totalBalanceDue.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Receivables remaining</p>
        </div>
      </div>

      {/* Projects Payment Table */}
      <Card className="border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Project & Customer</th>
                <th className="px-4 py-3.5">Capacity</th>
                <th className="px-4 py-3.5">Total Cost</th>
                <th className="px-4 py-3.5">Customer Paid</th>
                <th className="px-4 py-3.5">Bank Disbursed</th>
                <th className="px-4 py-3.5">Balance Due</th>
                <th className="px-4 py-3.5">Payment Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => {
                const pCost = p.payments?.totalProjectCost || (p.solarInstallation?.capacityKW || 3) * 65000;
                const pPaid = p.payments?.amountPaid || 0;
                const pBank = p.bankLoan?.loanAmountDisbursed || 0;
                const pDue = p.payments?.amountRemaining ?? Math.max(0, pCost - pPaid - pBank);
                const status = p.payments?.paymentStatus || "Pending";

                return (
                  <tr key={p.id || p.projectId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{p.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.projectId} • {p.mobile}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-800">
                        {p.solarInstallation?.capacityKW || 3} KW
                      </span>
                      <div className="text-[11px] text-slate-500">
                        {p.solarInstallation?.companyName || "Standard"}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      ₹{pCost.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600">
                      ₹{pPaid.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-purple-600">
                      ₹{pBank.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-amber-600">
                      ₹{pDue.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => {
                          setSelectedProjectForStatus(p);
                          setNewPaymentStatus(status);
                          setIsStatusDialogOpen(true);
                        }}
                        className="cursor-pointer group flex items-center gap-1.5"
                        title="Click to change payment status"
                      >
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold ${
                            status === "Payment Done" || status === "PAID"
                              ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                              : status === "Not Given"
                              ? "border-rose-300 text-rose-700 bg-rose-50"
                              : status === "Other"
                              ? "border-purple-300 text-purple-700 bg-purple-50"
                              : "border-amber-300 text-amber-700 bg-amber-50"
                          }`}
                        >
                          {status} ✏️
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenProject(p, "payments")}
                        className="h-7 text-xs border-slate-200 bg-slate-50 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-bold"
                      >
                        Open Payments ➔
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setProjectToDeletePayment(p);
                          setIsDeletePaymentDialogOpen(true);
                        }}
                        className="h-7 text-xs border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-semibold"
                        title="Delete / Reset Payment Data"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Status Modal (User requirement: Payment Done, Pending, Not Given, Other) */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-orange-500" />
              Update Payment Status
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Customer: {selectedProjectForStatus?.customerName} ({selectedProjectForStatus?.projectId})
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-3">
            <label className="text-xs font-semibold text-slate-700 block">
              Select Payment Status:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Payment Done", color: "text-emerald-700 border-emerald-300 bg-emerald-50" },
                { label: "Pending", color: "text-amber-700 border-amber-300 bg-amber-50" },
                { label: "Not Given", color: "text-rose-700 border-rose-300 bg-rose-50" },
                { label: "Other", color: "text-purple-700 border-purple-300 bg-purple-50" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setNewPaymentStatus(opt.label)}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                    newPaymentStatus === opt.label
                      ? `${opt.color} ring-2 ring-orange-500 shadow-sm`
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStatusDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUpdatePaymentStatusSubmit}
              disabled={isUpdatingStatus}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
            >
              {isUpdatingStatus ? "Saving..." : "Save Payment Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete / Reset Payment Dialog */}
      <Dialog open={isDeletePaymentDialogOpen} onOpenChange={setIsDeletePaymentDialogOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Payment Records?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Kya aap {projectToDeletePayment?.customerName} ki payment entry delete / reset karna chahte hain? Status &quot;Not Given&quot; ho jayega.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeletePaymentDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleResetOrDeletePayment}
              disabled={isDeletingPayment}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
            >
              {isDeletingPayment ? "Deleting..." : "Delete Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ----------------------------------------------------
// 3. BANK LOANS VIEW (LIGHT THEME)
// ----------------------------------------------------
export function LoansView({ projects, stats, onOpenProject }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
          <Landmark className="h-5 w-5 text-purple-600" />
          Bank Loan Financing & Credit Tracker
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Monitor bank approvals, branch locations, sanctioned loan amounts, and disbursement tranches.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">
            Loans Approved
          </span>
          <div className="text-2xl font-extrabold font-display text-emerald-600 mt-1">
            {stats?.loanApproved ?? 0}
          </div>
          <p className="text-[10px] text-slate-400">Sanctioned projects</p>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-purple-700 uppercase block">
            Disbursed To Account
          </span>
          <div className="text-2xl font-extrabold font-display text-purple-700 mt-1">
            {stats?.loanDisbursed ?? 0}
          </div>
          <p className="text-[10px] text-slate-500">Funds released</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase block">
            Sanctions Pending
          </span>
          <div className="text-2xl font-extrabold font-display text-amber-700 mt-1">
            {stats?.loanPending ?? 0}
          </div>
          <p className="text-[10px] text-slate-500">Under bank scrutiny</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-sky-600 uppercase block">
            Partner Banks
          </span>
          <div className="text-2xl font-extrabold font-display text-slate-900 mt-1">SBI • PNB • CBI</div>
          <p className="text-[10px] text-slate-400">Jan Samarth subsidized portal</p>
        </div>
      </div>

      {/* Loan Projects Table */}
      <Card className="border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Customer & Project</th>
                <th className="px-4 py-3.5">Bank Name & Branch</th>
                <th className="px-4 py-3.5">Loan Amount</th>
                <th className="px-4 py-3.5">Disbursed</th>
                <th className="px-4 py-3.5">Next Payment</th>
                <th className="px-4 py-3.5">Approval Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => {
                const loan = p.bankLoan;
                const isLoan = loan?.loanRequired || false;

                return (
                  <tr key={p.id || p.projectId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{p.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.projectId} • {p.mobile}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-800">
                        {loan?.bankName || (isLoan ? "Partner Bank" : "No Loan (Direct)")}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {loan?.branchName || p.city}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      ₹{(loan?.loanAmountApproved || loan?.loanAmountApplied || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-purple-600">
                      ₹{(loan?.loanAmountDisbursed || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-amber-600">
                      ₹{(loan?.nextExpectedPayment || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          loan?.loanStatus === "APPROVED" || loan?.loanStatus === "DISBURSED"
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : loan?.loanStatus === "APPLIED"
                            ? "border-blue-300 text-blue-700 bg-blue-50"
                            : "border-slate-200 text-slate-500 bg-slate-50"
                        }`}
                      >
                        {loan?.loanStatus || (isLoan ? "PROCESSING" : "NO_LOAN")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenProject(p, "loan")}
                        className="h-7 text-xs border-slate-200 bg-slate-50 text-purple-700 hover:bg-purple-50 font-bold"
                      >
                        Loan Details ➔
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ----------------------------------------------------
// 4. SUBSIDIES TRACKER VIEW (LIGHT THEME)
// ----------------------------------------------------
export function SubsidiesView({ projects, stats, onOpenProject }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
          <Zap className="h-5 w-5 text-amber-500" />
          PM Surya Ghar Muft Bijli Yojana & State Subsidy Tracker
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time verification of Central Govt DBT (₹78,000 max) and Uttar Pradesh State UPNEDA subsidy (₹30,000 max).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-orange-600 uppercase block">
            Central Subsidy Expected
          </span>
          <div className="text-xl font-extrabold font-display text-slate-900 mt-1">
            ₹{(stats?.centralSubsidyExpected ?? 78000).toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-400">PM Surya Ghar Portal</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase block">
            Central DBT Received
          </span>
          <div className="text-xl font-extrabold font-display text-emerald-700 mt-1">
            ₹{(stats?.centralSubsidyReceived ?? 0).toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500">Credited to customer account</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase block">
            State Subsidy Expected
          </span>
          <div className="text-xl font-extrabold font-display text-slate-900 mt-1">
            ₹{(stats?.stateSubsidyExpected ?? 30000).toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-400">UPNEDA Direct Benefit</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase block">
            State DBT Received
          </span>
          <div className="text-xl font-extrabold font-display text-emerald-700 mt-1">
            ₹{(stats?.stateSubsidyReceived ?? 0).toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500">Uttar Pradesh Treasury</p>
        </div>
      </div>

      {/* Subsidy Table */}
      <Card className="border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Customer & Project</th>
                <th className="px-4 py-3.5">Capacity</th>
                <th className="px-4 py-3.5">Central Subsidy (₹78k)</th>
                <th className="px-4 py-3.5">State Subsidy (₹30k)</th>
                <th className="px-4 py-3.5">Portal App No</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => {
                const sub = p.subsidyTracking;
                return (
                  <tr key={p.id || p.projectId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{p.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.projectId} • {p.city}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">
                      {p.solarInstallation?.capacityKW || 3} KW
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">
                        ₹{(sub?.centralSubsidy?.expectedAmount || 78000).toLocaleString("en-IN")}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold ${
                          sub?.centralSubsidy?.status === "RECEIVED"
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : "border-amber-300 text-amber-700 bg-amber-50"
                        }`}
                      >
                        {sub?.centralSubsidy?.status || "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">
                        ₹{(sub?.stateSubsidy?.expectedAmount || 30000).toLocaleString("en-IN")}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold ${
                          sub?.stateSubsidy?.status === "RECEIVED"
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : "border-amber-300 text-amber-700 bg-amber-50"
                        }`}
                      >
                        {sub?.stateSubsidy?.status || "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                      {sub?.centralSubsidy?.appNumber || "APPLIED_ON_PORTAL"}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenProject(p, "subsidy")}
                        className="h-7 text-xs border-slate-200 bg-slate-50 text-amber-700 hover:bg-amber-50 font-bold"
                      >
                        Subsidy Details ➔
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ----------------------------------------------------
// 5. ELECTRICITY / DISCOM VIEW (LIGHT THEME)
// ----------------------------------------------------
export function ElectricityView({ projects, onOpenProject }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
          <FileText className="h-5 w-5 text-sky-600" />
          Electricity Department & DISCOM Management (UPPCL)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          UPPCL / PVVNL / MVVNL / DVVNL consumer accounts, sanctioned load, bill verification, and division clearance.
        </p>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Customer & Project</th>
                <th className="px-4 py-3.5">Consumer / Account No</th>
                <th className="px-4 py-3.5">DISCOM Name & Division</th>
                <th className="px-4 py-3.5">Sanctioned Load</th>
                <th className="px-4 py-3.5">Bill Verification</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => {
                const dis = p.discomDetails;
                return (
                  <tr key={p.id || p.projectId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{p.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.projectId} • {p.mobile}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-800">
                      {dis?.consumerNumber || dis?.connectionNumber || "Not recorded"}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">
                        {dis?.discomName || "UPPCL"}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {dis?.division || p.city}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-sky-700">
                      {dis?.sanctionedLoad || `${p.solarInstallation?.capacityKW || 3} KW`}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className="border-emerald-300 text-emerald-700 bg-emerald-50 text-[10px] font-bold"
                      >
                        VERIFIED_UPPCL
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenProject(p, "electricity")}
                        className="h-7 text-xs border-slate-200 bg-slate-50 text-sky-700 hover:bg-sky-50 font-bold"
                      >
                        DISCOM View ➔
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ----------------------------------------------------
// 6. METER MANAGEMENT VIEW (LIGHT THEME + UPLOAD & DELETE)
// ----------------------------------------------------
export function MetersView({ projects, stats, onOpenProject, onRefresh }: SectionViewProps) {
  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  const [selectedMeterProject, setSelectedMeterProject] = useState<IProjectData | null>(null);
  const [isMeterModalOpen, setIsMeterModalOpen] = useState(false);
  const [meterFileName, setMeterFileName] = useState("");
  const [meterFileType, setMeterFileType] = useState("Net-Meter Photo");
  const [meterFileData, setMeterFileData] = useState<string | null>(null);
  const [isUploadingMeterFile, setIsUploadingMeterFile] = useState(false);

  const handleMeterFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!meterFileName) {
      setMeterFileName(file.name);
    }
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      setMeterFileData(loadEvt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadMeterFileSubmit = async () => {
    if (!selectedMeterProject || !meterFileData) {
      return toast.error("Kripya meter file ya photo chunein");
    }
    setIsUploadingMeterFile(true);
    try {
      const res = await fetch(`${baseUrl}/api/projects/${selectedMeterProject.id || selectedMeterProject.projectId}/meter-files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify({
          name: meterFileName || "Meter Photo",
          docType: meterFileType,
          fileUrl: meterFileData,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload meter file");
      toast.success("Meter file successfully uploaded!");
      setMeterFileData(null);
      setMeterFileName("");
      setIsMeterModalOpen(false);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload meter file");
    } finally {
      setIsUploadingMeterFile(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
          <Cpu className="h-5 w-5 text-sky-600" />
          Smart Bi-directional Net-Meter & Grid Sync Management
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Bi-directional net-meter requisition, inspection photo upload, meter testing, and grid configuration tracking.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase block">
            Net Meters Configured
          </span>
          <div className="text-2xl font-extrabold font-display text-emerald-700 mt-1">
            {stats?.meterConfigured ?? 0}
          </div>
          <p className="text-[10px] text-slate-500">Exporting solar power</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase block">
            Meters Pending
          </span>
          <div className="text-2xl font-extrabold font-display text-amber-700 mt-1">
            {stats?.meterPending ?? 0}
          </div>
          <p className="text-[10px] text-slate-500">DISCOM testing queue</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-sky-600 uppercase block">
            Bi-directional Type
          </span>
          <div className="text-2xl font-extrabold font-display text-slate-900 mt-1">Smart AMR</div>
          <p className="text-[10px] text-slate-400">3-Phase / 1-Phase optical</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">
            UPPCL Grid Standard
          </span>
          <div className="text-2xl font-extrabold font-display text-slate-900 mt-1">50 Hz ±1%</div>
          <p className="text-[10px] text-slate-400">Anti-islanding compliant</p>
        </div>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Customer & Project</th>
                <th className="px-4 py-3.5">Meter Type</th>
                <th className="px-4 py-3.5">Meter Number</th>
                <th className="px-4 py-3.5">Configuration Status</th>
                <th className="px-4 py-3.5">Meter Health</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => {
                const met = p.meterDetails;
                return (
                  <tr key={p.id || p.projectId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{p.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.projectId} • {p.city}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">
                      {met?.existingMeterType || "Smart Bi-Directional"}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">
                      {met?.meterNumber || "REQUISITIONED"}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          met?.configStatus === "CONFIGURED"
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : "border-amber-300 text-amber-700 bg-amber-50"
                        }`}
                      >
                        {met?.configStatus || "PENDING_DISCOM"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className="border-emerald-300 text-emerald-700 bg-emerald-50 text-[10px] font-bold"
                      >
                        HEALTHY
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMeterProject(p);
                          setIsMeterModalOpen(true);
                        }}
                        className="h-7 text-xs border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold"
                        title="Upload Meter Photo / File"
                      >
                        <Upload className="h-3 w-3 mr-1" /> Upload File
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenProject(p, "meter")}
                        className="h-7 text-xs border-slate-200 bg-slate-50 text-sky-700 hover:bg-sky-50 font-bold"
                      >
                        Meter File ➔
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Meter File Upload Modal */}
      <Dialog open={isMeterModalOpen} onOpenChange={setIsMeterModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="h-4 w-4 text-sky-600" />
              Upload Net-Meter Document / Inspection Photo
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Project: {selectedMeterProject?.customerName} ({selectedMeterProject?.projectId})
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Document / Photo Type:
              </label>
              <select
                value={meterFileType}
                onChange={(e) => setMeterFileType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs bg-white"
              >
                <option value="Net-Meter Photo">Net-Meter Front Display Photo</option>
                <option value="Bi-Directional Seal">Meter Box & Hologram Seal</option>
                <option value="DISCOM Inspection Report">DISCOM J.E. Inspection Report</option>
                <option value="Commissioning Certificate">Net-Meter Commissioning Slip</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Document Title / File Name:
              </label>
              <Input
                placeholder="e.g. Smart Meter Testing Photo"
                value={meterFileName}
                onChange={(e) => setMeterFileName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Choose File (Photo / PDF):
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleMeterFileSelect}
                className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
              />
            </div>

            {meterFileData && (
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> File ready for upload
                </span>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMeterModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUploadMeterFileSubmit}
              disabled={isUploadingMeterFile || !meterFileData}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
            >
              {isUploadingMeterFile ? "Uploading..." : "Upload File"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ----------------------------------------------------
// 7. DOCUMENTS REPOSITORY VIEW (LIGHT THEME + UPLOAD, EDIT, DELETE)
// ----------------------------------------------------
export function DocumentsView({ projects, onOpenProject, onRefresh }: SectionViewProps) {
  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  // Interactive Customer Documents Modal State
  const [selectedDocProject, setSelectedDocProject] = useState<IProjectData | null>(null);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // Upload Doc State
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [docType, setDocType] = useState("Aadhaar Card");
  const [docName, setDocName] = useState("");
  const [docFilePayload, setDocFilePayload] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Edit Doc State
  const [editingDoc, setEditingDoc] = useState<{ id: string; name: string; docType: string; status: string } | null>(null);
  const [isEditDocOpen, setIsEditDocOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete Doc State
  const [docToDelete, setDocToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleteDocOpen, setIsDeleteDocOpen] = useState(false);
  const [isDeletingDoc, setIsDeletingDoc] = useState(false);

  const handleDocFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!docName) setDocName(file.name);
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      setDocFilePayload(loadEvt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadDocSubmit = async () => {
    if (!selectedDocProject || !docFilePayload) {
      return toast.error("Kripya file select karein");
    }
    setIsUploading(true);
    try {
      const res = await fetch(`${baseUrl}/api/projects/${selectedDocProject.id || selectedDocProject.projectId}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify({
          name: docName || docType,
          docType,
          fileUrl: docFilePayload,
          status: "VERIFIED",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      toast.success("Document uploaded successfully!");
      setDocFilePayload(null);
      setDocName("");
      setIsUploadDocOpen(false);

      // Update local project docs
      if (selectedDocProject.documents) {
        selectedDocProject.documents.push(data.document || {
          id: Date.now().toString(),
          name: docName,
          docType,
          fileUrl: docFilePayload,
          uploadDate: new Date().toISOString(),
          status: "VERIFIED",
        });
      }
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditDocSubmit = async () => {
    if (!selectedDocProject || !editingDoc) return;
    setIsSavingEdit(true);
    try {
      const res = await fetch(`${baseUrl}/api/projects/${selectedDocProject.id || selectedDocProject.projectId}/documents/${editingDoc.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify({
          name: editingDoc.name,
          docType: editingDoc.docType,
          status: editingDoc.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update document");
      toast.success("Document updated successfully");
      setIsEditDocOpen(false);
      setEditingDoc(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update document");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteDocSubmit = async () => {
    if (!selectedDocProject || !docToDelete) return;
    setIsDeletingDoc(true);
    try {
      const res = await fetch(`${baseUrl}/api/projects/${selectedDocProject.id || selectedDocProject.projectId}/documents/${docToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete document");
      toast.success("Document deleted successfully");
      if (selectedDocProject.documents) {
        selectedDocProject.documents = selectedDocProject.documents.filter((d) => d.id !== docToDelete.id);
      }
      setIsDeleteDocOpen(false);
      setDocToDelete(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete document");
    } finally {
      setIsDeletingDoc(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
          <FileText className="h-5 w-5 text-orange-500" />
          Customer KYC, Subsidy & Rooftop Solar Document Repository
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Verify Aadhaar cards, PAN, electricity bills, bank passbooks, site survey photos, and solar plant commissioning receipts.
        </p>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Customer & Project</th>
                <th className="px-4 py-3.5">Aadhaar Card</th>
                <th className="px-4 py-3.5">PAN Card</th>
                <th className="px-4 py-3.5">Electricity Bill</th>
                <th className="px-4 py-3.5">Bank Passbook</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => {
                const docs = p.documents || [];
                const hasAadhaar = Boolean(p.aadhaarNumber || docs.some((d) => d.docType?.includes("Aadhaar")));
                const hasPan = Boolean(p.panNumber || docs.some((d) => d.docType?.includes("PAN")));
                const hasBill = Boolean(p.discomDetails?.consumerNumber || docs.some((d) => d.docType?.includes("Bill")));
                const hasPassbook = Boolean(p.bankLoan?.loanAppNumber || docs.some((d) => d.docType?.includes("Passbook")));

                return (
                  <tr key={p.id || p.projectId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{p.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.projectId} • {p.city}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          hasAadhaar
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : "border-slate-200 text-slate-400 bg-slate-50"
                        }`}
                      >
                        {hasAadhaar ? "VERIFIED" : "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          hasPan
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : "border-slate-200 text-slate-400 bg-slate-50"
                        }`}
                      >
                        {hasPan ? "VERIFIED" : "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          hasBill
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : "border-slate-200 text-slate-400 bg-slate-50"
                        }`}
                      >
                        {hasBill ? "VERIFIED" : "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          hasPassbook
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : "border-slate-200 text-slate-400 bg-slate-50"
                        }`}
                      >
                        {hasPassbook ? "VERIFIED" : "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDocProject(p);
                          setIsDocsModalOpen(true);
                        }}
                        className="h-7 text-xs border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold"
                      >
                        View Files ({docs.length}) ➔
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onOpenProject(p, "documents")}
                        className="h-7 text-xs text-slate-600 hover:bg-slate-100"
                        title="Open in Master File"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Documents Modal */}
      <Dialog open={isDocsModalOpen} onOpenChange={setIsDocsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-500" />
                Customer Documents: {selectedDocProject?.customerName}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Project ID: {selectedDocProject?.projectId} • Mobile: {selectedDocProject?.mobile}
              </DialogDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setIsUploadDocOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" /> Upload File
            </Button>
          </DialogHeader>

          <div className="py-4 space-y-3">
            {(!selectedDocProject?.documents || selectedDocProject.documents.length === 0) ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FileText className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                No documents uploaded yet for this customer.
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsUploadDocOpen(true)}
                    className="text-xs font-bold text-orange-600 border-orange-200"
                  >
                    ➕ Upload First Document
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedDocProject.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge className="bg-orange-100 text-orange-800 text-[10px] font-bold border-orange-200">
                          {doc.docType}
                        </Badge>
                        <h4 className="text-xs font-bold text-slate-900 mt-1 truncate max-w-[180px]">
                          {doc.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 block">
                          {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString("en-IN") : "Uploaded"}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          doc.status === "VERIFIED"
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : "border-amber-300 text-amber-700 bg-amber-50"
                        }`}
                      >
                        {doc.status || "VERIFIED"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                      {doc.fileUrl ? (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" /> View / Preview
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400">No URL</span>
                      )}

                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingDoc({
                              id: doc.id,
                              name: doc.name,
                              docType: doc.docType,
                              status: doc.status || "VERIFIED",
                            });
                            setIsEditDocOpen(true);
                          }}
                          className="h-6 w-6 p-0 text-slate-500 hover:text-blue-600"
                          title="Edit Document"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setDocToDelete({ id: doc.id, name: doc.name });
                            setIsDeleteDocOpen(true);
                          }}
                          className="h-6 w-6 p-0 text-slate-500 hover:text-red-600"
                          title="Delete Document"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDocsModalOpen(false)}
              className="text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={isUploadDocOpen} onOpenChange={setIsUploadDocOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="h-4 w-4 text-orange-500" />
              Upload New Document
            </DialogTitle>
          </DialogHeader>

          <div className="py-3 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Document Type:
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs bg-white"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Electricity Bill">Electricity Bill</option>
                <option value="Bank Passbook / Cheque">Bank Passbook / Cancelled Cheque</option>
                <option value="Rooftop Site Survey Photo">Rooftop Site Survey Photo</option>
                <option value="Solar Commissioning Receipt">Solar Commissioning Receipt</option>
                <option value="Other">Other Document</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Document Title:
              </label>
              <Input
                placeholder="e.g. Customer Aadhaar Front & Back"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Select File (PDF or Image):
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleDocFileSelect}
                className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
              />
            </div>

            {docFilePayload && (
              <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> File loaded ready to save
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUploadDocOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUploadDocSubmit}
              disabled={isUploading || !docFilePayload}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
            >
              {isUploading ? "Uploading..." : "Save Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={isEditDocOpen} onOpenChange={setIsEditDocOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Edit className="h-4 w-4 text-blue-600" />
              Edit Document Details
            </DialogTitle>
          </DialogHeader>

          {editingDoc && (
            <div className="py-3 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Document Name:
                </label>
                <Input
                  value={editingDoc.name}
                  onChange={(e) => setEditingDoc({ ...editingDoc, name: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Document Type:
                </label>
                <Input
                  value={editingDoc.docType}
                  onChange={(e) => setEditingDoc({ ...editingDoc, docType: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Verification Status:
                </label>
                <select
                  value={editingDoc.status}
                  onChange={(e) => setEditingDoc({ ...editingDoc, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs bg-white"
                >
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDocOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleEditDocSubmit}
              disabled={isSavingEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
            >
              {isSavingEdit ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Document Dialog */}
      <Dialog open={isDeleteDocOpen} onOpenChange={setIsDeleteDocOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Document?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Kya aap &quot;{docToDelete?.name}&quot; document delete karna chahte hain?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDocOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDeleteDocSubmit}
              disabled={isDeletingDoc}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
            >
              {isDeletingDoc ? "Deleting..." : "Delete Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ----------------------------------------------------
// 8. FOLLOW-UPS VIEW (LIGHT THEME + 1-CLICK CALL, WHATSAPP & UPDATE MODAL)
// ----------------------------------------------------
export function FollowUpsView({
  projects,
  leads,
  onOpenProject,
  onOpenLead,
  onRefresh,
}: SectionViewProps) {
  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  // Update Followup Modal State
  const [selectedProjectForFollowUp, setSelectedProjectForFollowUp] = useState<IProjectData | null>(null);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [discussionNotes, setDiscussionNotes] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [contactMethod, setContactMethod] = useState("Phone Call");
  const [isSavingFollowUp, setIsSavingFollowUp] = useState(false);

  const handleOpenFollowUpModal = (p: IProjectData) => {
    setSelectedProjectForFollowUp(p);
    setDiscussionNotes(p.currentFollowUp?.currentDiscussion || "");
    setNextFollowUpDate(p.currentFollowUp?.nextFollowUpDate || new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]);
    setIsFollowUpModalOpen(true);
  };

  const handleSaveFollowUpSubmit = async () => {
    if (!selectedProjectForFollowUp) return;
    setIsSavingFollowUp(true);
    try {
      const res = await fetch(`${baseUrl}/api/projects/${selectedProjectForFollowUp.id || selectedProjectForFollowUp.projectId}/followups`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify({
          currentDiscussion: discussionNotes,
          nextFollowUpDate,
          contactMethod,
          party: "Customer",
          notes: discussionNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save follow-up");
      toast.success("Follow-up updated successfully!");
      setIsFollowUpModalOpen(false);
      setSelectedProjectForFollowUp(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update follow-up");
    } finally {
      setIsSavingFollowUp(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
          <Calendar className="h-5 w-5 text-amber-500" />
          Scheduled Customer Follow-ups & Survey Callbacks
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Upcoming customer calls, 1-click WhatsApp messaging, quotation follow-ups, and site survey schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Project Followups */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Active Project Follow-ups
          </h3>
          <div className="divide-y divide-slate-100">
            {projects.slice(0, 10).map((p) => {
              const fu = p.currentFollowUp;
              const cleanPhone = (p.whatsapp || p.mobile || "").replace(/\D/g, "").slice(-10);
              const waText = encodeURIComponent(
                `Namaste ${p.customerName} ji, Matri Shakti Solar Infrastructure ki taraf se aapke ${p.solarInstallation?.capacityKW || 3} KW solar plant ke baare me baat karni thi.`
              );

              return (
                <div key={p.id || p.projectId} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{p.customerName}</span>
                      <span className="text-[10px] font-mono text-slate-400">({p.projectId})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {fu?.currentDiscussion || "Solar installation lifecycle follow-up"}
                    </p>
                    <span className="text-[10px] text-amber-600 mt-0.5 inline-block font-semibold">
                      Next Call: {fu?.nextFollowUpDate || "Scheduled soon"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={`tel:${p.mobile}`}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      title="Direct Call"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/91${cleanPhone}?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 transition-colors"
                        title="1-Click WhatsApp"
                      >
                        <FaWhatsapp className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenFollowUpModal(p)}
                      className="h-7 text-xs text-orange-600 hover:bg-orange-50 font-bold"
                    >
                      Update
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Followups */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Users className="h-4 w-4 text-orange-500" /> New Inquiry Callbacks
          </h3>
          <div className="divide-y divide-slate-100">
            {leads.slice(0, 10).map((lead) => {
              const cleanPhone = (lead.whatsapp || lead.phone || "").replace(/\D/g, "").slice(-10);
              const waText = encodeURIComponent(
                `Namaste ${lead.name} ji, Matri Shakti Solar me aapki ${lead.requiredCapacityKW || 3} KW solar lagwane ki enquiry mili thi. Kya abhi baat ho sakti hai?`
              );

              return (
                <div key={lead.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{lead.name}</span>
                      <Badge variant="outline" className="text-[9px] py-0 text-amber-700 border-amber-200 bg-amber-50">
                        {lead.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {lead.notes || `Inquiry for ${lead.requiredCapacityKW || 3} KW solar system`}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 inline-block">
                      {lead.city} • {lead.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={`tel:${lead.phone}`}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      title="Direct Call"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/91${cleanPhone}?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 transition-colors"
                        title="1-Click WhatsApp"
                      >
                        <FaWhatsapp className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOpenLead(lead)}
                      className="h-7 text-xs text-orange-600 hover:bg-orange-50 font-bold"
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Follow-up Update Modal */}
      <Dialog open={isFollowUpModalOpen} onOpenChange={setIsFollowUpModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              Update Customer Follow-up
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Customer: {selectedProjectForFollowUp?.customerName} ({selectedProjectForFollowUp?.projectId})
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Discussion Notes / Conversation Summary:
              </label>
              <textarea
                rows={3}
                value={discussionNotes}
                onChange={(e) => setDiscussionNotes(e.target.value)}
                placeholder="Aadhaar card mangwaya, site survey schedule kiya, subsidy DBT samjhaya..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white focus:ring-1 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Next Follow-up Date:
                </label>
                <Input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Contact Method:
                </label>
                <select
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs bg-white"
                >
                  <option value="Phone Call">Phone Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Site Visit">Site Visit</option>
                  <option value="Office Meeting">Office Meeting</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFollowUpModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveFollowUpSubmit}
              disabled={isSavingFollowUp}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
            >
              {isSavingFollowUp ? "Saving..." : "Save Follow-up"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ----------------------------------------------------
// 9. ISSUES & ESCALATIONS VIEW (LIGHT THEME)
// ----------------------------------------------------
export function IssuesView({ projects, stats, onOpenProject }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
          <AlertTriangle className="h-5 w-5 text-rose-500" />
          Project Issues, DISCOM Mismatch & Technical Escalations
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Track active technical faults, DISCOM name mismatch disputes, meter delays, and customer escalations.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-rose-700 uppercase block">
            Open Issues
          </span>
          <div className="text-2xl font-extrabold font-display text-rose-700 mt-1">
            {stats?.totalOpenIssues ?? 0}
          </div>
          <p className="text-[10px] text-slate-500">Requiring admin action</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase block">
            DISCOM Name Corrections
          </span>
          <div className="text-2xl font-extrabold font-display text-amber-700 mt-1">0 Pending</div>
          <p className="text-[10px] text-slate-500">Bill name rectification</p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-blue-700 uppercase block">
            Meter Delay Escalations
          </span>
          <div className="text-2xl font-extrabold font-display text-blue-700 mt-1">
            {stats?.meterPending ?? 0}
          </div>
          <p className="text-[10px] text-slate-500">In process with division</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase block">
            Resolved Issues
          </span>
          <div className="text-2xl font-extrabold font-display text-emerald-700 mt-1">100%</div>
          <p className="text-[10px] text-slate-500">Resolution satisfaction</p>
        </div>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Customer Project Escalations Log
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {projects.map((p) => {
            const hasIssue = (p.issues && p.issues.length > 0) || false;
            return (
              <div
                key={p.id || p.projectId}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{p.customerName}</span>
                    <Badge variant="outline" className="text-[10px] font-mono border-slate-200 bg-slate-50">
                      {p.projectId}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-bold ${
                        hasIssue
                          ? "border-rose-300 text-rose-700 bg-rose-50"
                          : "border-emerald-300 text-emerald-700 bg-emerald-50"
                      }`}
                    >
                      {hasIssue ? "ISSUE_ACTIVE" : "OPERATING_SMOOTHLY"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {hasIssue && p.issues?.[0]?.description
                      ? p.issues[0].description
                      : "System installed and operating normally with no unresolved tickets."}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenProject(p, "issues")}
                  className="h-7 text-xs border-slate-200 bg-slate-50 text-rose-600 hover:bg-rose-50 font-bold shrink-0 self-start sm:self-center"
                >
                  Manage Issue ➔
                </Button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ----------------------------------------------------
// 10. REPORTS & ANALYTICS VIEW (MODERN CRM + EXPORT & DELETE)
// ----------------------------------------------------
export function ReportsView({ stats, projects, leads }: SectionViewProps) {
  // Mock / Initial Generated Reports with Real Delete Feature
  const [reportList, setReportList] = useState([
    {
      id: "REP-2025-03-A",
      name: "Monthly Financial Turnover & Subsidy Audit",
      period: "March 2025",
      category: "FINANCIAL",
      format: "CSV / Excel",
      size: "142 KB",
      createdAt: "2025-03-01",
    },
    {
      id: "REP-2025-02-B",
      name: "PM Surya Ghar DBT Subsidy Disbursement Reconciliation",
      period: "February 2025",
      category: "GOVT_SUBSIDY",
      format: "PDF Report",
      size: "2.4 MB",
      createdAt: "2025-02-28",
    },
    {
      id: "REP-2025-02-C",
      name: "Smart Bi-Directional Net-Meter Compliance Log",
      period: "February 2025",
      category: "DISCOM",
      format: "Excel",
      size: "88 KB",
      createdAt: "2025-02-15",
    },
    {
      id: "REP-2025-01-D",
      name: "Q4 Rooftop Solar Capacity & Generation Analytics",
      period: "Q4 2024–25",
      category: "ANALYTICS",
      format: "PDF / Exec",
      size: "3.1 MB",
      createdAt: "2025-01-31",
    },
  ]);

  const [reportToDelete, setReportToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleteReportOpen, setIsDeleteReportOpen] = useState(false);

  const handleDeleteReport = () => {
    if (!reportToDelete) return;
    setReportList(reportList.filter((r) => r.id !== reportToDelete.id));
    toast.success(`Report "${reportToDelete.name}" deleted successfully!`);
    setIsDeleteReportOpen(false);
    setReportToDelete(null);
  };

  const handleExportCSV = () => {
    // Generate real CSV from projects array
    const headers = [
      "Project ID",
      "Customer Name",
      "Mobile",
      "City",
      "Capacity (KW)",
      "Total Project Cost",
      "Amount Paid",
      "Amount Remaining",
      "Payment Status",
      "Central Subsidy (₹78k)",
      "State Subsidy (₹30k)",
      "Meter Status",
    ];

    const rows = projects.map((p) => [
      p.projectId,
      `"${p.customerName}"`,
      p.mobile,
      p.city,
      p.solarInstallation?.capacityKW || 3,
      p.payments?.totalProjectCost || (p.solarInstallation?.capacityKW || 3) * 65000,
      p.payments?.amountPaid || 0,
      p.payments?.amountRemaining || 0,
      `"${p.payments?.paymentStatus || 'Pending'}"`,
      `"${p.subsidyTracking?.centralSubsidy?.status || 'Pending'}"`,
      `"${p.subsidyTracking?.stateSubsidy?.status || 'Pending'}"`,
      `"${p.meterDetails?.configStatus || 'Pending'}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Matri_Shakti_Solar_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Solar CRM CSV Report downloaded successfully!");
  };

  const handlePrintReport = () => {
    window.print();
  };

  const totalRevenue = projects.reduce(
    (acc, p) => acc + (p.payments?.totalProjectCost || (p.solarInstallation?.capacityKW || 3) * 65000),
    0
  );
  const totalPaid = projects.reduce(
    (acc, p) => acc + (p.payments?.amountPaid || 0),
    0
  );
  const totalCapacityKW = projects.reduce(
    (acc, p) => acc + (p.solarInstallation?.capacityKW || 3),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with Real Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Solar CRM Analytics, Audits & Generated Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real modern project performance metrics, exportable audit logs, and customizable reports suite.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm"
          >
            <Download className="h-4 w-4" /> Download CSV
          </Button>
          <Button
            variant="outline"
            onClick={handlePrintReport}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold gap-1.5"
          >
            <Printer className="h-4 w-4" /> Print Report
          </Button>
        </div>
      </div>

      {/* 4 Financial & Operational Highlights */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/40 p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">
            Total Billed Volume
          </span>
          <div className="text-2xl font-extrabold font-display text-slate-900 mt-1">
            ₹{(totalRevenue / 100000).toFixed(2)} Lakh
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{projects.length} commissioned projects</p>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase block">
            Cash Collections
          </span>
          <div className="text-2xl font-extrabold font-display text-emerald-700 mt-1">
            ₹{(totalPaid / 100000).toFixed(2)} Lakh
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Realized turnover</p>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase block">
            Total Solar Generation
          </span>
          <div className="text-2xl font-extrabold font-display text-amber-700 mt-1">
            {totalCapacityKW} KW
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Installed capacity</p>
        </div>

        <div className="rounded-3xl border border-purple-200 bg-purple-50/40 p-5 shadow-xs">
          <span className="text-[11px] font-bold text-purple-700 uppercase block">
            Max Customer Subsidy
          </span>
          <div className="text-2xl font-extrabold font-display text-purple-700 mt-1">
            ₹1,08,000
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">PM Surya Ghar + UPNEDA</p>
        </div>
      </div>

      {/* Generated Reports Table with DELETE Feature */}
      <Card className="border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-600" />
              Archived Audit & Compliance Reports
            </h3>
            <p className="text-[11px] text-slate-400">Manage, export, and delete generated company audit files</p>
          </div>
          <Badge className="bg-slate-100 text-slate-700 text-[10px] font-bold">
            {reportList.length} Reports
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Report Title</th>
                <th className="px-4 py-3.5">Period / Quarter</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Format & Size</th>
                <th className="px-4 py-3.5">Generated On</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportList.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900">{rep.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{rep.id}</div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-700">{rep.period}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant="outline" className="text-[10px] font-bold border-slate-200 bg-slate-50">
                      {rep.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {rep.format} • {rep.size}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">{rep.createdAt}</td>
                  <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportCSV}
                      className="h-7 text-xs border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold"
                      title="Download Report"
                    >
                      <Download className="h-3 w-3 mr-1" /> Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReportToDelete(rep);
                        setIsDeleteReportOpen(true);
                      }}
                      className="h-7 text-xs border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-semibold"
                      title="Delete Report"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Report Confirmation Dialog */}
      <Dialog open={isDeleteReportOpen} onOpenChange={setIsDeleteReportOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Report?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Kya aap &quot;{reportToDelete?.name}&quot; report delete karna chahte hain?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteReportOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDeleteReport}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
            >
              Delete Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ----------------------------------------------------
// 11. SETTINGS & SYSTEM CONFIGURATION VIEW (LIGHT THEME)
// ----------------------------------------------------
export function SettingsView({ adminUser, onRefresh }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
          <Settings className="h-5 w-5 text-orange-500" />
          Admin Portal & Infrastructure Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Administrator profile, active sessions, database connectivity, and portal configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Lock className="h-4 w-4 text-orange-500" /> Authenticated Administrator
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Email Address:</span>
              <span className="font-bold text-slate-900">{adminUser?.email || "admin@matrishakti.com"}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Role & Privileges:</span>
              <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50 mt-1 font-bold">
                FULL_ADMIN_ACCESS
              </Badge>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Session Status:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Active JWT Bearer Session
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Database className="h-4 w-4 text-emerald-600" /> Database & Environment
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Database Service:</span>
              <span className="font-bold text-slate-900">MongoDB Atlas Cluster (Live Cloud)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Connection Status:</span>
              <Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50 mt-1 font-bold">
                ONLINE & HEALTHY
              </Badge>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Software Version:</span>
              <span className="text-slate-600 font-mono">Matri Shakti Solar CRM v2.0 (Modern Light Suite)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
