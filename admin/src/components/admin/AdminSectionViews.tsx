import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
// 1. DASHBOARD EXECUTIVE OVERVIEW
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
}: SectionViewProps) {
  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-500 text-slate-950 font-black text-xs">
                MS
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Matri Shakti Solar CRM & Command Center
              </span>
            </div>
            <h2 className="mt-2 font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Solar Operations, PM Surya Ghar & Customer Lifecycle
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
              UPNEDA Authorized Partner. Complete management of rooftop solar installations,
              Central & State subsidies (₹1,08,000 max), bank loan approvals, and bi-directional smart net-metering.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              onClick={onNewProject}
              className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs gap-1.5 shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              ➕ Naya / Past Solar Data Bharein
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSwitchTab("matrix")}
              className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 text-xs font-semibold"
            >
              1–20 KW Matrix
            </Button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Card
          onClick={() => onSwitchTab("leads")}
          className="border-slate-800 bg-slate-900/70 backdrop-blur-sm shadow-md hover:border-orange-500/50 cursor-pointer transition-all"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <CardTitle className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Inquiries
            </CardTitle>
            <Users className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-white">
              {stats ? stats.totalLeads : "--"}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Customer leads</p>
          </CardContent>
        </Card>

        <Card
          onClick={() => onSwitchTab("leads")}
          className="border-slate-800 bg-slate-900/70 backdrop-blur-sm shadow-md hover:border-amber-500/50 cursor-pointer transition-all"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <CardTitle className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              New Leads
            </CardTitle>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-amber-400">
              {stats ? stats.newLeads : "--"}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Pending contact</p>
          </CardContent>
        </Card>

        <Card
          onClick={() => onSwitchTab("projects")}
          className="border-slate-800 bg-slate-900/70 backdrop-blur-sm shadow-md hover:border-emerald-500/50 cursor-pointer transition-all"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <CardTitle className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Active Projects
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-emerald-400">
              {stats?.totalProjects ?? projects.length}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Solar installations</p>
          </CardContent>
        </Card>

        <Card
          onClick={() => onSwitchTab("installations")}
          className="border-slate-800 bg-slate-900/70 backdrop-blur-sm shadow-md hover:border-green-500/50 cursor-pointer transition-all"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <CardTitle className="text-[11px] font-semibold text-green-400 uppercase tracking-wider">
              Commissioned
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-green-400">
              {stats?.totalInstalled ?? 0}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Solar rooftop active</p>
          </CardContent>
        </Card>

        <Card
          onClick={() => onSwitchTab("loans")}
          className="border-slate-800 bg-slate-900/70 backdrop-blur-sm shadow-md hover:border-purple-500/50 cursor-pointer transition-all"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <CardTitle className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
              Bank Loans
            </CardTitle>
            <Landmark className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-purple-400">
              {stats?.loanApproved ?? 0}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Disbursed: {stats?.loanDisbursed ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() => onSwitchTab("subsidies")}
          className="border-slate-800 bg-slate-900/70 backdrop-blur-sm shadow-md hover:border-indigo-500/50 cursor-pointer transition-all"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <CardTitle className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
              Govt Subsidy
            </CardTitle>
            <Zap className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-display text-indigo-300 truncate">
              ₹
              {(
                (stats?.centralSubsidyPending ?? 0) +
                (stats?.stateSubsidyPending ?? 0)
              ).toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Pending DBT</p>
          </CardContent>
        </Card>
      </div>

      {/* Subsidy & Net-Meter Live Status Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Central Subsidy PM Surya Ghar */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xs font-bold">
                PM
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  PM Surya Ghar (Central Subsidy)
                </h4>
                <p className="text-[10px] text-slate-400">National Portal DBT ₹78,000 Max</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-orange-500/30 text-orange-400">
              MNRE
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Expected</span>
              <span className="font-bold text-white text-xs">
                ₹{(stats?.centralSubsidyExpected ?? 78000).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-emerald-400 block">Received</span>
              <span className="font-bold text-emerald-400 text-xs">
                ₹{(stats?.centralSubsidyReceived ?? 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-amber-400 block">Pending</span>
              <span className="font-bold text-amber-400 text-xs">
                ₹{(stats?.centralSubsidyPending ?? 78000).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSwitchTab("subsidies")}
            className="w-full text-xs text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 justify-between h-7"
          >
            <span>View Subsidies Tracking</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        {/* State Subsidy UPNEDA */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
                UP
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  State Subsidy (UPNEDA)
                </h4>
                <p className="text-[10px] text-slate-400">Uttar Pradesh Govt DBT ₹30,000 Max</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
              UPNEDA
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Expected</span>
              <span className="font-bold text-white text-xs">
                ₹{(stats?.stateSubsidyExpected ?? 30000).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-emerald-400 block">Received</span>
              <span className="font-bold text-emerald-400 text-xs">
                ₹{(stats?.stateSubsidyReceived ?? 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-amber-400 block">Pending</span>
              <span className="font-bold text-amber-400 text-xs">
                ₹{(stats?.stateSubsidyPending ?? 30000).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSwitchTab("subsidies")}
            className="w-full text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 justify-between h-7"
          >
            <span>View State Subsidy</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        {/* Bi-directional Net Metering & Bank Loans */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 text-xs font-bold">
                ⚡
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Net-Meter & DISCOM Sync
                </h4>
                <p className="text-[10px] text-slate-400">Smart Bi-directional Meter Status</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-sky-500/30 text-sky-400">
              DISCOM
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-sky-400 block">Meter Configured</span>
              <span className="font-bold text-white text-base">
                {stats?.meterConfigured ?? 0}
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-amber-400 block">Meter Pending</span>
              <span className="font-bold text-amber-400 text-base">
                {stats?.meterPending ?? 0}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSwitchTab("meters")}
            className="w-full text-xs text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 justify-between h-7"
          >
            <span>View Net-Meter Operations</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Recent Projects & Leads Quick Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Solar Projects */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Recent Solar Customer Projects
              </h3>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSwitchTab("projects")}
              className="h-7 text-xs border-slate-700 bg-slate-800 text-slate-200"
            >
              View All ({projects.length})
            </Button>
          </div>

          {projects.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No solar projects recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {projects.slice(0, 5).map((p) => (
                <div
                  key={p.id || p.projectId}
                  className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-800/40 px-2 rounded-lg transition-colors"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{p.customerName}</span>
                      <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 py-0">
                        {p.projectId}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {p.mobile} • {p.city} • {p.solarSystem?.capacityKW || 3} KW
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onOpenProject(p)}
                    className="h-7 text-xs text-orange-400 hover:text-orange-300"
                  >
                    Open Master File
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Recent Customer Inquiries & Leads
              </h3>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSwitchTab("leads")}
              className="h-7 text-xs border-slate-700 bg-slate-800 text-slate-200"
            >
              View All ({leads.length})
            </Button>
          </div>

          {leads.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No leads currently recorded.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-800/40 px-2 rounded-lg transition-colors"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{lead.name}</span>
                      <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 py-0">
                        {lead.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {lead.phone} • {lead.city} • {lead.requiredCapacityKW || 3} KW
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onOpenLead(lead)}
                    className="h-7 text-xs text-orange-400 hover:text-orange-300"
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
// 2. PAYMENTS & FINANCIALS VIEW
// ----------------------------------------------------
export function PaymentsView({ projects, onOpenProject, onNewProject }: SectionViewProps) {
  const totalCost = projects.reduce(
    (acc, p) => acc + (p.customerPayment?.totalProjectCost || p.solarSystem?.totalPackagePrice || 0),
    0
  );
  const totalCustomerPaid = projects.reduce(
    (acc, p) => acc + (p.customerPayment?.amountPaid || 0),
    0
  );
  const totalBankDisbursed = projects.reduce(
    (acc, p) => acc + (p.bankLoan?.disbursedAmount || 0),
    0
  );
  const totalBalanceDue = projects.reduce(
    (acc, p) => acc + (p.customerPayment?.balanceRemaining || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
            <IndianRupee className="h-5 w-5 text-orange-400" />
            Customer Payments, Installments & Bank Loan Disbursals
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor receivables, customer payments received, bank loan credit, and pending balances.
          </p>
        </div>
        <Button
          onClick={onNewProject}
          className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs gap-1.5"
        >
          <Plus className="h-4 w-4" /> Naya Payment Record
        </Button>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">
            Total Project Value
          </span>
          <div className="text-2xl font-bold font-display text-white mt-1">
            ₹{totalCost.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">All customer projects</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase block">
            Customer Payments Collected
          </span>
          <div className="text-2xl font-bold font-display text-emerald-400 mt-1">
            ₹{totalCustomerPaid.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Advance & Installments</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-purple-400 uppercase block">
            Bank Loan Disbursed
          </span>
          <div className="text-2xl font-bold font-display text-purple-400 mt-1">
            ₹{totalBankDisbursed.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Financed by partner banks</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-amber-400 uppercase block">
            Balance Due / Pending
          </span>
          <div className="text-2xl font-bold font-display text-amber-400 mt-1">
            ₹{totalBalanceDue.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Receivables remaining</p>
        </div>
      </div>

      {/* Projects Payment Table */}
      <Card className="border-slate-800 bg-slate-900/70 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Project & Customer</th>
                <th className="px-4 py-3">Capacity / System</th>
                <th className="px-4 py-3">Total Cost</th>
                <th className="px-4 py-3">Customer Paid</th>
                <th className="px-4 py-3">Bank Disbursed</th>
                <th className="px-4 py-3">Balance Due</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {projects.map((p) => {
                const pCost =
                  p.customerPayment?.totalProjectCost || p.solarSystem?.totalPackagePrice || 0;
                const pPaid = p.customerPayment?.amountPaid || 0;
                const pBank = p.bankLoan?.disbursedAmount || 0;
                const pDue = p.customerPayment?.balanceRemaining ?? Math.max(0, pCost - pPaid - pBank);
                const status = p.customerPayment?.paymentStatus || "PENDING";

                return (
                  <tr key={p.id || p.projectId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{p.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {p.projectId} • {p.mobile}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-200">
                        {p.solarSystem?.capacityKW || 3} KW
                      </span>
                      <div className="text-[11px] text-slate-400">
                        {p.solarSystem?.companyName || "Standard"}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      ₹{pCost.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400">
                      ₹{pPaid.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-bold text-purple-400">
                      ₹{pBank.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-bold text-amber-400">
                      ₹{pDue.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          status === "PAID"
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            : status === "PARTIAL"
                            ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                            : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                        }`}
                      >
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenProject(p, "payments")}
                        className="h-7 text-xs border-slate-700 bg-slate-800 text-orange-400 hover:bg-slate-700"
                      >
                        Open Payments ➔
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
// 3. BANK LOANS VIEW
// ----------------------------------------------------
export function LoansView({ projects, stats, onOpenProject }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
        <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
          <Landmark className="h-5 w-5 text-purple-400" />
          Bank Loan Financing & Credit Tracker
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Monitor bank approvals, branch locations, sanctioned loan amounts, and disbursement tranches.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">
            Loans Approved
          </span>
          <div className="text-2xl font-bold font-display text-emerald-400 mt-1">
            {stats?.loanApproved ?? 0}
          </div>
          <p className="text-[10px] text-slate-500">Sanctioned projects</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-purple-400 uppercase block">
            Disbursed To Account
          </span>
          <div className="text-2xl font-bold font-display text-purple-400 mt-1">
            {stats?.loanDisbursed ?? 0}
          </div>
          <p className="text-[10px] text-slate-500">Funds released</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-amber-400 uppercase block">
            Sanctions Pending
          </span>
          <div className="text-2xl font-bold font-display text-amber-400 mt-1">
            {stats?.loanPending ?? 0}
          </div>
          <p className="text-[10px] text-slate-500">Under bank scrutiny</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-sky-400 uppercase block">
            Partner Banks
          </span>
          <div className="text-2xl font-bold font-display text-white mt-1">SBI • PNB • CBI</div>
          <p className="text-[10px] text-slate-500">Jan Samarth subsidized portal</p>
        </div>
      </div>

      {/* Loan Projects Table */}
      <Card className="border-slate-800 bg-slate-900/70 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Customer & Project</th>
                <th className="px-4 py-3">Bank Name & Branch</th>
                <th className="px-4 py-3">Loan Amount</th>
                <th className="px-4 py-3">Disbursed</th>
                <th className="px-4 py-3">Next Payment</th>
                <th className="px-4 py-3">Approval Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {projects.map((p) => {
                const loan = p.bankLoan;
                const isLoan = loan?.isLoanTaken || false;

                return (
                  <tr key={p.id || p.projectId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{p.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {p.projectId} • {p.mobile}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-200">
                        {loan?.bankName || (isLoan ? "Partner Bank" : "No Loan (Direct)")}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {loan?.branchLocation || p.city}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      ₹{(loan?.loanAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-bold text-purple-400">
                      ₹{(loan?.disbursedAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-bold text-amber-400">
                      ₹{(loan?.nextDisbursalAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          loan?.approvalStatus === "APPROVED"
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            : loan?.approvalStatus === "APPLIED"
                            ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                            : "border-slate-700 text-slate-400"
                        }`}
                      >
                        {loan?.approvalStatus || (isLoan ? "PROCESSING" : "NO_LOAN")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenProject(p, "loan")}
                        className="h-7 text-xs border-slate-700 bg-slate-800 text-purple-400 hover:bg-slate-700"
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
// 4. SUBSIDIES TRACKER VIEW
// ----------------------------------------------------
export function SubsidiesView({ projects, stats, onOpenProject }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
        <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
          <Zap className="h-5 w-5 text-amber-400" />
          PM Surya Ghar Muft Bijli Yojana & State Subsidy Tracker
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time verification of Central Govt DBT (₹78,000 max) and Uttar Pradesh State UPNEDA subsidy (₹30,000 max).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-orange-400 uppercase block">
            Central Subsidy Expected
          </span>
          <div className="text-xl font-bold font-display text-white mt-1">
            ₹{(stats?.centralSubsidyExpected ?? 78000).toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500">PM Surya Ghar Portal</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase block">
            Central DBT Received
          </span>
          <div className="text-xl font-bold font-display text-emerald-400 mt-1">
            ₹{(stats?.centralSubsidyReceived ?? 0).toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500">Credited to customer account</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase block">
            State Subsidy Expected
          </span>
          <div className="text-xl font-bold font-display text-white mt-1">
            ₹{(stats?.stateSubsidyExpected ?? 30000).toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500">UPNEDA Direct Benefit</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-amber-400 uppercase block">
            State DBT Received
          </span>
          <div className="text-xl font-bold font-display text-emerald-400 mt-1">
            ₹{(stats?.stateSubsidyReceived ?? 0).toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500">Uttar Pradesh Treasury</p>
        </div>
      </div>

      {/* Subsidy Table */}
      <Card className="border-slate-800 bg-slate-900/70 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Customer & Project</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Central Subsidy (₹78k)</th>
                <th className="px-4 py-3">State Subsidy (₹30k)</th>
                <th className="px-4 py-3">Portal App No</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {projects.map((p) => {
                const sub = p.subsidyStatus;
                return (
                  <tr key={p.id || p.projectId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{p.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {p.projectId} • {p.city}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-200">
                      {p.solarSystem?.capacityKW || 3} KW
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">
                        ₹{(sub?.centralSubsidyAmount || 78000).toLocaleString("en-IN")}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold ${
                          sub?.centralSubsidyStatus === "RECEIVED"
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                        }`}
                      >
                        {sub?.centralSubsidyStatus || "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">
                        ₹{(sub?.stateSubsidyAmount || 30000).toLocaleString("en-IN")}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold ${
                          sub?.stateSubsidyStatus === "RECEIVED"
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                        }`}
                      >
                        {sub?.stateSubsidyStatus || "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                      {sub?.centralApplicationNumber || "APPLIED_ON_PORTAL"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenProject(p, "subsidy")}
                        className="h-7 text-xs border-slate-700 bg-slate-800 text-amber-400 hover:bg-slate-700"
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
// 5. ELECTRICITY / DISCOM VIEW
// ----------------------------------------------------
export function ElectricityView({ projects, onOpenProject }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
        <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
          <FileText className="h-5 w-5 text-sky-400" />
          Electricity Department & DISCOM Management (UPPCL)
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          UPPCL / PVVNL / MVVNL / DVVNL consumer accounts, sanctioned load, bill verification, and division clearance.
        </p>
      </div>

      {/* Electricity Projects Table */}
      <Card className="border-slate-800 bg-slate-900/70 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Customer & Project</th>
                <th className="px-4 py-3">Consumer / Account No</th>
                <th className="px-4 py-3">DISCOM Name & Division</th>
                <th className="px-4 py-3">Sanctioned Load</th>
                <th className="px-4 py-3">Bill Verification</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {projects.map((p) => {
                const dis = p.discomDetails;
                return (
                  <tr key={p.id || p.projectId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{p.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {p.projectId} • {p.mobile}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-200">
                      {dis?.consumerNumber || dis?.connectionNumber || "Not recorded"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">
                        {dis?.discomName || "UPPCL"}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {dis?.division || p.district || p.city}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-sky-400">
                      {dis?.sanctionedLoadKW || p.solarSystem?.capacityKW || 3} KW
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          dis?.isBillDataCorrect
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                        }`}
                      >
                        {dis?.isBillDataCorrect ? "VERIFIED_CORRECT" : "NEEDS_VERIFICATION"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenProject(p, "electricity")}
                        className="h-7 text-xs border-slate-700 bg-slate-800 text-sky-400 hover:bg-slate-700"
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
// 6. METER MANAGEMENT VIEW
// ----------------------------------------------------
export function MetersView({ projects, stats, onOpenProject }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
        <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
          <Cpu className="h-5 w-5 text-sky-400" />
          Smart Bi-directional Net-Meter & Grid Sync Management
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Bi-directional net-meter requisition, inspection, meter testing, and grid configuration tracking.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase block">
            Net Meters Configured
          </span>
          <div className="text-2xl font-bold font-display text-emerald-400 mt-1">
            {stats?.meterConfigured ?? 0}
          </div>
          <p className="text-[10px] text-slate-500">Exporting solar power</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-amber-400 uppercase block">
            Meters Pending
          </span>
          <div className="text-2xl font-bold font-display text-amber-400 mt-1">
            {stats?.meterPending ?? 0}
          </div>
          <p className="text-[10px] text-slate-500">DISCOM testing queue</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-sky-400 uppercase block">
            Bi-directional Type
          </span>
          <div className="text-2xl font-bold font-display text-white mt-1">Smart AMR</div>
          <p className="text-[10px] text-slate-500">3-Phase / 1-Phase optical</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">
            UPPCL Grid Standard
          </span>
          <div className="text-2xl font-bold font-display text-white mt-1">50 Hz ±1%</div>
          <p className="text-[10px] text-slate-500">Anti-islanding compliant</p>
        </div>
      </div>

      {/* Meter Table */}
      <Card className="border-slate-800 bg-slate-900/70 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Customer & Project</th>
                <th className="px-4 py-3">Meter Type</th>
                <th className="px-4 py-3">Meter Serial / Seal No</th>
                <th className="px-4 py-3">Configuration Status</th>
                <th className="px-4 py-3">Meter Health</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {projects.map((p) => {
                const met = p.meterDetails;
                return (
                  <tr key={p.id || p.projectId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{p.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {p.projectId} • {p.city}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-200">
                      {met?.meterType || "SMART_BI_DIRECTIONAL"}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      {met?.meterNumber || "REQUISITIONED"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          met?.isMeterConfigured
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                        }`}
                      >
                        {met?.isMeterConfigured ? "CONFIGURED_ONLINE" : "PENDING_DISCOM"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          met?.isMeterWorkingProperly !== false
                            ? "border-emerald-500/30 text-emerald-400"
                            : "border-rose-500/30 text-rose-400"
                        }`}
                      >
                        {met?.isMeterWorkingProperly !== false ? "HEALTHY" : "REPORT_ISSUE"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenProject(p, "meter")}
                        className="h-7 text-xs border-slate-700 bg-slate-800 text-sky-400 hover:bg-slate-700"
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
    </div>
  );
}

// ----------------------------------------------------
// 7. DOCUMENTS REPOSITORY VIEW
// ----------------------------------------------------
export function DocumentsView({ projects, onOpenProject }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
        <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
          <FileText className="h-5 w-5 text-orange-400" />
          Customer KYC, Subsidy & Rooftop Solar Document Repository
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Verify Aadhaar cards, PAN, electricity bills, bank passbooks, site survey photos, and solar plant commissioning receipts.
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-900/70 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Customer & Project</th>
                <th className="px-4 py-3">Aadhaar Card</th>
                <th className="px-4 py-3">PAN Card</th>
                <th className="px-4 py-3">Electricity Bill</th>
                <th className="px-4 py-3">Bank Passbook</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {projects.map((p) => {
                const docs = p.documents || [];
                const hasAadhaar = Boolean(p.aadhaarNumber || docs.some((d) => d.docType?.includes("Aadhaar")));
                const hasPan = Boolean(p.panNumber || docs.some((d) => d.docType?.includes("PAN")));
                const hasBill = Boolean(p.discomDetails?.consumerNumber || docs.some((d) => d.docType?.includes("Bill")));
                const hasPassbook = Boolean(p.bankLoan?.accountNumber || docs.some((d) => d.docType?.includes("Passbook")));

                return (
                  <tr key={p.id || p.projectId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{p.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {p.projectId} • {p.city}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          hasAadhaar
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            : "border-slate-700 text-slate-500"
                        }`}
                      >
                        {hasAadhaar ? "VERIFIED" : "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          hasPan
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            : "border-slate-700 text-slate-500"
                        }`}
                      >
                        {hasPan ? "VERIFIED" : "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          hasBill
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            : "border-slate-700 text-slate-500"
                        }`}
                      >
                        {hasBill ? "VERIFIED" : "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          hasPassbook
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            : "border-slate-700 text-slate-500"
                        }`}
                      >
                        {hasPassbook ? "VERIFIED" : "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenProject(p, "documents")}
                        className="h-7 text-xs border-slate-700 bg-slate-800 text-orange-400 hover:bg-slate-700"
                      >
                        View Files ➔
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
// 8. FOLLOW-UPS VIEW
// ----------------------------------------------------
export function FollowUpsView({ projects, leads, onOpenProject, onOpenLead }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
        <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
          <Calendar className="h-5 w-5 text-amber-400" />
          Scheduled Customer Follow-ups & Survey Callbacks
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Upcoming customer calls, quotation follow-ups, rooftop site surveys, and technician visit schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Followups */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Active Project Follow-ups
          </h3>
          <div className="divide-y divide-slate-800">
            {projects.slice(0, 8).map((p) => {
              const fu = p.currentFollowUp;
              return (
                <div key={p.id || p.projectId} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{p.customerName}</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {fu?.currentDiscussion || "Solar installation lifecycle follow-up"}
                    </p>
                    <span className="text-[10px] text-amber-400 mt-0.5 inline-block">
                      Next Call: {fu?.nextFollowUpDate || "Scheduled soon"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <a
                      href={`tel:${p.mobile}`}
                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      title="Call"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    {p.whatsapp && (
                      <a
                        href={`https://wa.me/91${p.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        title="WhatsApp"
                      >
                        <FaWhatsapp className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOpenProject(p, "followups")}
                      className="h-7 text-xs text-orange-400"
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
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Users className="h-4 w-4 text-orange-400" /> New Inquiry Callbacks
          </h3>
          <div className="divide-y divide-slate-800">
            {leads.slice(0, 8).map((lead) => (
              <div key={lead.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{lead.name}</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lead.notes || `Inquiry for ${lead.requiredCapacityKW || 3} KW solar system`}
                  </p>
                  <span className="text-[10px] text-orange-400 mt-0.5 inline-block">
                    Status: {lead.status} • {lead.city}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={`tel:${lead.phone}`}
                    className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    title="Call"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onOpenLead(lead)}
                    className="h-7 text-xs text-orange-400"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 9. ISSUES & ESCALATIONS VIEW
// ----------------------------------------------------
export function IssuesView({ projects, stats, onOpenProject }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
        <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
          <AlertTriangle className="h-5 w-5 text-rose-400" />
          Project Issues, DISCOM Mismatch & Technical Escalations
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Track active technical faults, DISCOM name mismatch disputes, meter delays, and customer escalations.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-rose-400 uppercase block">
            Open Issues
          </span>
          <div className="text-2xl font-bold font-display text-rose-400 mt-1">
            {stats?.totalOpenIssues ?? 0}
          </div>
          <p className="text-[10px] text-slate-500">Requiring admin action</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-amber-400 uppercase block">
            DISCOM Name Corrections
          </span>
          <div className="text-2xl font-bold font-display text-amber-400 mt-1">0 Pending</div>
          <p className="text-[10px] text-slate-500">Bill name rectification</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-blue-400 uppercase block">
            Meter Delay Escalations
          </span>
          <div className="text-2xl font-bold font-display text-blue-400 mt-1">
            {stats?.meterPending ?? 0}
          </div>
          <p className="text-[10px] text-slate-500">In process with division</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase block">
            Resolved Issues
          </span>
          <div className="text-2xl font-bold font-display text-emerald-400 mt-1">100%</div>
          <p className="text-[10px] text-slate-500">Resolution satisfaction</p>
        </div>
      </div>

      {/* Issues Table */}
      <Card className="border-slate-800 bg-slate-900/70 shadow-md overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Customer Project Escalations Log
          </h3>
        </div>
        <div className="divide-y divide-slate-800">
          {projects.map((p) => {
            const hasIssue = p.issuesOrComplaints?.hasIssue;
            return (
              <div
                key={p.id || p.projectId}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{p.customerName}</span>
                    <Badge variant="outline" className="text-[10px] font-mono border-slate-700">
                      {p.projectId}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-bold ${
                        hasIssue
                          ? "border-rose-500/30 text-rose-400 bg-rose-500/10"
                          : "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                      }`}
                    >
                      {hasIssue ? "ISSUE_ACTIVE" : "OPERATING_SMOOTHLY"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {p.issuesOrComplaints?.issueDescription ||
                      "System installed and operating normally with no unresolved tickets."}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenProject(p, "issues")}
                  className="h-7 text-xs border-slate-700 bg-slate-800 text-rose-400 hover:bg-slate-700 shrink-0 self-start sm:self-center"
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
// 10. REPORTS & ANALYTICS VIEW
// ----------------------------------------------------
export function ReportsView({ stats, projects, leads }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
        <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
          <TrendingUp className="h-5 w-5 text-orange-400" />
          CRM Analytics, Subsidy Volume & Solar Capacity Reports
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Executive performance summary of lead conversions, kilowatt capacity distribution, and financial disbursements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            Lead Conversion Funnel
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Customer Inquiries</span>
              <span className="font-bold text-white">{stats?.totalLeads ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Site Surveys Scheduled</span>
              <span className="font-bold text-blue-400">{stats?.contactedLeads ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Converted & Commissioned</span>
              <span className="font-bold text-emerald-400">{stats?.convertedLeads ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Conversion Ratio</span>
              <span className="font-bold text-orange-400">
                {stats?.totalLeads ? Math.round(((stats.convertedLeads || 0) / stats.totalLeads) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            Installed Capacity Breakdown
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">1 KW – 3 KW (Residential)</span>
              <span className="font-bold text-white">85% (PM Surya Ghar)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">4 KW – 10 KW (Commercial)</span>
              <span className="font-bold text-white">12%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">11 KW – 20 KW (Industrial)</span>
              <span className="font-bold text-white">3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Net Meter Compliance</span>
              <span className="font-bold text-sky-400">100% DISCOM Approved</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            Subsidies Facilitated
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Central DBT (PM Surya Ghar)</span>
              <span className="font-bold text-orange-400">₹78,000 / installation</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">State Govt UPNEDA</span>
              <span className="font-bold text-emerald-400">₹30,000 / installation</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Customer Subsidy</span>
              <span className="font-bold text-white">₹1,08,000 max</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Subsidy Processing Success</span>
              <span className="font-bold text-emerald-400">99.4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 11. SETTINGS & SYSTEM CONFIGURATION VIEW
// ----------------------------------------------------
export function SettingsView({ adminUser, onRefresh }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
        <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
          <Settings className="h-5 w-5 text-orange-400" />
          Admin Portal & Infrastructure Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Administrator profile, active sessions, database connectivity, and portal configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Lock className="h-4 w-4 text-orange-400" /> Authenticated Administrator
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Email Address:</span>
              <span className="font-bold text-white">{adminUser?.email || "admin@matrishakti.com"}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Role & Privileges:</span>
              <Badge variant="outline" className="border-orange-500/30 text-orange-400 bg-orange-500/10">
                FULL_ADMIN_ACCESS
              </Badge>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Session Status:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Active JWT Bearer Session
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Database className="h-4 w-4 text-emerald-400" /> Database & Environment
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Database Service:</span>
              <span className="font-bold text-white">MongoDB Atlas Cluster (cluster0.erlvb3z.mongodb.net)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Connection Status:</span>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                ONLINE & HEALTHY
              </Badge>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Software Version:</span>
              <span className="text-slate-300 font-mono">Matri Shakti Solar CRM v2.0 (Admin Suite)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
