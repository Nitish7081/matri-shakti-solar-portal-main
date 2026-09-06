import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Building2,
  Sun,
  IndianRupee,
  Landmark,
  Zap,
  ShieldCheck,
  Phone,
  FileText,
  User,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Edit,
  Layers,
} from "lucide-react";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (newProject: any) => void;
  projectToEdit?: any | null;
}

export function NewProjectDialog({
  open,
  onOpenChange,
  onProjectCreated,
  projectToEdit,
}: NewProjectDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"tabs" | "single">("tabs");
  const [activeSection, setActiveSection] = useState<
    "customer" | "solar" | "payments" | "loan" | "discom" | "subsidy" | "followup"
  >("customer");

  // 1. Customer & Inquiry State
  const [customerName, setCustomerName] = useState("");
  const [fatherHusbandName, setFatherHusbandName] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Paniyara");
  const [district, setDistrict] = useState("Maharajganj");
  const [pincode, setPincode] = useState("273303");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [inquirySource, setInquirySource] = useState("Direct Walk-in / Office");
  const [inquiryDate, setInquiryDate] = useState(new Date().toISOString().split("T")[0]);
  const [projectFinalStatus, setProjectFinalStatus] = useState("INSTALLATION_COMPLETE");

  // 2. Solar System State
  const [capacityKW, setCapacityKW] = useState(3);
  const [panelBrand, setPanelBrand] = useState("Tata Power Solar");
  const [panelWattage, setPanelWattage] = useState(550);
  const [panelCount, setPanelCount] = useState(6);
  const [inverterBrand, setInverterBrand] = useState("On-Grid Solar Inverter");
  const [inverterSerialNumber, setInverterSerialNumber] = useState("");
  const [installationDate, setInstallationDate] = useState(new Date().toISOString().split("T")[0]);
  const [installationStatus, setInstallationStatus] = useState<"COMPLETED" | "IN_PROGRESS" | "SCHEDULED">("COMPLETED");
  const [isSiteAllOk, setIsSiteAllOk] = useState(true);
  const [siteIssueReport, setSiteIssueReport] = useState("");

  // 3. Payments State
  const [totalCost, setTotalCost] = useState(180000);
  const [customerContribution, setCustomerContribution] = useState(180000);
  const [amountPaid, setAmountPaid] = useState(50000);
  const [paymentMode, setPaymentMode] = useState("UPI / Bank Transfer");

  // 4. Bank Loan State
  const [loanRequired, setLoanRequired] = useState(false);
  const [bankName, setBankName] = useState("State Bank of India (SBI)");
  const [branchName, setBranchName] = useState("Maharajganj Main Branch");
  const [loanAppNumber, setLoanAppNumber] = useState("");
  const [loanAmountApproved, setLoanAmountApproved] = useState(120000);
  const [loanAmountDisbursed, setLoanAmountDisbursed] = useState(80000);
  const [nextExpectedPayment, setNextExpectedPayment] = useState(40000);
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [loanStatus, setLoanStatus] = useState("APPROVED");

  // 5. Electricity / DISCOM State
  const [consumerNumber, setConsumerNumber] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [nameMatchesBill, setNameMatchesBill] = useState(true);
  const [nameCorrectionRequired, setNameCorrectionRequired] = useState(false);
  const [nameCorrectionSubmitted, setNameCorrectionSubmitted] = useState(false);
  const [nameCorrectionDate, setNameCorrectionDate] = useState("");
  const [meterType, setMeterType] = useState("Smart Meter");
  const [meterConfigured, setMeterConfigured] = useState(true);
  const [meterConfigDate, setMeterConfigDate] = useState(new Date().toISOString().split("T")[0]);
  const [meterWorkingOk, setMeterWorkingOk] = useState(true);
  const [meterIssue, setMeterIssue] = useState("");

  // 6. Both Subsidies State (Central + State)
  const [centralSubsidyApplied, setCentralSubsidyApplied] = useState(true);
  const [centralAppNumber, setCentralAppNumber] = useState("");
  const [centralExpectedAmount, setCentralExpectedAmount] = useState(78000);
  const [centralStatus, setCentralStatus] = useState("UNDER_PROCESS");
  const [centralReceivedAmount, setCentralReceivedAmount] = useState(0);
  const [centralReceivedDate, setCentralReceivedDate] = useState("");

  const [stateSubsidyApplied, setStateSubsidyApplied] = useState(true);
  const [stateAppNumber, setStateAppNumber] = useState("");
  const [stateExpectedAmount, setStateExpectedAmount] = useState(30000);
  const [stateStatus, setStateStatus] = useState("UNDER_PROCESS");
  const [stateReceivedAmount, setStateReceivedAmount] = useState(0);
  const [stateReceivedDate, setStateReceivedDate] = useState("");

  // 7. Follow-up State
  const [followUpParty, setFollowUpParty] = useState("CUSTOMER");
  const [contactPerson, setContactPerson] = useState("");
  const [followUpPhone, setFollowUpPhone] = useState("");
  const [discussionNotes, setDiscussionNotes] = useState("Past installation data recorded in Admin CRM");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");

  useEffect(() => {
    if (projectToEdit) {
      setCustomerName(projectToEdit.customerName || "");
      setFatherHusbandName(projectToEdit.fatherHusbandName || "");
      setMobile(projectToEdit.mobile || "");
      setWhatsapp(projectToEdit.whatsapp || projectToEdit.mobile || "");
      setAddress(projectToEdit.address || "");
      setCity(projectToEdit.city || "Paniyara");
      setDistrict(projectToEdit.district || "Maharajganj");
      setPincode(projectToEdit.pincode || "273303");
      setAadhaarNumber(projectToEdit.aadhaarNumber || "");
      setPanNumber(projectToEdit.panNumber || "");
      setInquirySource(projectToEdit.source || "Direct Walk-in / Office");
      setInquiryDate(projectToEdit.enquiryDate ? projectToEdit.enquiryDate.split("T")[0] : new Date().toISOString().split("T")[0]);
      setProjectFinalStatus(projectToEdit.projectStatus || "INSTALLATION_COMPLETE");

      setCapacityKW(projectToEdit.solarInstallation?.capacityKW || 3);
      setPanelBrand(projectToEdit.solarInstallation?.panelBrand || "Tata Power Solar");
      setPanelWattage(projectToEdit.solarInstallation?.panelWattage || 550);
      setPanelCount(projectToEdit.solarInstallation?.panelCount || 6);
      setInverterBrand(projectToEdit.solarInstallation?.inverterBrand || "Sungrow 3.3kW On-Grid");
      setInverterSerialNumber(projectToEdit.solarInstallation?.inverterSerialNumber || "");
      setInstallationDate(projectToEdit.solarInstallation?.installationDate ? projectToEdit.solarInstallation.installationDate.split("T")[0] : new Date().toISOString().split("T")[0]);
      setInstallationStatus(projectToEdit.solarInstallation?.installationStatus || "COMPLETED");
      setIsSiteAllOk(!projectToEdit.issues?.length || projectToEdit.issues.every((i: any) => i.status === "RESOLVED"));
      setSiteIssueReport(projectToEdit.issues?.[0]?.description || "");

      setTotalCost(projectToEdit.payments?.totalProjectCost || 185000);
      setCustomerContribution(projectToEdit.payments?.customerContribution || 185000);
      setAmountPaid(projectToEdit.payments?.amountPaid || 0);
      setPaymentMode(projectToEdit.payments?.paymentMode || "UPI");

      setLoanRequired(Boolean(projectToEdit.bankLoan?.loanRequired));
      setBankName(projectToEdit.bankLoan?.bankName || "State Bank of India (SBI)");
      setBranchName(projectToEdit.bankLoan?.branchName || projectToEdit.bankLoan?.bankLocation || "Maharajganj Main Branch");
      setLoanAppNumber(projectToEdit.bankLoan?.loanAppNumber || "");
      setLoanAmountApproved(projectToEdit.bankLoan?.loanAmountApproved || 65000);
      setLoanAmountDisbursed(projectToEdit.bankLoan?.loanAmountDisbursed || 40000);
      setNextExpectedPayment(projectToEdit.bankLoan?.nextExpectedPayment || projectToEdit.bankLoan?.nextDisbursementAmount || 25000);
      setNextPaymentDate(projectToEdit.bankLoan?.nextPaymentDate || projectToEdit.bankLoan?.nextDisbursementDate || "");
      setLoanStatus(projectToEdit.bankLoan?.loanStatus || "APPROVED");

      setConsumerNumber(projectToEdit.discomDetails?.consumerNumber || "");
      setBillNumber(projectToEdit.discomDetails?.billNumber || "");
      setNameMatchesBill(projectToEdit.billVerification?.nameCorrect !== "INCORRECT");
      setNameCorrectionRequired(Boolean(projectToEdit.nameCorrection?.required));
      setNameCorrectionSubmitted(Boolean(projectToEdit.nameCorrection?.submitted));
      setNameCorrectionDate(projectToEdit.nameCorrection?.submissionDate ? projectToEdit.nameCorrection.submissionDate.split("T")[0] : "");
      setMeterType(projectToEdit.meterDetails?.existingMeterType || "Smart Meter");
      setMeterConfigured(Boolean(projectToEdit.meterDetails?.meterConfigured || projectToEdit.meterDetails?.configStatus === "CONFIGURED"));
      setMeterConfigDate(projectToEdit.meterDetails?.configDate ? projectToEdit.meterDetails.configDate.split("T")[0] : new Date().toISOString().split("T")[0]);
      setMeterWorkingOk(projectToEdit.meterDetails?.meterWorkingCorrectly ?? true);
      setMeterIssue(projectToEdit.meterDetails?.issueDescription || "");

      setCentralSubsidyApplied(Boolean(projectToEdit.subsidyTracking?.centralSubsidy?.applied ?? true));
      setCentralAppNumber(projectToEdit.subsidyTracking?.centralSubsidy?.appNumber || "");
      setCentralExpectedAmount(projectToEdit.subsidyTracking?.centralSubsidy?.expectedAmount || 78000);
      setCentralStatus(projectToEdit.subsidyTracking?.centralSubsidy?.status || "APPROVED");
      setCentralReceivedAmount(projectToEdit.subsidyTracking?.centralSubsidy?.receivedAmount || 0);
      setCentralReceivedDate(projectToEdit.subsidyTracking?.centralSubsidy?.receivedDate ? projectToEdit.subsidyTracking.centralSubsidy.receivedDate.split("T")[0] : "");

      setStateSubsidyApplied(Boolean(projectToEdit.subsidyTracking?.stateSubsidy?.applied ?? true));
      setStateAppNumber(projectToEdit.subsidyTracking?.stateSubsidy?.appNumber || "");
      setStateExpectedAmount(projectToEdit.subsidyTracking?.stateSubsidy?.expectedAmount || 30000);
      setStateStatus(projectToEdit.subsidyTracking?.stateSubsidy?.status || "APPLIED");
      setStateReceivedAmount(projectToEdit.subsidyTracking?.stateSubsidy?.receivedAmount || 0);
      setStateReceivedDate(projectToEdit.subsidyTracking?.stateSubsidy?.receivedDate ? projectToEdit.subsidyTracking.stateSubsidy.receivedDate.split("T")[0] : "");

      setFollowUpParty(projectToEdit.currentFollowUp?.currentFollowUpWith || "CUSTOMER");
      setContactPerson(projectToEdit.currentFollowUp?.contactPerson || "");
      setFollowUpPhone(projectToEdit.currentFollowUp?.phone || "");
      setDiscussionNotes(projectToEdit.currentFollowUp?.currentDiscussion || "");
      setNextFollowUpDate(projectToEdit.currentFollowUp?.nextFollowUpDate ? projectToEdit.currentFollowUp.nextFollowUpDate.split("T")[0] : "");
    }
  }, [projectToEdit, open]);

  const handleFillDemoData = () => {
    setCustomerName("Ramesh Kumar Verma");
    setFatherHusbandName("Shri Ramakant Verma");
    setMobile("9876543210");
    setWhatsapp("9876543210");
    setAddress("Station Road, Near Tehsil Gate");
    setCity("Paniyara");
    setDistrict("Maharajganj");
    setPincode("273303");
    setAadhaarNumber("1234 5678 9012");
    setPanNumber("ABCDE1234F");
    setInquirySource("Direct Walk-in / Office");
    setInquiryDate("2026-08-10");
    setProjectFinalStatus("INSTALLATION_COMPLETE");

    setCapacityKW(3);
    setPanelBrand("Tata Power Solar Mono Perc Half-Cut");
    setPanelWattage(550);
    setPanelCount(6);
    setInverterBrand("Sungrow 3.3kW On-Grid");
    setInstallationDate(new Date().toISOString().split("T")[0]);
    setInstallationStatus("COMPLETED");
    setIsSiteAllOk(true);
    setSiteIssueReport("");

    setTotalCost(185000);
    setCustomerContribution(185000);
    setAmountPaid(120000);
    setPaymentMode("UPI");

    setLoanRequired(true);
    setBankName("State Bank of India (SBI)");
    setBranchName("Paniyara / Maharajganj Main Branch");
    setLoanAmountApproved(65000);
    setLoanAmountDisbursed(40000);
    setNextExpectedPayment(25000);
    setNextPaymentDate("2026-09-25");
    setLoanStatus("APPROVED");

    setConsumerNumber("721900823412");
    setBillNumber("721900823412");
    setNameMatchesBill(true);
    setNameCorrectionRequired(false);
    setNameCorrectionSubmitted(false);
    setNameCorrectionDate("");
    setMeterType("Smart Meter");
    setMeterConfigured(true);
    setMeterConfigDate(new Date().toISOString().split("T")[0]);
    setMeterWorkingOk(true);

    setCentralSubsidyApplied(true);
    setCentralExpectedAmount(78000);
    setCentralReceivedAmount(78000);
    setCentralStatus("APPROVED");

    setStateSubsidyApplied(true);
    setStateExpectedAmount(30000);
    setStateReceivedAmount(0);
    setStateStatus("APPLIED");

    setFollowUpParty("CUSTOMER");
    setContactPerson("Ramesh Kumar Verma");
    setFollowUpPhone("9876543210");
    setDiscussionNotes("Panel installation complete. Smart meter net-metering active. Central subsidy ₹78,000 received. SBI loan ₹40k disbursed.");
    setNextFollowUpDate("2026-09-15");

    toast.success("Demo 3KW Rooftop Solar data loaded! Review and click Save.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !mobile.trim()) {
      toast.error("Customer Name aur Mobile Number zaroori hai!");
      setActiveSection("customer");
      return;
    }

    setSubmitting(true);
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const token = localStorage.getItem("admin_token") || "";

      const payload = {
        customerName: customerName.trim(),
        fatherHusbandName: fatherHusbandName.trim(),
        mobile: mobile.trim(),
        whatsapp: whatsapp.trim() || mobile.trim(),
        address: address.trim(),
        city: city.trim(),
        district: district.trim(),
        pincode: pincode.trim(),
        aadhaarNumber: aadhaarNumber.trim(),
        panNumber: panNumber.trim(),
        source: inquirySource,
        enquiryDate: inquiryDate,
        projectStatus: projectFinalStatus || (installationStatus === "COMPLETED" ? "INSTALLATION_COMPLETE" : "IN_PROGRESS"),

        solarInstallation: {
          companyName: panelBrand,
          panelBrand,
          panelWattage: Number(panelWattage) || 550,
          panelCount: Number(panelCount) || Math.ceil((capacityKW * 1000) / 550),
          capacityKW: Number(capacityKW) || 3,
          inverterBrand,
          inverterSerialNumber: inverterSerialNumber.trim(),
          installationStatus,
          installationDate,
        },

        payments: {
          totalProjectCost: Number(totalCost) || 0,
          customerContribution: Number(customerContribution) || totalCost,
          amountPaid: Number(amountPaid) || 0,
          paymentMode,
        },

        bankLoan: {
          loanRequired,
          bankName: loanRequired ? bankName : "",
          branchName: loanRequired ? branchName : "",
          bankLocation: loanRequired ? branchName : "",
          loanAppNumber: loanRequired ? loanAppNumber : "",
          loanAmountApproved: loanRequired ? Number(loanAmountApproved) : 0,
          loanAmountDisbursed: loanRequired ? Number(loanAmountDisbursed) : 0,
          nextExpectedPayment: loanRequired ? Number(nextExpectedPayment) : 0,
          nextPaymentDate: loanRequired ? nextPaymentDate : "",
          loanStatus: loanRequired ? loanStatus : "NOT_REQUIRED",
        },

        discomDetails: {
          consumerName: customerName.trim(),
          consumerNumber: consumerNumber.trim(),
          billNumber: billNumber.trim(),
          meterNumber: consumerNumber.trim(),
          sanctionedLoad: `${capacityKW} KW`,
        },

        billVerification: {
          nameCorrect: nameMatchesBill ? "CORRECT" : "INCORRECT",
          consumerNumberCorrect: "CORRECT",
          addressCorrect: "CORRECT",
          aadhaarDetailsCorrect: "CORRECT",
          panDetailsCorrect: "CORRECT",
        },

        nameCorrection: {
          required: nameCorrectionRequired,
          submitted: nameCorrectionSubmitted,
          submissionDate: nameCorrectionSubmitted ? nameCorrectionDate : "",
          status: nameCorrectionRequired ? (nameCorrectionSubmitted ? "SUBMITTED" : "PENDING") : "NOT_REQUIRED",
        },

        meterDetails: {
          existingMeterType: meterType,
          configStatus: meterConfigured ? "CONFIGURED" : "PENDING",
          configDate: meterConfigured ? meterConfigDate : "",
          panelInstalled: installationStatus === "COMPLETED",
          meterConfigured,
          meterWorkingCorrectly: meterWorkingOk,
          solarGenerationShowing: meterWorkingOk,
          netMeteringWorking: meterWorkingOk,
          issueDescription: meterIssue,
        },

        issues: (!isSiteAllOk && siteIssueReport.trim()) ? [{
          id: Date.now().toString(),
          title: "Site Quality / Installation Issue",
          description: siteIssueReport.trim(),
          priority: "HIGH",
          status: "OPEN",
          dateReported: new Date().toISOString().split("T")[0],
        }] : [],

        subsidyTracking: {
          centralSubsidy: {
            applied: centralSubsidyApplied,
            appNumber: centralAppNumber.trim(),
            expectedAmount: Number(centralExpectedAmount) || 78000,
            approvedAmount: Number(centralExpectedAmount) || 78000,
            receivedAmount: Number(centralReceivedAmount) || 0,
            receivedDate: centralReceivedDate,
            status: centralStatus,
          },
          stateSubsidy: {
            applied: stateSubsidyApplied,
            appNumber: stateAppNumber.trim(),
            expectedAmount: Number(stateExpectedAmount) || 30000,
            approvedAmount: Number(stateExpectedAmount) || 30000,
            receivedAmount: Number(stateReceivedAmount) || 0,
            receivedDate: stateReceivedDate,
            status: stateStatus,
          },
        },

        currentFollowUp: {
          currentFollowUpWith: followUpParty,
          contactPerson: contactPerson.trim() || customerName.trim(),
          phone: followUpPhone.trim() || mobile.trim(),
          currentDiscussion: discussionNotes.trim(),
          nextFollowUpDate,
        },
      };

      const endpoint = projectToEdit ? `${baseUrl}/api/projects/${projectToEdit.projectId}` : `${baseUrl}/api/projects`;
      const method = projectToEdit ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || (projectToEdit ? "Failed to update project" : "Failed to create project"));
      }

      toast.success(
        data.message || (projectToEdit ? `Project ${projectToEdit.projectId} updated successfully!` : "Solar Project record saved in Database successfully!")
      );
      onProjectCreated(data.project || { ...projectToEdit, ...payload });
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message || "Failed to save project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 text-slate-100 border border-slate-800 p-0 sm:rounded-2xl shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {projectToEdit ? <Edit className="h-5 w-5" /> : <Sun className="h-5 w-5 animate-spin-slow" />}
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white flex items-center gap-2 font-display">
                  {projectToEdit ? (
                    <span>✏️ Edit Solar Project: <span className="text-amber-400">{projectToEdit.projectId}</span> ({projectToEdit.customerName})</span>
                  ) : (
                    <span>➕ Naya Solar Project / Past Data Entry</span>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400">
                  {projectToEdit
                    ? "Customer, subsidies, bank loan, payment aur meter ki jankari update karein."
                    : "Pura data bharein: Central & State Subsidy, Bank Loan, Net-Meter, Aur Payment Hisab."}
                </DialogDescription>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Single Form vs Step Tabs Switcher */}
              <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs shadow-inner">
                <button
                  type="button"
                  onClick={() => setViewMode("tabs")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    viewMode === "tabs" ? "bg-amber-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  📑 Step Tabs
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("single")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    viewMode === "single" ? "bg-amber-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  📜 Ek Panna (Single Form)
                </button>
              </div>

              {!projectToEdit && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleFillDemoData}
                  className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs h-7 gap-1"
                  title="Load Maharajganj 3KW Solar Demo Data"
                >
                  <Sparkles className="h-3 w-3" /> Quick Demo Fill
                </Button>
              )}

              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[11px] px-2.5 py-0.5 hidden sm:inline-flex">
                Atlas Cloud DB
              </Badge>
            </div>
          </div>

          {/* Tab Navigation buttons - only shown in tabs mode */}
          {viewMode === "tabs" ? (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-2 border-t border-slate-800">
              {[
                { id: "customer", label: "1. Customer & Site", icon: User },
                { id: "solar", label: "2. Solar Hardware", icon: Sun },
                { id: "payments", label: "3. Total Rate & Pay", icon: IndianRupee },
                { id: "loan", label: "4. Bank Loan", icon: Landmark },
                { id: "discom", label: "5. Electricity & Meter", icon: Zap },
                { id: "subsidy", label: "6. Dono Subsidy (Central + State)", icon: ShieldCheck },
                { id: "followup", label: "7. Kis Se Baat", icon: Phone },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSection === tab.id;
                return (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                        : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-amber-300/80 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span>Ek Panna Form: Niche scroll karke sari jankari (Customer, Rate, Loan, Meter, Dono Subsidy) ek sath bharein ya edit karein.</span>
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* SECTION 1: CUSTOMER & SITE */}
          {(viewMode === "single" || activeSection === "customer") && (
            <div className={`space-y-4 ${viewMode === "single" ? "p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/30" : ""}`}>
              <h3 className="text-sm font-semibold text-amber-400 flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2"><User className="h-4 w-4" /> 1. Grahak Ki Jankari (Customer & Site Details)</span>
                {viewMode === "single" && <Badge variant="outline" className="text-[10px] text-slate-400">Step 1 of 7</Badge>}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Customer Full Name *</label>
                  <Input
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar Verma"
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Pita / Pati Ka Naam (Father/Husband Name)</label>
                  <Input
                    value={fatherHusbandName}
                    onChange={(e) => setFatherHusbandName(e.target.value)}
                    placeholder="e.g. Shri Ramakant Verma"
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Mobile Number *</label>
                  <Input
                    required
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 9838000000"
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">WhatsApp Number</label>
                  <Input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. 9838000000"
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-300 font-medium">Pura Pata (Full Address / Gaon / Mohalla)</label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Station Road, Near Tehsil Gate, Ward No. 4"
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">City / Tehsil / Block</label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Paniyara"
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">District (Zila)</label>
                  <Input
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Maharajganj"
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">PIN Code</label>
                  <Input
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="273303"
                    className="mt-1 bg-slate-900 border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Aadhaar Card Number</label>
                  <Input
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="1234 5678 9012"
                    className="mt-1 bg-slate-900 border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">PAN Card Number (Optional)</label>
                  <Input
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    placeholder="ABCDE1234F"
                    className="mt-1 bg-slate-900 border-slate-800 text-white uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Enquiry Kahan Se Aayi Thi (Lead Source)</label>
                  <select
                    value={inquirySource}
                    onChange={(e) => setInquirySource(e.target.value)}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  >
                    <option value="Direct Walk-in / Office">Direct Walk-in / Office (Grahak Khud Aaya)</option>
                    <option value="Website Enquiry">Website Enquiry (Online Form)</option>
                    <option value="Dealer / Agent">Dealer / Sub-dealer Referral</option>
                    <option value="Gram Pradhan / Referral">Gram Pradhan / Mitra Referral</option>
                    <option value="Phone Call / Telecall">Phone Call / Helpline</option>
                    <option value="Camp / Banner / Field Survey">Camp / Banner / Field Survey</option>
                    <option value="Other">Anya (Other)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Enquiry Aane Ki Date (Kab Aayi Thi)</label>
                  <Input
                    type="date"
                    value={inquiryDate}
                    onChange={(e) => setInquiryDate(e.target.value)}
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-300 font-medium">Project Final Status / Stage (Kiska Lag Gya Hai / Kiska Baki Hai)</label>
                  <select
                    value={projectFinalStatus}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProjectFinalStatus(val);
                      if (val === "INSTALLATION_COMPLETE" || val === "METER_CONFIGURED" || val === "COMPLETED") {
                        setInstallationStatus("COMPLETED");
                      } else if (val === "INSTALLATION_PENDING") {
                        setInstallationStatus("SCHEDULED");
                      }
                    }}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-amber-300 font-bold"
                  >
                    <option value="INSTALLATION_COMPLETE">✅ Panel Lag Gaya Hai (Final Hua - Installation Complete)</option>
                    <option value="INSTALLATION_PENDING">⏳ Final Hua Hai Par Panel Lagna Baki Hai (Pending Installation)</option>
                    <option value="METER_CONFIGURED">⚡ Panel Laga + Net-Meter Configured Ho Chuka Hai</option>
                    <option value="COMPLETED">🏆 Poora Project Complete (Panel + Meter + Dono Subsidy Aagyi)</option>
                    <option value="SITE_SURVEY">📐 Site Survey Done (Rate Finalization In Progress)</option>
                    <option value="ENQUIRY">📞 Sirf Enquiry Aayi Hai (Initial Inquiry)</option>
                  </select>
                </div>
              </div>

              {viewMode === "tabs" && (
                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    onClick={() => setActiveSection("solar")}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs gap-1"
                  >
                    Next: Solar System ➔
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: SOLAR HARDWARE & CAPACITY */}
          {(viewMode === "single" || activeSection === "solar") && (
            <div className={`space-y-4 ${viewMode === "single" ? "p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/30" : ""}`}>
              <h3 className="text-sm font-semibold text-amber-400 flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2"><Sun className="h-4 w-4" /> 2. Solar Panel System & Installation (Hardware & Capacity)</span>
                {viewMode === "single" && <Badge variant="outline" className="text-[10px] text-slate-400">Step 2 of 7</Badge>}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium">System Capacity (KW) *</label>
                  <select
                    value={capacityKW}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCapacityKW(val);
                      setPanelCount(Math.ceil((val * 1000) / panelWattage));
                      if (val >= 3) {
                        setCentralExpectedAmount(78000);
                        setStateExpectedAmount(30000);
                      } else if (val === 2) {
                        setCentralExpectedAmount(60000);
                        setStateExpectedAmount(30000);
                      } else {
                        setCentralExpectedAmount(30000);
                        setStateExpectedAmount(15000);
                      }
                    }}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20].map((kw) => (
                      <option key={kw} value={kw}>
                        {kw} KW System
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Panel Brand / Company</label>
                  <Input
                    value={panelBrand}
                    onChange={(e) => setPanelBrand(e.target.value)}
                    placeholder="e.g. Tata Power / Waaree / Adani"
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Panel Wattage (W)</label>
                  <Input
                    type="number"
                    value={panelWattage}
                    onChange={(e) => {
                      const w = Number(e.target.value) || 550;
                      setPanelWattage(w);
                      setPanelCount(Math.ceil((capacityKW * 1000) / w));
                    }}
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Total Panels Installed</label>
                  <Input
                    type="number"
                    value={panelCount}
                    onChange={(e) => setPanelCount(Number(e.target.value))}
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Inverter Brand</label>
                  <Input
                    value={inverterBrand}
                    onChange={(e) => setInverterBrand(e.target.value)}
                    placeholder="e.g. On-Grid 3.3KW Inverter"
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Inverter Serial Number</label>
                  <Input
                    value={inverterSerialNumber}
                    onChange={(e) => setInverterSerialNumber(e.target.value)}
                    placeholder="e.g. INV-2026-98124"
                    className="mt-1 bg-slate-900 border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Installation Date (Kab laga)</label>
                  <Input
                    type="date"
                    value={installationDate}
                    onChange={(e) => setInstallationDate(e.target.value)}
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Installation Status</label>
                  <select
                    value={installationStatus}
                    onChange={(e) => setInstallationStatus(e.target.value as any)}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  >
                    <option value="COMPLETED">Completed (Lag Chuka Hai)</option>
                    <option value="IN_PROGRESS">In Progress (Lag Raha Hai)</option>
                    <option value="SCHEDULED">Scheduled (Lagna Baki Hai)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Panel Lagne Ke Baad Sab Sahi Hai? (Site Quality)</label>
                  <select
                    value={isSiteAllOk ? "YES" : "NO"}
                    onChange={(e) => setIsSiteAllOk(e.target.value === "YES")}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  >
                    <option value="YES">Yes, Sab Kuch Sahi Hai (All OK & Working ✅)</option>
                    <option value="NO">No, Koi Samasya / Fault Hai (Issue Report Karein ⚠️)</option>
                  </select>
                </div>
                {!isSiteAllOk && (
                  <div className="md:col-span-3">
                    <label className="text-xs text-rose-300 font-medium">Anya Koi Issue / Site Report (Samasya Ka Report / Description)</label>
                    <Textarea
                      value={siteIssueReport}
                      onChange={(e) => setSiteIssueReport(e.target.value)}
                      placeholder="e.g. Structure nut-bolt loose, shadow problem from tree, inverter error code, or wiring issue"
                      className="mt-1 bg-slate-900 border-slate-800 text-white text-xs"
                      rows={2}
                    />
                  </div>
                )}
              </div>

              {viewMode === "tabs" && (
                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveSection("customer")}
                    className="border-slate-800 text-slate-300 text-xs"
                  >
                    ⬅ Prev: Customer
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveSection("payments")}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs gap-1"
                  >
                    Next: Payments ➔
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: TOTAL RATE & PAYMENTS */}
          {(viewMode === "single" || activeSection === "payments") && (
            <div className={`space-y-4 ${viewMode === "single" ? "p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/30" : ""}`}>
              <h3 className="text-sm font-semibold text-emerald-400 flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2"><IndianRupee className="h-4 w-4" /> 3. Total Rate & Payment Hisab-Kitab (Customer Payments)</span>
                {viewMode === "single" && <Badge variant="outline" className="text-[10px] text-slate-400">Step 3 of 7</Badge>}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Total Rate (Agreed Project Cost) ₹ *</label>
                  <Input
                    type="number"
                    value={totalCost}
                    onChange={(e) => {
                      const cost = Number(e.target.value) || 0;
                      setTotalCost(cost);
                      setCustomerContribution(cost);
                    }}
                    className="mt-1 bg-slate-900 border-slate-800 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Customer Ne Kitna Diya (Paid Amount) ₹</label>
                  <Input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value) || 0)}
                    className="mt-1 bg-slate-900 border-slate-800 text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Kitna Payment Baki Hai (Remaining) ₹</label>
                  <div className="mt-1 p-2 rounded-lg bg-slate-900 border border-slate-800 text-sm font-bold text-rose-400">
                    ₹{Math.max(0, totalCost - amountPaid).toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Payment Ka Madhyam (Mode)</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  >
                    <option value="UPI / QR Code">UPI / QR Code</option>
                    <option value="Bank Transfer / NEFT / RTGS">Bank Transfer (NEFT/RTGS)</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              {viewMode === "tabs" && (
                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveSection("solar")}
                    className="border-slate-800 text-slate-300 text-xs"
                  >
                    ⬅ Prev: Solar Hardware
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveSection("loan")}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs gap-1"
                  >
                    Next: Bank Loan ➔
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: BANK LOAN & FINANCING */}
          {(viewMode === "single" || activeSection === "loan") && (
            <div className={`space-y-4 ${viewMode === "single" ? "p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/30" : ""}`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                  <Landmark className="h-4 w-4" /> 4. Bank Loan Ki Jankari (Financing Status)
                </h3>
                <div className="flex items-center gap-2">
                  {viewMode === "single" && <Badge variant="outline" className="text-[10px] text-slate-400">Step 4 of 7</Badge>}
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                    <input
                      type="checkbox"
                      checked={loanRequired}
                      onChange={(e) => setLoanRequired(e.target.checked)}
                      className="rounded border-slate-700 h-4 w-4 accent-purple-500"
                    />
                    <span>Bank Se Loan Hua Hai?</span>
                  </label>
                </div>
              </div>

              {loanRequired ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Bank Name</label>
                    <Input
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. State Bank of India (SBI)"
                      className="mt-1 bg-slate-900 border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Bank Branch & Location</label>
                    <Input
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      placeholder="e.g. Maharajganj Main Branch"
                      className="mt-1 bg-slate-900 border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Loan App / Account Number</label>
                    <Input
                      value={loanAppNumber}
                      onChange={(e) => setLoanAppNumber(e.target.value)}
                      placeholder="e.g. SBI-SOLAR-8921"
                      className="mt-1 bg-slate-900 border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Total Loan Approved (Sanctioned) ₹</label>
                    <Input
                      type="number"
                      value={loanAmountApproved}
                      onChange={(e) => setLoanAmountApproved(Number(e.target.value) || 0)}
                      className="mt-1 bg-slate-900 border-slate-800 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Bank Ne Abhi Kitna Diya (Disbursed) ₹</label>
                    <Input
                      type="number"
                      value={loanAmountDisbursed}
                      onChange={(e) => setLoanAmountDisbursed(Number(e.target.value) || 0)}
                      className="mt-1 bg-slate-900 border-slate-800 text-emerald-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Bank Kitna Next Payment Karega ₹</label>
                    <Input
                      type="number"
                      value={nextExpectedPayment}
                      onChange={(e) => setNextExpectedPayment(Number(e.target.value) || 0)}
                      className="mt-1 bg-slate-900 border-slate-800 text-amber-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Next Payment Kab Karega (Date)</label>
                    <Input
                      type="date"
                      value={nextPaymentDate}
                      onChange={(e) => setNextPaymentDate(e.target.value)}
                      className="mt-1 bg-slate-900 border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Bank Approval Status</label>
                    <select
                      value={loanStatus}
                      onChange={(e) => setLoanStatus(e.target.value)}
                      className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white"
                    >
                      <option value="APPROVED">Approved (Pass Ho Gya)</option>
                      <option value="FULLY_DISBURSED">Fully Disbursed (Poora Aagya)</option>
                      <option value="PARTIALLY_DISBURSED">Partially Disbursed (Kisht Aayi Hai)</option>
                      <option value="UNDER_REVIEW">Under Review (Bank Process Me Hai)</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
                  No bank loan involved for this customer. Direct customer payment.
                </div>
              )}

              {viewMode === "tabs" && (
                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveSection("payments")}
                    className="border-slate-800 text-slate-300 text-xs"
                  >
                    ⬅ Prev: Payments
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveSection("discom")}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs gap-1"
                  >
                    Next: Electricity & Meter ➔
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* SECTION 5: ELECTRICITY & METERING */}
          {(viewMode === "single" || activeSection === "discom") && (
            <div className={`space-y-4 ${viewMode === "single" ? "p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/30" : ""}`}>
              <h3 className="text-sm font-semibold text-cyan-400 flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> 5. Bijli Vibhag & Net-Meter (UPPCL DISCOM & Metering)</span>
                {viewMode === "single" && <Badge variant="outline" className="text-[10px] text-slate-400">Step 5 of 7</Badge>}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Electricity Consumer Number (Account ID)</label>
                  <Input
                    value={consumerNumber}
                    onChange={(e) => setConsumerNumber(e.target.value)}
                    placeholder="e.g. 721900823412"
                    className="mt-1 bg-slate-900 border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Bill Number</label>
                  <Input
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    placeholder="e.g. UPPCL-BILL-9012"
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Meter Type (Smart ya Old?)</label>
                  <select
                    value={meterType}
                    onChange={(e) => setMeterType(e.target.value)}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  >
                    <option value="Smart Meter">Smart Meter (4G/RF)</option>
                    <option value="Old Meter">Old Digital / Electro-Mechanical Meter</option>
                    <option value="Net Meter">Bi-Directional Net Meter</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Bill Ka Naam Aadhaar/PAN Se Match Hai?</label>
                  <select
                    value={nameMatchesBill ? "YES" : "NO"}
                    onChange={(e) => setNameMatchesBill(e.target.value === "YES")}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  >
                    <option value="YES">Yes, Sabhi Data Match Hai (Verified ✅)</option>
                    <option value="NO">No, Mismatch Hai (Name Correction Chahiye ⚠️)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Name Correction Ke Liye Diya Gya Hai?</label>
                  <select
                    value={nameCorrectionRequired ? (nameCorrectionSubmitted ? "SUBMITTED" : "PENDING") : "NOT_NEEDED"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "NOT_NEEDED") {
                        setNameCorrectionRequired(false);
                        setNameCorrectionSubmitted(false);
                      } else if (val === "SUBMITTED") {
                        setNameCorrectionRequired(true);
                        setNameCorrectionSubmitted(true);
                        if (!nameCorrectionDate) {
                          setNameCorrectionDate(new Date().toISOString().split("T")[0]);
                        }
                      } else {
                        setNameCorrectionRequired(true);
                        setNameCorrectionSubmitted(false);
                      }
                    }}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  >
                    <option value="NOT_NEEDED">Not Required (Naam Sahi Hai)</option>
                    <option value="SUBMITTED">Diya Gaya Hai (Submitted in Discom Office)</option>
                    <option value="PENDING">Dena Baki Hai (Pending Submission)</option>
                  </select>
                </div>
                {nameCorrectionSubmitted && (
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Name Correction Kab Diya Gya (Date)</label>
                    <Input
                      type="date"
                      value={nameCorrectionDate}
                      onChange={(e) => setNameCorrectionDate(e.target.value)}
                      className="mt-1 bg-slate-900 border-slate-800 text-white"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs text-slate-300 font-medium">Net Meter Configure Hua Hai?</label>
                  <select
                    value={meterConfigured ? "YES" : "NO"}
                    onChange={(e) => setMeterConfigured(e.target.value === "YES")}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  >
                    <option value="YES">Yes, Configure Ho Gaya Hai ✅</option>
                    <option value="NO">No, Baki Hai (Pending Configuration ⏳)</option>
                  </select>
                </div>
                {meterConfigured && (
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Kab Configure Hua (Date)</label>
                    <Input
                      type="date"
                      value={meterConfigDate}
                      onChange={(e) => setMeterConfigDate(e.target.value)}
                      className="mt-1 bg-slate-900 border-slate-800 text-white"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs text-slate-300 font-medium">Panel Lagne Ke Baad Meter Sahi Hai?</label>
                  <select
                    value={meterWorkingOk ? "YES" : "NO"}
                    onChange={(e) => setMeterWorkingOk(e.target.value === "YES")}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  >
                    <option value="YES">Yes, Import/Export Sahi Chal Raha Hai ✅</option>
                    <option value="NO">No, Fault / Issue Aaya Hai ❌</option>
                  </select>
                </div>
                {!meterWorkingOk && (
                  <div className="md:col-span-3">
                    <label className="text-xs text-rose-300 font-medium">Meter Issue Ka Report / Description</label>
                    <Textarea
                      value={meterIssue}
                      onChange={(e) => setMeterIssue(e.target.value)}
                      placeholder="e.g. Reverse units not counting, meter display blank, or billing defect"
                      className="mt-1 bg-slate-900 border-slate-800 text-white text-xs"
                      rows={2}
                    />
                  </div>
                )}
              </div>

              {viewMode === "tabs" && (
                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveSection("loan")}
                    className="border-slate-800 text-slate-300 text-xs"
                  >
                    ⬅ Prev: Bank Loan
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveSection("subsidy")}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs gap-1"
                  >
                    Next: Dono Subsidy ➔
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* SECTION 6: DONO SUBSIDIES (CENTRAL + STATE) */}
          {(viewMode === "single" || activeSection === "subsidy") && (
            <div className={`space-y-5 ${viewMode === "single" ? "p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/30" : ""}`}>
              <h3 className="text-sm font-semibold text-amber-400 flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> 6. Dono Subsidy Tracking (PM Surya Ghar Central + UP State UPNEDA)</span>
                {viewMode === "single" && <Badge variant="outline" className="text-[10px] text-slate-400">Step 6 of 7</Badge>}
              </h3>

              {/* Central Subsidy */}
              <div className="p-4 rounded-xl border border-blue-900/60 bg-blue-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-300">
                    1. Central Govt Subsidy (PM Surya Ghar DBT)
                  </span>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={centralSubsidyApplied}
                      onChange={(e) => setCentralSubsidyApplied(e.target.checked)}
                      className="rounded border-slate-700 h-4 w-4 accent-blue-500"
                    />
                    <span>Subsidy Ke Liye Apply Hua Hai?</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Application / Ack No</label>
                    <Input
                      value={centralAppNumber}
                      onChange={(e) => setCentralAppNumber(e.target.value)}
                      placeholder="PMSG-UP-98214"
                      className="mt-1 bg-slate-900 border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Expected Subsidy ₹</label>
                    <Input
                      type="number"
                      value={centralExpectedAmount}
                      onChange={(e) => setCentralExpectedAmount(Number(e.target.value) || 0)}
                      className="mt-1 bg-slate-900 border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Subsidy Status</label>
                    <select
                      value={centralStatus}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCentralStatus(val);
                        if (val === "RECEIVED" && centralReceivedAmount === 0) {
                          setCentralReceivedAmount(centralExpectedAmount);
                          setCentralReceivedDate(new Date().toISOString().split("T")[0]);
                        }
                      }}
                      className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-medium"
                    >
                      <option value="UNDER_PROCESS">Under Process (Aana Baki Hai ⏳)</option>
                      <option value="RECEIVED">Aa Gayi Hai (Received In Bank ✅)</option>
                      <option value="APPROVED">Approved (Release Pending)</option>
                      <option value="NOT_APPLIED">Not Applied</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Kitna Amount Aaya ₹</label>
                    <Input
                      type="number"
                      value={centralReceivedAmount}
                      onChange={(e) => setCentralReceivedAmount(Number(e.target.value) || 0)}
                      placeholder="0"
                      className="mt-1 bg-slate-900 border-slate-800 text-emerald-400 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* State Subsidy */}
              <div className="p-4 rounded-xl border border-purple-900/60 bg-purple-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">
                    2. UP State Govt Subsidy (UPNEDA State Portal)
                  </span>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stateSubsidyApplied}
                      onChange={(e) => setStateSubsidyApplied(e.target.checked)}
                      className="rounded border-slate-700 h-4 w-4 accent-purple-500"
                    />
                    <span>State Subsidy Apply Hui Hai?</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-medium">State Application Ref</label>
                    <Input
                      value={stateAppNumber}
                      onChange={(e) => setStateAppNumber(e.target.value)}
                      placeholder="UPNEDA-2026-441"
                      className="mt-1 bg-slate-900 border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Expected Subsidy ₹</label>
                    <Input
                      type="number"
                      value={stateExpectedAmount}
                      onChange={(e) => setStateExpectedAmount(Number(e.target.value) || 0)}
                      className="mt-1 bg-slate-900 border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium">State Subsidy Status</label>
                    <select
                      value={stateStatus}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStateStatus(val);
                        if (val === "RECEIVED" && stateReceivedAmount === 0) {
                          setStateReceivedAmount(stateExpectedAmount);
                          setStateReceivedDate(new Date().toISOString().split("T")[0]);
                        }
                      }}
                      className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-medium"
                    >
                      <option value="UNDER_PROCESS">Under Process (Aana Baki Hai ⏳)</option>
                      <option value="RECEIVED">Aa Gayi Hai (Received In Bank ✅)</option>
                      <option value="APPROVED">Approved (Release Pending)</option>
                      <option value="NOT_APPLIED">Not Applied</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium">Kitna Amount Aaya ₹</label>
                    <Input
                      type="number"
                      value={stateReceivedAmount}
                      onChange={(e) => setStateReceivedAmount(Number(e.target.value) || 0)}
                      placeholder="0"
                      className="mt-1 bg-slate-900 border-slate-800 text-emerald-400 font-bold"
                    />
                  </div>
                </div>
              </div>

              {viewMode === "tabs" && (
                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveSection("discom")}
                    className="border-slate-800 text-slate-300 text-xs"
                  >
                    ⬅ Prev: Electricity & Meter
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveSection("followup")}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs gap-1"
                  >
                    Next: Kis Se Baat ➔
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* SECTION 7: KIS SE BAAT CHAL RAHI HAI */}
          {(viewMode === "single" || activeSection === "followup") && (
            <div className={`space-y-4 ${viewMode === "single" ? "p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/30" : ""}`}>
              <h3 className="text-sm font-semibold text-amber-400 flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> 7. Pipeline Tracking: Kis Se Baat Chal Rahi Hai? (Discussion & Follow-up)</span>
                {viewMode === "single" && <Badge variant="outline" className="text-[10px] text-slate-400">Step 7 of 7</Badge>}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Party / Department</label>
                  <select
                    value={followUpParty}
                    onChange={(e) => setFollowUpParty(e.target.value)}
                    className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  >
                    <option value="CUSTOMER">Customer (Grahak Se Baat)</option>
                    <option value="BANK">Bank Manager / Loan Officer</option>
                    <option value="ELECTRICITY_DEPARTMENT">Electricity Dept (DISCOM / JE / SDO)</option>
                    <option value="TECHNICIAN">Technician / Installation Team</option>
                    <option value="SUBSIDY_DEPARTMENT">UPNEDA / Subsidy Portal Officer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Contact Person Name</label>
                  <Input
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Ramesh Verma"
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Contact Phone Number</label>
                  <Input
                    value={followUpPhone}
                    onChange={(e) => setFollowUpPhone(e.target.value)}
                    placeholder="e.g. 9838000000"
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-300 font-medium">Discussion Notes (Kya Baat Chal Rahi Hai)</label>
                  <Textarea
                    value={discussionNotes}
                    onChange={(e) => setDiscussionNotes(e.target.value)}
                    placeholder="e.g. Net meter feasibility check passed. Waiting for bank second disbursement cheque."
                    className="mt-1 bg-slate-900 border-slate-800 text-white text-xs"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Agli Baat / Follow-up Date</label>
                  <Input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    className="mt-1 bg-slate-900 border-slate-800 text-white"
                  />
                </div>
              </div>

              {viewMode === "tabs" && (
                <div className="flex justify-start pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveSection("subsidy")}
                    className="border-slate-800 text-slate-300 text-xs"
                  >
                    ⬅ Prev: Dono Subsidy
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="p-4 border-t border-slate-800 bg-slate-900/40 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              * Required fields. All entries are backed up immediately to your MongoDB Atlas cloud.
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-slate-800 text-slate-300 hover:bg-slate-900"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {submitting ? "Saving in Database..." : (projectToEdit ? "💾 Update Solar Project Data" : "💾 Save Solar Project & Sync")}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
