import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Sun,
  Zap,
  ShieldCheck,
  Landmark,
  CheckCircle2,
  AlertTriangle,
  Clock,
  IndianRupee,
  Phone,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { IProjectData } from "./ProjectMasterFile";

interface RooftopSolarHouseViewProps {
  project: IProjectData;
}

export function RooftopSolarHouseView({ project }: RooftopSolarHouseViewProps) {
  const capacityKW = project.solarInstallation?.capacityKW || 3;
  const panelBrand = project.solarInstallation?.panelBrand || "Mono Perc Half-Cut";
  const panelCount = project.solarInstallation?.panelCount || Math.ceil((capacityKW * 1000) / 550) || 6;
  const isInstalled = project.solarInstallation?.installationStatus === "COMPLETED";

  const meterType = project.meterDetails?.existingMeterType || "Smart Meter";
  const isMeterConfigured = project.meterDetails?.configStatus === "CONFIGURED" || project.meterDetails?.meterConfigured;

  const centralSubsidy = project.subsidyTracking?.centralSubsidy;
  const stateSubsidy = project.subsidyTracking?.stateSubsidy;

  const isLoan = project.bankLoan?.loanRequired;
  const loanApproved = project.bankLoan?.loanStatus === "APPROVED" || project.bankLoan?.loanStatus === "FULLY_DISBURSED" || project.bankLoan?.loanStatus === "PARTIALLY_DISBURSED";

  const totalCost = project.payments?.totalProjectCost || 0;
  const amountPaid = project.payments?.amountPaid || 0;
  const remaining = project.payments?.amountRemaining ?? Math.max(0, (project.payments?.customerContribution || totalCost) - amountPaid);

  const followUp = project.currentFollowUp;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-5 shadow-2xl text-slate-100">
      {/* Background Solar Ray Ambient Glow */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-display text-base font-bold text-white tracking-wide">
              {project.customerName}’s Solar Rooftop Residence
            </span>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[11px] font-semibold">
              {capacityKW} KW On-Grid System
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            📍 {project.address || project.city}, {project.district || "Maharajganj"} • Consumer No: <span className="font-mono text-slate-200">{project.discomDetails?.consumerNumber || "N/A"}</span>
          </p>
        </div>

        {/* Live Project Stage */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Lifecycle Status:</span>
          <Badge className={`text-xs px-2.5 py-0.5 font-semibold ${
            project.projectStatus === "COMPLETED" || project.projectStatus === "SUBSIDY_RECEIVED"
              ? "bg-emerald-600/30 text-emerald-300 border-emerald-500/50"
              : project.projectStatus === "INSTALLATION_COMPLETE"
              ? "bg-blue-600/30 text-blue-300 border-blue-500/50"
              : "bg-amber-600/30 text-amber-300 border-amber-500/50"
          }`}>
            {project.projectStatus.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      {/* Interactive Visual House & Systems Canvas */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: The Visual House SVG Illustration */}
        <div className="lg:col-span-7 relative flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 shadow-inner">
          <div className="w-full max-w-[480px]">
            <svg viewBox="0 0 500 360" className="w-full h-auto drop-shadow-xl select-none" xmlns="http://www.w3.org/2000/svg">
              {/* Sky Background */}
              <defs>
                <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="panelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#0369a1" />
                  <stop offset="100%" stopColor="#075985" />
                </linearGradient>
                <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Sun Generating Power */}
              <circle cx="70" cy="55" r="28" fill="url(#sunGlow)" />
              <circle cx="70" cy="55" r="18" fill="#fef08a" />
              {/* Sun Rays */}
              <path d="M 85 70 L 170 115" stroke="#fef08a" strokeWidth="2" strokeDasharray="4,4" opacity="0.75" />
              <path d="M 95 60 L 220 100" stroke="#fef08a" strokeWidth="2" strokeDasharray="4,4" opacity="0.75" />
              <path d="M 100 80 L 260 120" stroke="#fef08a" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />

              {/* House Main Body */}
              <rect x="140" y="160" width="220" height="150" rx="4" fill="url(#wallGrad)" stroke="#475569" strokeWidth="3" />

              {/* Front Door */}
              <rect x="225" y="225" width="50" height="85" rx="3" fill="#92400e" stroke="#78350f" strokeWidth="2" />
              <circle cx="265" cy="270" r="3" fill="#fde047" />

              {/* Windows */}
              <rect x="160" y="195" width="45" height="45" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" opacity="0.85" />
              <line x1="182.5" y1="195" x2="182.5" y2="240" stroke="#0369a1" strokeWidth="2" />
              <line x1="160" y1="217.5" x2="205" y2="217.5" stroke="#0369a1" strokeWidth="2" />

              <rect x="295" y="195" width="45" height="45" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" opacity="0.85" />
              <line x1="317.5" y1="195" x2="317.5" y2="240" stroke="#0369a1" strokeWidth="2" />
              <line x1="295" y1="217.5" x2="340" y2="217.5" stroke="#0369a1" strokeWidth="2" />

              {/* Sloping Roof Base */}
              <polygon points="120,165 250,75 380,165" fill="url(#roofGrad)" stroke="#334155" strokeWidth="3" />

              {/* Solar Panels Mounted on Roof */}
              {/* Left Panel Array */}
              <polygon points="150,150 200,105 240,130 190,158" fill="url(#panelGrad)" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="175" y1="127.5" x2="215" y2="144" stroke="#7dd3fc" strokeWidth="1" />
              <line x1="195" y1="117" x2="168" y2="154" stroke="#7dd3fc" strokeWidth="1" />

              {/* Right Panel Array */}
              <polygon points="255,130 295,105 345,150 305,158" fill="url(#panelGrad)" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="275" y1="117.5" x2="325" y2="154" stroke="#7dd3fc" strokeWidth="1" />
              <line x1="280" y1="144" x2="320" y2="127" stroke="#7dd3fc" strokeWidth="1" />

              {/* Solar Inverter (Mounted on Right Wall) */}
              <rect x="365" y="190" width="22" height="38" rx="2" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
              <circle cx="376" cy="200" r="2.5" fill="#10b981" />
              <text x="368" y="215" fill="#6ee7b7" fontSize="6" fontFamily="sans-serif">INV</text>

              {/* Inverter DC Wire from Roof to Inverter */}
              <path d="M 330 155 L 376 155 L 376 190" stroke="#ef4444" strokeWidth="2" fill="none" />

              {/* Bi-Directional Smart Net-Meter (Mounted on Left Wall) */}
              <rect x="115" y="215" width="22" height="32" rx="2" fill="#0f172a" stroke={isMeterConfigured ? "#38bdf8" : "#f59e0b"} strokeWidth="1.5" />
              <rect x="119" y="220" width="14" height="8" fill="#0284c7" />
              <text x="120" y="226" fill="#ffffff" fontSize="5" fontFamily="monospace">888.4</text>
              <circle cx="126" cy="235" r="2" fill={isMeterConfigured ? "#10b981" : "#f59e0b"} />

              {/* AC Wiring from Inverter to Meter */}
              <path d="M 376 228 L 376 290 L 126 290 L 126 247" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" fill="none" />

              {/* Discom Grid Electric Pole */}
              <line x1="450" y1="110" x2="450" y2="330" stroke="#64748b" strokeWidth="4" />
              <line x1="435" y1="130" x2="465" y2="130" stroke="#475569" strokeWidth="3" />
              <circle cx="438" cy="130" r="3" fill="#94a3b8" />
              <circle cx="462" cy="130" r="3" fill="#94a3b8" />

              {/* Net Metering Grid Wire Connection */}
              <path d="M 126 215 L 126 150 L 438 130" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4,2" fill="none" />

              {/* Ground line */}
              <line x1="40" y1="310" x2="480" y2="310" stroke="#334155" strokeWidth="4" />

              {/* Labels on SVG */}
              <text x="200" y="55" fill="#fde047" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                ⚡ {capacityKW} KW Rooftop Solar
              </text>
              <text x="210" y="70" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">
                {panelCount} x {panelBrand.slice(0, 14)}
              </text>
            </svg>
          </div>

          {/* Quick Hardware Status Pills under house */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-950/80 px-2.5 py-1 text-[11px] font-medium text-blue-300 border border-blue-800">
              <Sun className="h-3 w-3 text-amber-400" />
              {panelCount} Solar Panels ({panelBrand})
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium border ${
              isMeterConfigured ? "bg-emerald-950/80 text-emerald-300 border-emerald-800" : "bg-amber-950/80 text-amber-300 border-amber-800"
            }`}>
              <Zap className="h-3 w-3 text-yellow-400" />
              {meterType}: {isMeterConfigured ? "Configured & Active" : "Config Pending"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-950/80 px-2.5 py-1 text-[11px] font-medium text-purple-300 border border-purple-800">
              <CheckCircle2 className="h-3 w-3 text-purple-400" />
              Grid Synchronized
            </span>
          </div>
        </div>

        {/* Right Side: Complete Status Highlights Grid */}
        <div className="lg:col-span-5 space-y-3">
          {/* 1. Both Subsidies Status Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <ShieldCheck className="h-4 w-4" />
                Government Subsidy (Central + State)
              </span>
              <Badge className="bg-amber-500/20 text-amber-300 text-[10px]">
                Total: ₹{((centralSubsidy?.expectedAmount || 78000) + (stateSubsidy?.expectedAmount || 30000)).toLocaleString("en-IN")}
              </Badge>
            </div>
            <div className="mt-2.5 space-y-2 text-xs">
              {/* Central */}
              <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div>
                  <span className="font-medium text-slate-200">1. Central Govt (PM Surya Ghar DBT)</span>
                  <p className="text-[10px] text-slate-400">
                    App No: {centralSubsidy?.appNumber || "Applied via Portal"}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    centralSubsidy?.status === "RECEIVED"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}>
                    {centralSubsidy?.status === "RECEIVED" ? `₹${centralSubsidy.receivedAmount} Received ✅` : centralSubsidy?.status || "IN_PROCESS"}
                  </span>
                </div>
              </div>

              {/* State */}
              <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div>
                  <span className="font-medium text-slate-200">2. UP State Govt (UPNEDA)</span>
                  <p className="text-[10px] text-slate-400">
                    Discom Portal Submission
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    stateSubsidy?.status === "RECEIVED"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  }`}>
                    {stateSubsidy?.status === "RECEIVED" ? `₹${stateSubsidy.receivedAmount} Received ✅` : stateSubsidy?.status || "IN_PROCESS"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Bank Loan & Financing Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-400">
                <Landmark className="h-4 w-4" />
                Bank Loan & Disbursal Status
              </span>
              <Badge className={`text-[10px] ${isLoan ? "bg-purple-500/20 text-purple-300" : "bg-slate-700 text-slate-300"}`}>
                {isLoan ? (loanApproved ? "Loan Approved" : "Loan In Progress") : "Direct Payment (No Loan)"}
              </Badge>
            </div>
            {isLoan ? (
              <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Bank & Branch Location</span>
                  <span className="font-medium text-slate-200">
                    {project.bankLoan?.bankName || "SBI"} {project.bankLoan?.branchName ? `(${project.bankLoan.branchName})` : ""}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Sanctioned / Disbursed</span>
                  <span className="font-bold text-emerald-400">
                    ₹{(project.bankLoan?.loanAmountDisbursed || 0).toLocaleString("en-IN")} / ₹{(project.bankLoan?.loanAmountApproved || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="col-span-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">Next Bank Payment Due:</span>
                  <span className="font-bold text-amber-300">
                    ₹{(project.bankLoan?.nextExpectedPayment || 0).toLocaleString("en-IN")} {project.bankLoan?.nextPaymentDate ? `(${project.bankLoan.nextPaymentDate})` : ""}
                  </span>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-400">Customer self-funded without bank loan.</p>
            )}
          </div>

          {/* 3. Electricity Bill & Name Correction Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                <FileCheck className="h-4 w-4" />
                DISCOM Bill & Verification
              </span>
              <span className="text-[11px] text-slate-300 font-mono">
                Bill #{project.discomDetails?.billNumber || "OK"}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-200">
                Aadhaar/PAN Match: <span className="text-emerald-400 font-bold">{project.billVerification?.nameCorrect === "CORRECT" ? "Verified ✅" : "Mismatch ⚠️"}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-200">
                Name Correction: <span className="text-amber-300 font-bold">{project.nameCorrection?.required ? (project.nameCorrection.submitted ? "Submitted ⏳" : "Required ❗") : "Not Needed ✅"}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-200">
                Post-Install Meter: <span className="text-emerald-400 font-bold">{project.meterDetails?.meterWorkingCorrectly ? "Working OK ✅" : "Check Needed ⚠️"}</span>
              </span>
            </div>
          </div>

          {/* 4. Payment Balance & "Kis Se Baat Chal Rahi Hai" */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                  Customer Balance Summary
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-lg font-bold text-white font-display">
                    Paid: ₹{amountPaid.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-slate-400">
                    of ₹{totalCost.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Remaining Due</span>
                <span className={`text-base font-bold ${remaining > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {remaining > 0 ? `₹${remaining.toLocaleString("en-IN")}` : "Fully Paid ✅"}
                </span>
              </div>
            </div>

            {/* "Kis Se Baat Chal Rahi Hai" spotlight */}
            {followUp && (
              <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                  <span className="text-slate-300">
                    Baat chal rahi hai: <strong className="text-amber-200">{followUp.currentFollowUpWith} ({followUp.contactPerson})</strong>
                  </span>
                </div>
                {followUp.nextFollowUpDate && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-medium">
                    Next: {followUp.nextFollowUpDate}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
