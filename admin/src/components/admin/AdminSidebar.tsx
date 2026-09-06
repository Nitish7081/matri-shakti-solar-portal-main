import React from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Briefcase,
  Building2,
  Grid,
  Package,
  Camera,
  Wrench,
  IndianRupee,
  Landmark,
  Zap,
  FileText,
  Cpu,
  Headphones,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Sun,
  Plus,
} from "lucide-react";
import { IDashboardStats } from "../../pages/DashboardPage";

export type AdminTab =
  | "dashboard"
  | "leads"
  | "projects"
  | "dealers"
  | "companies"
  | "matrix"
  | "packages"
  | "installations"
  | "technicians"
  | "payments"
  | "loans"
  | "subsidies"
  | "electricity"
  | "meters"
  | "complaints"
  | "documents"
  | "followups"
  | "issues"
  | "reports"
  | "settings";

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  section?: string;
}

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  stats: IDashboardStats | null;
  adminUser: { name?: string; email?: string } | null;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  projectCount?: number;
  companiesCount?: number;
  onNewDataEntry?: () => void;
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  stats,
  adminUser,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  projectCount = 0,
  companiesCount = 0,
  onNewDataEntry,
}: AdminSidebarProps) {
  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      section: "CORE CRM",
    },
    {
      id: "leads",
      label: "Leads / Enquiries",
      icon: Users,
      badge: stats ? stats.totalLeads : undefined,
      badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      section: "CORE CRM",
    },
    {
      id: "projects",
      label: "Customers / Projects",
      icon: ShieldCheck,
      badge: stats?.totalProjects ?? projectCount,
      badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      section: "CORE CRM",
    },
    {
      id: "dealers",
      label: "Dealers / Vendors",
      icon: Briefcase,
      badge: stats?.totalDealers ?? undefined,
      badgeColor: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      section: "CORE CRM",
    },
    {
      id: "companies",
      label: "Solar Companies",
      icon: Building2,
      badge: companiesCount > 0 ? companiesCount : undefined,
      section: "SOLAR OPERATIONS",
    },
    {
      id: "matrix",
      label: "1-20 KW Pricing Matrix",
      icon: Grid,
      section: "SOLAR OPERATIONS",
    },
    {
      id: "packages",
      label: "Solar Packages",
      icon: Package,
      section: "SOLAR OPERATIONS",
    },
    {
      id: "installations",
      label: "Installations / Gallery",
      icon: Camera,
      badge: stats?.totalInstallations ?? undefined,
      section: "SOLAR OPERATIONS",
    },
    {
      id: "technicians",
      label: "Technicians",
      icon: Wrench,
      badge: stats?.totalTechnicians ?? undefined,
      section: "SOLAR OPERATIONS",
    },
    {
      id: "payments",
      label: "Payments",
      icon: IndianRupee,
      badge: stats?.customerPaymentsPending ? `${stats.customerPaymentsPending}` : undefined,
      badgeColor: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
      section: "FINANCE & COMPLIANCE",
    },
    {
      id: "loans",
      label: "Bank Loans",
      icon: Landmark,
      badge: stats?.loanPending ? `${stats.loanPending} Pending` : undefined,
      badgeColor: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
      section: "FINANCE & COMPLIANCE",
    },
    {
      id: "subsidies",
      label: "Subsidies",
      icon: Zap,
      badge:
        stats?.centralSubsidyPending || stats?.stateSubsidyPending
          ? "Pending"
          : undefined,
      badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      section: "FINANCE & COMPLIANCE",
    },
    {
      id: "electricity",
      label: "Electricity / DISCOM",
      icon: FileText,
      section: "FINANCE & COMPLIANCE",
    },
    {
      id: "meters",
      label: "Meter Management",
      icon: Cpu,
      badge: stats?.meterPending ? `${stats.meterPending} Pending` : undefined,
      badgeColor: "bg-sky-500/20 text-sky-400 border border-sky-500/30",
      section: "FINANCE & COMPLIANCE",
    },
    {
      id: "complaints",
      label: "Complaints",
      icon: Headphones,
      badge: stats?.openComplaints ? `${stats.openComplaints} Open` : undefined,
      badgeColor: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
      section: "SUPPORT & GOVERNANCE",
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      section: "SUPPORT & GOVERNANCE",
    },
    {
      id: "followups",
      label: "Follow-ups",
      icon: Calendar,
      section: "SUPPORT & GOVERNANCE",
    },
    {
      id: "issues",
      label: "Issues",
      icon: AlertTriangle,
      badge: stats?.totalOpenIssues ? `${stats.totalOpenIssues}` : undefined,
      badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      section: "SUPPORT & GOVERNANCE",
    },
    {
      id: "reports",
      label: "Reports",
      icon: TrendingUp,
      section: "ANALYTICS & SETTINGS",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      section: "ANALYTICS & SETTINGS",
    },
  ];

  // Group items by section
  const sections: { title: string; items: NavItem[] }[] = [];
  navItems.forEach((item) => {
    const secTitle = item.section || "MENU";
    let found = sections.find((s) => s.title === secTitle);
    if (!found) {
      found = { title: secTitle, items: [] };
      sections.push(found);
    }
    found.items.push(item);
  });

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-hidden bg-white text-slate-800 select-none border-r border-slate-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20">
            <Sun className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h2 className="text-sm font-black tracking-tight text-slate-800 leading-tight">
                Matri Shakti
              </h2>
              <p className="text-[10px] font-semibold text-orange-500 tracking-wide uppercase">
                Solar Admin Portal
              </p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          title="Close Sidebar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Desktop collapse button */}
        <button
          onClick={onToggleCollapse}
          className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:block transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {/* Quick Action: Manual Data Entry */}
        {onNewDataEntry && (
          <div className="pb-1">
            {!isCollapsed ? (
              <button
                onClick={() => {
                  onNewDataEntry();
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2.5 px-3 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:from-orange-400 hover:to-amber-400 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>➕ Manual Data Bharein</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onNewDataEntry();
                  onCloseMobile();
                }}
                title="➕ Manual Solar Data Entry"
                className="w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2 text-white shadow-md shadow-orange-500/20 hover:from-orange-400 hover:to-amber-400 transition-all cursor-pointer"
              >
                <Plus className="h-5 w-5 stroke-[3]" />
              </button>
            )}
          </div>
        )}

        {sections.map((section) => (
          <div key={section.title} className="space-y-0.5">
            {!isCollapsed && (
              <p className="px-3 pt-3 pb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  title={isCollapsed ? `${item.label} ${item.badge ? `(${item.badge})` : ""}` : undefined}
                  className={`group relative flex w-full items-center rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    isCollapsed ? "justify-center" : "justify-between"
                  } ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-200"
                      : "text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-orange-500"
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="truncate tracking-tight">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsed && item.badge !== undefined && (
                    <span
                      className={`ml-2 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                        isActive
                          ? "bg-white/25 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active Indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-white/50" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Info & Logout Footer */}
      <div className="border-t border-slate-100 p-3 bg-slate-50/80">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 text-white text-xs font-black">
                MS
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="truncate text-xs font-semibold text-slate-700">
                    {adminUser?.email || "Admin"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Administrator
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 text-white text-xs font-black"
              title={adminUser?.email || "Admin"}
            >
              MS
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
        />
      )}

      {/* Mobile Drawer (sliding) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sticky / Fixed Left Sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 bg-white shadow-md transition-all duration-300 ease-in-out lg:flex lg:flex-col ${
          isCollapsed ? "w-20" : "w-68"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
