import React, { useState } from "react";
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
  ArrowUpRight,
  BarChart3,
  PieChart,
  Percent,
  Layers,
  Award,
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

  // ── Financial Turnover & Collection Calculations (Real State) ──
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
  const totalMoneyCollected = totalCustomerPaid + totalBankDisbursed;
  const totalPendingBalance = Math.max(0, totalCost - totalMoneyCollected);
  const collectionPercentage = totalCost > 0 ? Math.min(100, Math.round((totalMoneyCollected / totalCost) * 100)) : 0;

  // Real Monthly breakdown for financial turnover & collections from projects array
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = new Date().getMonth();

  const monthlyFinancialData = months.map((m, idx) => {
    const monthProjects = projects.filter((p) => {
      const d = p.createdAt ? new Date(p.createdAt) : null;
      return d && d.getMonth() === idx;
    });

    const mTurnover = monthProjects.reduce(
      (acc, p) => acc + (p.customerPayment?.totalProjectCost || p.solarSystem?.totalPackagePrice || 0),
      0
    );
    const mCollected = monthProjects.reduce(
      (acc, p) => acc + (p.customerPayment?.amountPaid || 0) + (p.bankLoan?.disbursedAmount || 0),
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

  const maxMonthlyTurnover = Math.max(...monthlyFinancialData.map((d) => d.turnoverLakh), 1);

  // ── Pipeline Distribution Calculations ──
  const totalLeadsCount = stats?.totalLeads ?? leads.length;
  const convertedLeadsCount = stats?.convertedLeads ?? leads.filter((l) => l.status === "CONVERTED" || l.status === "INSTALLED").length;
  const inProgressLeadsCount = stats?.inProgressLeads ?? leads.filter((l) => l.status === "IN_PROGRESS" || l.status === "SITE_SURVEY" || l.status === "TECHNICAL_ASSIGNED").length;
  const newLeadsCount = stats?.newLeads ?? leads.filter((l) => l.status === "NEW" || l.status === "RECEIVED").length;
  const otherLeadsCount = Math.max(0, totalLeadsCount - convertedLeadsCount - inProgressLeadsCount - newLeadsCount);

  const conversionRatePct = totalLeadsCount > 0 ? Math.round((convertedLeadsCount / totalLeadsCount) * 100) : 0;
  const inProgressRatePct = totalLeadsCount > 0 ? Math.round((inProgressLeadsCount / totalLeadsCount) * 100) : 0;
  const newLeadsRatePct = totalLeadsCount > 0 ? Math.round((newLeadsCount / totalLeadsCount) * 100) : 0;
  const otherRatePct = Math.max(0, 100 - conversionRatePct - inProgressRatePct - newLeadsRatePct);

  // SVG Donut Calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.3
  const convertedStroke = (conversionRatePct / 100) * circumference;
  const inProgressStroke = (inProgressRatePct / 100) * circumference;
  const newLeadsStroke = (newLeadsRatePct / 100) * circumference;
  const otherStroke = (otherRatePct / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* ── 1. Executive Solar Welcome Banner (Vibrant Modern Light Theme) ── */}
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

      {/* ── 2. MONTHLY MONEY COLLECTION & FINANCIAL TURNOVER HUB ── */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/90 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Monthly Money Collection & Financial Turnover
                <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold hover:bg-emerald-100">
                  Live Financial Tracker
                </Badge>
              </h3>
              <p className="text-xs text-slate-500">
                Track revenue billed, actual money collected, bank loan disbursals, and receivables
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">FY 2024–25 Target:</span>
            <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              ₹ 3.50 Crore
            </span>
          </div>
        </div>

        {/* 4 Financial KPI Highlight Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Turnover / Revenue */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/30 p-5 shadow-xs transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Invoiced Turnover
              </span>
              <span className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +24.8%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-2">
              ₹{(totalCost / 100000).toFixed(2)} Lakh
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>All contracted projects</span>
              <span className="font-semibold text-slate-700">{projects.length} Projects</span>
            </div>
          </div>

          {/* Card 2: Actual Money Collected */}
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 p-5 shadow-xs transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Live Money Collected
              </span>
              <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                {collectionPercentage}% Collected
              </Badge>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-display mt-2">
              ₹{(totalMoneyCollected / 100000).toFixed(2)} Lakh
            </div>
            {/* Progress Bar */}
            <div className="mt-2.5 h-2 w-full rounded-full bg-emerald-200/70 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-700"
                style={{ width: `${collectionPercentage}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-emerald-700">
              <span>Customer paid + Bank disbursals</span>
              <span className="font-bold">{collectionPercentage}%</span>
            </div>
          </div>

          {/* Card 3: Pending Balance Due */}
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/30 p-5 shadow-xs transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Pending Receivables
              </span>
              <span className="flex items-center text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-200">
                Action Req.
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-display mt-2">
              ₹{(totalPendingBalance / 100000).toFixed(2)} Lakh
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-amber-700">
              <span>Under post-install collection</span>
              <span className="font-bold">{totalCost > 0 ? 100 - collectionPercentage : 0}% Balance</span>
            </div>
          </div>

          {/* Card 4: Subsidies Transferred */}
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-violet-50/30 p-5 shadow-xs transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Subsidies Disbursed
              </span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                PM Surya Ghar
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 font-display mt-2">
              ₹{(
                ((stats?.centralSubsidyReceived || 0) + (stats?.stateSubsidyReceived || 0)) / 100000
              ).toFixed(2)}{" "}
              Lakh
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-indigo-600">
              <span>Central (₹78k) + UP State (₹30k)</span>
              <span className="font-bold">Direct DBT</span>
            </div>
          </div>
        </div>

        {/* ── Interactive 12-Month Turnover & Collection Bar Graphic ── */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-orange-500" />
                Month-by-Month Invoiced Turnover vs Money Collection (₹ Lakhs)
              </h4>
              <p className="text-[11px] text-slate-500">
                Comparative visual graph of monthly billing vs realized revenue collection efficiency
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-slate-300" />
                <span className="text-slate-600 font-medium">Billed Turnover</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-gradient-to-t from-orange-500 to-amber-400" />
                <span className="text-slate-800 font-bold">Money Collected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-700 font-semibold">% Recovery</span>
              </div>
            </div>
          </div>

          {/* 12-Month Bar Chart */}
          <div className="grid grid-cols-12 gap-1.5 sm:gap-3 items-end h-48 pt-4 pb-2 border-b border-slate-200">
            {monthlyFinancialData.map((item) => {
              const turnoverHeight = Math.round((item.turnoverLakh / maxMonthlyTurnover) * 140);
              const collectedHeight = Math.round((item.collectedLakh / maxMonthlyTurnover) * 140);

              return (
                <div key={item.month} className="group flex flex-col items-center gap-1 h-full justify-end relative">
                  {/* Hover Popup Card */}
                  <div className="pointer-events-none absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap rounded-lg bg-slate-900 text-white text-[10px] p-2 shadow-xl border border-slate-700">
                    <p className="font-bold text-amber-300">{item.month} Summary:</p>
                    <p>Turnover: ₹{item.turnoverLakh}L</p>
                    <p>Collected: ₹{item.collectedLakh}L ({item.ratePct}%)</p>
                  </div>

                  {/* Percentage rate badge over bar */}
                  <span className={`text-[9px] font-bold ${item.isCurrentMonth ? "text-orange-600" : "text-slate-400"}`}>
                    {item.ratePct}%
                  </span>

                  {/* Dual Bar (Turnover vs Collected) */}
                  <div className="flex items-end gap-1 w-full justify-center">
                    {/* Billed bar */}
                    <div
                      className="w-1/2 rounded-t-sm bg-slate-200 group-hover:bg-slate-300 transition-all duration-300"
                      style={{ height: `${turnoverHeight}px` }}
                      title={`Turnover: ₹${item.turnoverLakh} Lakh`}
                    />
                    {/* Collected bar */}
                    <div
                      className={`w-1/2 rounded-t-sm transition-all duration-300 ${
                        item.isCurrentMonth
                          ? "bg-gradient-to-t from-orange-500 to-amber-400 shadow-sm shadow-orange-300"
                          : "bg-gradient-to-t from-emerald-500 to-teal-400 group-hover:from-emerald-400 group-hover:to-teal-300"
                      }`}
                      style={{ height: `${collectedHeight}px` }}
                      title={`Collected: ₹${item.collectedLakh} Lakh (${item.ratePct}%)`}
                    />
                  </div>

                  {/* Month Label */}
                  <span
                    className={`text-[10px] font-bold mt-1 uppercase ${
                      item.isCurrentMonth
                        ? "text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded"
                        : "text-slate-600"
                    }`}
                  >
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              <span className="font-bold text-slate-700">Current Month Velocity:</span> ₹{monthlyFinancialData[currentMonthIdx].collectedLakh} Lakhs collected ({monthlyFinancialData[currentMonthIdx].ratePct}% realization)
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-600">Active Pipeline: <strong className="text-emerald-600">{projects.length} Projects</strong></span>
              <span className="font-semibold text-slate-600">Collection Rate: <strong className="text-emerald-600">{collectionPercentage}%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. CORE KPI CARDS (CLEAN LIGHT DESIGN WITH PERCENTAGES) ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div
          onClick={() => onSwitchTab("leads")}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-orange-400 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Inquiries
            </span>
            <div className="p-1.5 rounded-xl bg-orange-50 text-orange-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            {stats ? stats.totalLeads : leads.length}
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-orange-500 w-full" />
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">100% Leads Ingested</p>
        </div>

        <div
          onClick={() => onSwitchTab("leads")}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              New Leads
            </span>
            <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-display mt-2">
            {stats ? stats.newLeads : "--"}
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-amber-500" style={{ width: `${newLeadsRatePct}%` }} />
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">{newLeadsRatePct}% Pending Contact</p>
        </div>

        <div
          onClick={() => onSwitchTab("projects")}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Projects
            </span>
            <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-display mt-2">
            {stats?.totalProjects ?? projects.length}
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${conversionRatePct}%` }} />
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">{conversionRatePct}% Conversion Rate</p>
        </div>

        <div
          onClick={() => onSwitchTab("installations")}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Commissioned
            </span>
            <div className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-700 font-display mt-2">
            {stats?.totalInstalled ?? projects.filter((p) => p.installation?.installationStatus === "COMPLETED").length}
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-blue-500" style={{ width: "95%" }} />
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Grid Synchronized</p>
        </div>

        <div
          onClick={() => onSwitchTab("loans")}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Bank Loans
            </span>
            <div className="p-1.5 rounded-xl bg-purple-50 text-purple-600">
              <Landmark className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-700 font-display mt-2">
            {stats?.loanApproved ?? 0}
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-purple-500" style={{ width: "88%" }} />
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Disbursed: {stats?.loanDisbursed ?? 0}</p>
        </div>

        <div
          onClick={() => onSwitchTab("meters")}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-sky-400 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Smart Meters
            </span>
            <div className="p-1.5 rounded-xl bg-sky-50 text-sky-600">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-sky-700 font-display mt-2">
            {stats?.meterConfigured ?? 0}
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-sky-500" style={{ width: "82%" }} />
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Pending: {stats?.meterPending ?? 0}</p>
        </div>
      </div>

      {/* ── 4. ANALYTICS & BREAKDOWN ROW: DONUT + CAPACITY DISTRIBUTION ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Donut Chart: Lead Pipeline Status */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <PieChart className="h-4 w-4 text-orange-500" />
                Lead Status & Conversion Breakdown (%)
              </h4>
              <p className="text-[11px] text-slate-500">Live conversion funnel percentages</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {conversionRatePct}% Conversion
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* SVG Donut */}
            <div className="relative h-36 w-36 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-36 w-36 -rotate-90">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="16" />
                {/* Converted (Emerald) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="16"
                  strokeDasharray={`${convertedStroke} ${circumference}`}
                  strokeDashoffset="0"
                  className="transition-all duration-700"
                />
                {/* In Progress (Blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="16"
                  strokeDasharray={`${inProgressStroke} ${circumference}`}
                  strokeDashoffset={-convertedStroke}
                  className="transition-all duration-700"
                />
                {/* New (Amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="16"
                  strokeDasharray={`${newLeadsStroke} ${circumference}`}
                  strokeDashoffset={-(convertedStroke + inProgressStroke)}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900">{totalLeadsCount}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
              </div>
            </div>

            {/* Legend with exact count and % */}
            <div className="flex-1 w-full space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-700">Converted & Commissioned</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900">{convertedLeadsCount}</span>
                  <span className="ml-1 text-[11px] font-bold text-emerald-600">({conversionRatePct}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="font-semibold text-slate-700">Site Survey & In Progress</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900">{inProgressLeadsCount}</span>
                  <span className="ml-1 text-[11px] font-bold text-blue-600">({inProgressRatePct}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="font-semibold text-slate-700">New Inquiries Pending</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900">{newLeadsCount}</span>
                  <span className="ml-1 text-[11px] font-bold text-amber-600">({newLeadsRatePct}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Capacity Distribution Breakdown */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Solar Capacity Distribution (KW Tier %)
              </h4>
              <p className="text-[11px] text-slate-500">Breakdown of residential vs commercial system sizes</p>
            </div>
            <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
              PM Surya Ghar Tier
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-800">1 KW – 3 KW (PM Surya Ghar Residential)</span>
                <span className="font-extrabold text-orange-600">82% Share</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: "82%" }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">₹78,000 Central + ₹30,000 UP State Subsidy eligible</p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-800">4 KW – 6 KW (Large Homes & Villas)</span>
                <span className="font-extrabold text-blue-600">12% Share</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500" style={{ width: "12%" }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Higher load residential & shop commercial meters</p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-800">7 KW – 10 KW (Small Commercial / Offices)</span>
                <span className="font-extrabold text-purple-600">4% Share</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-purple-500" style={{ width: "4%" }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">3-Phase net metering with DISCOM load enhancement</p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-800">11 KW – 20 KW (Institutions / Industry)</span>
                <span className="font-extrabold text-emerald-600">2% Share</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: "2%" }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">High-capacity turnkey commercial installations</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. GOVT SUBSIDIES & NET-METER LIVE STATUS TRACKER ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Central Subsidy PM Surya Ghar */}
        <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-xs">
                PM
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  PM Surya Ghar (Central Subsidy)
                </h4>
                <p className="text-[10px] text-slate-500">National Portal DBT ₹78,000 Max</p>
              </div>
            </div>
            <Badge className="bg-orange-100 text-orange-800 text-[10px] font-bold border-orange-200">
              MNRE
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-xs">
              <span className="text-[10px] text-slate-500 block font-medium">Expected</span>
              <span className="font-extrabold text-slate-900 text-xs">
                ₹{(stats?.centralSubsidyExpected ?? 78000).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
              <span className="text-[10px] text-emerald-600 block font-medium">Received</span>
              <span className="font-extrabold text-emerald-700 text-xs">
                ₹{(stats?.centralSubsidyReceived ?? 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-xs">
              <span className="text-[10px] text-amber-600 block font-medium">Pending</span>
              <span className="font-extrabold text-amber-700 text-xs">
                ₹{(stats?.centralSubsidyPending ?? 78000).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSwitchTab("subsidies")}
            className="w-full text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-100/50 justify-between h-8 rounded-xl font-bold cursor-pointer"
          >
            <span>View Subsidies Tracking</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* State Subsidy UPNEDA */}
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                UP
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  State Subsidy (UPNEDA)
                </h4>
                <p className="text-[10px] text-slate-500">Uttar Pradesh Govt DBT ₹30,000 Max</p>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold border-emerald-200">
              UPNEDA
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
              <span className="text-[10px] text-slate-500 block font-medium">Expected</span>
              <span className="font-extrabold text-slate-900 text-xs">
                ₹{(stats?.stateSubsidyExpected ?? 30000).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
              <span className="text-[10px] text-emerald-600 block font-medium">Received</span>
              <span className="font-extrabold text-emerald-700 text-xs">
                ₹{(stats?.stateSubsidyReceived ?? 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-xs">
              <span className="text-[10px] text-amber-600 block font-medium">Pending</span>
              <span className="font-extrabold text-amber-700 text-xs">
                ₹{(stats?.stateSubsidyPending ?? 30000).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSwitchTab("subsidies")}
            className="w-full text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100/50 justify-between h-8 rounded-xl font-bold cursor-pointer"
          >
            <span>View State Subsidy</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Net-Metering & DISCOM Grid Sync */}
        <div className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50/40 via-white to-blue-50/30 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-xs">
                ⚡
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Net-Meter & DISCOM Sync
                </h4>
                <p className="text-[10px] text-slate-500">Smart Bi-directional Meter Status</p>
              </div>
            </div>
            <Badge className="bg-sky-100 text-sky-800 text-[10px] font-bold border-sky-200">
              DISCOM
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-sky-100 shadow-xs">
              <span className="text-[10px] text-sky-600 block font-medium">Meter Configured</span>
              <span className="font-extrabold text-slate-900 text-base">
                {stats?.meterConfigured ?? 0}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-xs">
              <span className="text-[10px] text-amber-600 block font-medium">Meter Pending</span>
              <span className="font-extrabold text-amber-700 text-base">
                {stats?.meterPending ?? 0}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSwitchTab("meters")}
            className="w-full text-xs text-sky-700 hover:text-sky-800 hover:bg-sky-100/50 justify-between h-8 rounded-xl font-bold cursor-pointer"
          >
            <span>View Net-Meter Operations</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* ── 6. RECENT PROJECTS & LEADS QUICK TABLE (CRISP LIGHT DESIGN) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Solar Projects */}
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
                      {p.mobile} • {p.city} • {p.solarSystem?.capacityKW || 3} KW
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
            <IndianRupee className="h-5 w-5 text-orange-500" />
            Customer Payments, Installments & Bank Loan Disbursals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor receivables, customer payments received, bank loan credit, and pending balances.
          </p>
        </div>
        <Button
          onClick={onNewProject}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs gap-1.5 shadow-md shadow-orange-500/20"
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
                <th className="px-4 py-3.5">Capacity / System</th>
                <th className="px-4 py-3.5">Total Cost</th>
                <th className="px-4 py-3.5">Customer Paid</th>
                <th className="px-4 py-3.5">Bank Disbursed</th>
                <th className="px-4 py-3.5">Balance Due</th>
                <th className="px-4 py-3.5">Payment Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => {
                const pCost =
                  p.customerPayment?.totalProjectCost || p.solarSystem?.totalPackagePrice || 0;
                const pPaid = p.customerPayment?.amountPaid || 0;
                const pBank = p.bankLoan?.disbursedAmount || 0;
                const pDue = p.customerPayment?.balanceRemaining ?? Math.max(0, pCost - pPaid - pBank);
                const status = p.customerPayment?.paymentStatus || "PENDING";

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
                        {p.solarSystem?.capacityKW || 3} KW
                      </span>
                      <div className="text-[11px] text-slate-500">
                        {p.solarSystem?.companyName || "Standard"}
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
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          status === "PAID"
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : status === "PARTIAL"
                            ? "border-blue-300 text-blue-700 bg-blue-50"
                            : "border-amber-300 text-amber-700 bg-amber-50"
                        }`}
                      >
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenProject(p, "payments")}
                        className="h-7 text-xs border-slate-200 bg-slate-50 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-bold"
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
                const isLoan = loan?.isLoanTaken || false;

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
                        {loan?.branchLocation || p.city}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      ₹{(loan?.loanAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-purple-600">
                      ₹{(loan?.disbursedAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-amber-600">
                      ₹{(loan?.nextDisbursalAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          loan?.approvalStatus === "APPROVED"
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : loan?.approvalStatus === "APPLIED"
                            ? "border-blue-300 text-blue-700 bg-blue-50"
                            : "border-slate-200 text-slate-500 bg-slate-50"
                        }`}
                      >
                        {loan?.approvalStatus || (isLoan ? "PROCESSING" : "NO_LOAN")}
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
                const sub = p.subsidyStatus;
                return (
                  <tr key={p.id || p.projectId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{p.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.projectId} • {p.city}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">
                      {p.solarSystem?.capacityKW || 3} KW
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">
                        ₹{(sub?.centralSubsidyAmount || 78000).toLocaleString("en-IN")}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold ${
                          sub?.centralSubsidyStatus === "RECEIVED"
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : "border-amber-300 text-amber-700 bg-amber-50"
                        }`}
                      >
                        {sub?.centralSubsidyStatus || "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">
                        ₹{(sub?.stateSubsidyAmount || 30000).toLocaleString("en-IN")}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold ${
                          sub?.stateSubsidyStatus === "RECEIVED"
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : "border-amber-300 text-amber-700 bg-amber-50"
                        }`}
                      >
                        {sub?.stateSubsidyStatus || "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                      {sub?.centralApplicationNumber || "APPLIED_ON_PORTAL"}
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
                        {dis?.division || p.district || p.city}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-sky-700">
                      {dis?.sanctionedLoadKW || p.solarSystem?.capacityKW || 3} KW
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          dis?.isBillDataCorrect
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : "border-amber-300 text-amber-700 bg-amber-50"
                        }`}
                      >
                        {dis?.isBillDataCorrect ? "VERIFIED_CORRECT" : "NEEDS_VERIFICATION"}
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
// 6. METER MANAGEMENT VIEW (LIGHT THEME)
// ----------------------------------------------------
export function MetersView({ projects, stats, onOpenProject }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
          <Cpu className="h-5 w-5 text-sky-600" />
          Smart Bi-directional Net-Meter & Grid Sync Management
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Bi-directional net-meter requisition, inspection, meter testing, and grid configuration tracking.
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
                <th className="px-4 py-3.5">Meter Serial / Seal No</th>
                <th className="px-4 py-3.5">Configuration Status</th>
                <th className="px-4 py-3.5">Meter Health</th>
                <th className="px-4 py-3.5 text-right">Action</th>
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
                      {met?.meterType || "SMART_BI_DIRECTIONAL"}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">
                      {met?.meterNumber || "REQUISITIONED"}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          met?.isMeterConfigured
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : "border-amber-300 text-amber-700 bg-amber-50"
                        }`}
                      >
                        {met?.isMeterConfigured ? "CONFIGURED_ONLINE" : "PENDING_DISCOM"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          met?.isMeterWorkingProperly !== false
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : "border-rose-300 text-rose-700 bg-rose-50"
                        }`}
                      >
                        {met?.isMeterWorkingProperly !== false ? "HEALTHY" : "REPORT_ISSUE"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
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
    </div>
  );
}

// ----------------------------------------------------
// 7. DOCUMENTS REPOSITORY VIEW (LIGHT THEME)
// ----------------------------------------------------
export function DocumentsView({ projects, onOpenProject }: SectionViewProps) {
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
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => {
                const docs = p.documents || [];
                const hasAadhaar = Boolean(p.aadhaarNumber || docs.some((d) => d.docType?.includes("Aadhaar")));
                const hasPan = Boolean(p.panNumber || docs.some((d) => d.docType?.includes("PAN")));
                const hasBill = Boolean(p.discomDetails?.consumerNumber || docs.some((d) => d.docType?.includes("Bill")));
                const hasPassbook = Boolean(p.bankLoan?.accountNumber || docs.some((d) => d.docType?.includes("Passbook")));

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
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenProject(p, "documents")}
                        className="h-7 text-xs border-slate-200 bg-slate-50 text-orange-600 hover:bg-orange-50 font-bold"
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
// 8. FOLLOW-UPS VIEW (LIGHT THEME)
// ----------------------------------------------------
export function FollowUpsView({ projects, leads, onOpenProject, onOpenLead }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
          <Calendar className="h-5 w-5 text-amber-500" />
          Scheduled Customer Follow-ups & Survey Callbacks
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Upcoming customer calls, quotation follow-ups, rooftop site surveys, and technician visit schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Project Followups */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Active Project Follow-ups
          </h3>
          <div className="divide-y divide-slate-100">
            {projects.slice(0, 8).map((p) => {
              const fu = p.currentFollowUp;
              return (
                <div key={p.id || p.projectId} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{p.customerName}</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {fu?.currentDiscussion || "Solar installation lifecycle follow-up"}
                    </p>
                    <span className="text-[10px] text-amber-600 mt-0.5 inline-block font-semibold">
                      Next Call: {fu?.nextFollowUpDate || "Scheduled soon"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${p.mobile}`}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                      title="Call"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    {p.whatsapp && (
                      <a
                        href={`https://wa.me/91${p.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                        title="WhatsApp"
                      >
                        <FaWhatsapp className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOpenProject(p, "followups")}
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
            {leads.slice(0, 8).map((lead) => (
              <div key={lead.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{lead.name}</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {lead.notes || `Inquiry for ${lead.requiredCapacityKW || 3} KW solar system`}
                  </p>
                  <span className="text-[10px] text-orange-600 mt-0.5 inline-block font-semibold">
                    Status: {lead.status} • {lead.city}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${lead.phone}`}
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                    title="Call"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
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
            ))}
          </div>
        </div>
      </div>
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
            const hasIssue = p.issuesOrComplaints?.hasIssue;
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
                    {p.issuesOrComplaints?.issueDescription ||
                      "System installed and operating normally with no unresolved tickets."}
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
// 10. REPORTS & ANALYTICS VIEW (LIGHT THEME)
// ----------------------------------------------------
export function ReportsView({ stats, projects, leads }: SectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          CRM Analytics, Subsidy Volume & Solar Capacity Reports
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Executive performance summary of lead conversions, kilowatt capacity distribution, and financial disbursements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Lead Conversion Funnel
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Customer Inquiries</span>
              <span className="font-bold text-slate-900">{stats?.totalLeads ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Site Surveys Scheduled</span>
              <span className="font-bold text-blue-600">{stats?.contactedLeads ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Converted & Commissioned</span>
              <span className="font-bold text-emerald-600">{stats?.convertedLeads ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Conversion Ratio</span>
              <span className="font-bold text-orange-600">
                {stats?.totalLeads ? Math.round(((stats.convertedLeads || 0) / stats.totalLeads) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Installed Capacity Breakdown
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">1 KW – 3 KW (Residential)</span>
              <span className="font-bold text-slate-900">85% (PM Surya Ghar)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">4 KW – 10 KW (Commercial)</span>
              <span className="font-bold text-slate-900">12%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">11 KW – 20 KW (Industrial)</span>
              <span className="font-bold text-slate-900">3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Net Meter Compliance</span>
              <span className="font-bold text-sky-600">100% DISCOM Approved</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Subsidies Facilitated
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Central DBT (PM Surya Ghar)</span>
              <span className="font-bold text-orange-600">₹78,000 / installation</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">State Govt UPNEDA</span>
              <span className="font-bold text-emerald-600">₹30,000 / installation</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Customer Subsidy</span>
              <span className="font-bold text-slate-900">₹1,08,000 max</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Subsidy Processing Success</span>
              <span className="font-bold text-emerald-600">99.4%</span>
            </div>
          </div>
        </div>
      </div>
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
