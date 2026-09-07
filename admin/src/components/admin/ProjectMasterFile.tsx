import { useState } from "react";
import { RooftopSolarHouseView } from "./RooftopSolarHouseView";
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
  User,
  Phone,
  Building2,
  Zap,
  Sun,
  IndianRupee,
  Landmark,
  FileText,
  Wrench,
  MessageSquare,
  AlertTriangle,
  Clock,
  Printer,
  X,
  CheckCircle2,
  Eye,
  EyeOff,
  Plus,
  ShieldCheck,
  Sparkles,
  Cpu,
  Briefcase,
  Edit,
  Trash2,
  Upload,
  Download,
  ExternalLink,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export interface IProjectData {
  id: string;
  projectId: string;
  leadId?: string;
  enquiryId?: string;
  enquiryDate?: string;
  source?: string;
  projectStatus: string;
  dealerId?: string;
  dealerName?: string;

  customerName: string;
  fatherHusbandName?: string;
  mobile: string;
  alternateMobile?: string;
  whatsapp?: string;
  email?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  address?: string;
  city: string;
  district?: string;
  state?: string;
  pincode?: string;

  discomDetails: {
    discomName?: string;
    division?: string;
    subDivision?: string;
    officeLocation?: string;
    officeAddress?: string;
    contactPerson?: string;
    contactNumber?: string;
    consumerName?: string;
    consumerNumber?: string;
    connectionNumber?: string;
    accountNumber?: string;
    meterNumber?: string;
    billNumber?: string;
    latestBillDate?: string;
    currentBillAmount?: number;
    connectionType?: string;
    sanctionedLoad?: string;
    existingLoad?: string;
  };

  billVerification: {
    nameCorrect: string;
    consumerNumberCorrect: string;
    addressCorrect: string;
    billNumberCorrect: string;
    aadhaarDetailsCorrect: string;
    panDetailsCorrect: string;
    connectionDetailsCorrect: string;
    verificationNotes?: string;
  };

  nameCorrection: {
    required: boolean;
    submitted: boolean;
    submissionDate?: string;
    correctionAppNumber?: string;
    deptOffice?: string;
    status: string;
    completedDate?: string;
    remarks?: string;
  };

  meterDetails: {
    existingMeterType?: string;
    meterNumber?: string;
    meterReading?: string;
    meterInstallDate?: string;
    meterPhoto?: string;
    meterStatus?: string;
    configStatus: string;
    configAppDate?: string;
    configDate?: string;
    configRefNumber?: string;
    deptOffice?: string;
    remarks?: string;
    panelInstalled: boolean;
    meterConfigured: boolean;
    meterWorkingCorrectly: boolean;
    meterReadingCorrect: boolean;
    solarGenerationShowing: boolean;
    netMeteringWorking: boolean;
    billCorrectAfterInstallation: boolean;
    issueDescription?: string;
    issueDate?: string;
    reportedTo?: string;
    resolutionStatus?: string;
    resolutionDate?: string;
    resolutionNotes?: string;
  };

  solarInstallation: {
    companyName: string;
    panelBrand?: string;
    panelModel?: string;
    panelWattage: number;
    panelCount: number;
    capacityKW: number;
    inverterBrand?: string;
    inverterModel?: string;
    inverterSerialNumber?: string;
    structureType?: string;
    batteryIncluded: boolean;
    batteryCapacity?: string;
    installationDate?: string;
    installationTeam?: string;
    technician?: string;
    installationAddress?: string;
    installationPhotos?: string[];
    installationVideo?: string;
    installationStatus: string;
    checklist: Record<string, string>;
  };

  payments: {
    totalProjectCost: number;
    subsidyExpected: number;
    customerContribution: number;
    downPayment: number;
    amountPaid: number;
    amountRemaining: number;
    paymentStatus: string;
    transactions: Array<{
      id: string;
      paymentDate: string;
      amount: number;
      paymentMode: string;
      transactionId?: string;
      bankCashUPI?: string;
      receiptNumber?: string;
      notes?: string;
    }>;
  };

  bankLoan: {
    loanRequired: boolean;
    bankName?: string;
    branchName?: string;
    bankLocation?: string;
    branchAddress?: string;
    loanAppNumber?: string;
    loanAmountApplied?: number;
    loanAmountApproved?: number;
    loanAmountDisbursed?: number;
    firstDisbursement?: number;
    secondDisbursement?: number;
    nextExpectedPayment?: number;
    nextPaymentDate?: string;
    remainingBankAmount?: number;
    emi?: number;
    loanTenure?: string;
    interestRate?: string;
    loanOfficerName?: string;
    loanOfficerPhone?: string;
    appDate?: string;
    approvalDate?: string;
    disbursementDate?: string;
    loanStatus: string;
  };

  subsidyTracking: {
    centralSubsidy: {
      applied: boolean;
      appDate?: string;
      appNumber?: string;
      expectedAmount: number;
      approvedAmount?: number;
      receivedAmount: number;
      receivedDate?: string;
      status: string;
    };
    stateSubsidy: {
      applied: boolean;
      appDate?: string;
      appNumber?: string;
      expectedAmount: number;
      approvedAmount?: number;
      receivedAmount: number;
      receivedDate?: string;
      status: string;
    };
  };

  documents: Array<{
    id: string;
    docType: string;
    name: string;
    fileUrl: string;
    uploadDate: string;
    uploadedBy?: string;
    status: string;
    notes?: string;
  }>;

  technicianDetails: {
    technicianName?: string;
    phone?: string;
    assignedDate?: string;
    assignedBy?: string;
    jobType?: string;
    visitDate?: string;
    visitStatus?: string;
    technicianNotes?: string;
  };

  currentFollowUp: {
    currentFollowUpWith: string;
    contactPerson?: string;
    phone?: string;
    lastContactDate?: string;
    nextFollowUpDate?: string;
    currentDiscussion?: string;
    notes?: string;
  };
  followUps: Array<{
    id: string;
    date: string;
    time?: string;
    contactPerson?: string;
    contactMethod: string;
    party: string;
    notes: string;
    nextFollowUpDate?: string;
    loggedBy?: string;
  }>;

  issues: Array<{
    id: string;
    title: string;
    category?: string;
    description: string;
    priority: string;
    dateReported: string;
    reportedBy?: string;
    assignedTo?: string;
    status: string;
    resolution?: string;
    resolutionDate?: string;
  }>;

  timeline: Array<{
    id: string;
    date: string;
    time?: string;
    user: string;
    status: string;
    title: string;
    notes?: string;
  }>;

  createdAt: string;
  updatedAt: string;
}

interface ProjectMasterFileProps {
  project: IProjectData;
  onClose: () => void;
  onProjectUpdated: (updatedProject: IProjectData) => void;
  onEditProject?: (project: IProjectData) => void;
  initialSubTab?: SubTab;
}

type SubTab =
  | "overview"
  | "personal"
  | "electricity"
  | "meter"
  | "installation"
  | "payments"
  | "loan"
  | "subsidy"
  | "documents"
  | "technician"
  | "followups"
  | "issues"
  | "timeline";

export function ProjectMasterFile({
  project: initialProject,
  onClose,
  onProjectUpdated,
  onEditProject,
  initialSubTab,
}: ProjectMasterFileProps) {
  const [project, setProject] = useState<IProjectData>(initialProject);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>(initialSubTab || "overview");
  const [isSaving, setIsSaving] = useState(false);

  // Sensitive data mask states
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showPan, setShowPan] = useState(false);

  // Modal dialog states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isEditDocModalOpen, setIsEditDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [isMeterFileModalOpen, setIsMeterFileModalOpen] = useState(false);
  const [newMeterFile, setNewMeterFile] = useState({
    name: "",
    fileUrl: "",
    docType: "Meter Documents",
    notes: "",
  });
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // Forms for modals
  const [newPayment, setNewPayment] = useState({
    paymentDate: new Date().toISOString().split("T")[0],
    amount: "",
    paymentMode: "UPI",
    transactionId: "",
    bankCashUPI: "",
    receiptNumber: "",
    notes: "",
  });

  const [newDoc, setNewDoc] = useState({
    docType: "Aadhaar",
    name: "",
    fileUrl: "",
    status: "UPLOADED",
    notes: "",
  });

  const [newFollowUp, setNewFollowUp] = useState({
    date: new Date().toISOString().split("T")[0],
    contactPerson: initialProject.customerName,
    party: "Customer",
    contactMethod: "Call",
    notes: "",
    nextFollowUpDate: "",
  });

  const [newIssue, setNewIssue] = useState({
    title: "",
    category: "Installation",
    description: "",
    priority: "MEDIUM",
    dateReported: new Date().toISOString().split("T")[0],
  });

  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const token = localStorage.getItem("admin_token") || "";

  // Helper for partial updates
  const handleSaveSection = async (sectionKey: string, sectionData: any, toastMsg = "Details updated successfully") => {
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/projects/${project.projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [sectionKey]: sectionData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update project");

      setProject(data.project);
      onProjectUpdated(data.project);
      toast.success(toastMsg);
    } catch (err: any) {
      toast.error(err.message || "Update error");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper for Project Status Change
  const handleStatusChange = async (newStatus: string) => {
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/projects/${project.projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectStatus: newStatus,
          statusNotes: `Project lifecycle status changed to ${newStatus}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change status");

      setProject(data.project);
      onProjectUpdated(data.project);
      toast.success(`Project status changed to ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || "Status update error");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Payment Transaction
  const handleDeletePayment = async (txnId: string) => {
    if (!window.confirm("Kya aap sach me is payment transaction ko delete karna chahte hain? Isse customer ka balance recalculate hoga.")) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/projects/${project.projectId}/payments/${txnId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete payment");
      setProject(data.project);
      onProjectUpdated(data.project);
      toast.success("Payment transaction deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Error deleting payment");
    } finally {
      setIsSaving(false);
    }
  };

  // Update Overall Payment Status (Payment Done, Pending, Not Given, Other)
  const handleUpdatePaymentStatus = async (status: string) => {
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/projects/${project.projectId}/payments`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus: status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update payment status");
      setProject(data.project);
      onProjectUpdated(data.project);
      toast.success(`Payment status updated to: ${status}`);
    } catch (err: any) {
      toast.error(err.message || "Error updating payment status");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Document
  const handleDeleteDocument = async (docId: string) => {
    if (!window.confirm("Kya aap is document ko delete karna chahte hain?")) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/projects/${project.projectId}/documents/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete document");
      setProject(data.project);
      onProjectUpdated(data.project);
      toast.success("Document deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Error deleting document");
    } finally {
      setIsSaving(false);
    }
  };

  // Edit Document
  const handleEditDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/projects/${project.projectId}/documents/${editingDoc.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingDoc),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update document");
      setProject(data.project);
      onProjectUpdated(data.project);
      setIsEditDocModalOpen(false);
      setEditingDoc(null);
      toast.success("Document updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Error updating document");
    } finally {
      setIsSaving(false);
    }
  };

  // Upload Meter File / Photo
  const handleUploadMeterFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeterFile.name.trim() || !newMeterFile.fileUrl) {
      return toast.error("Please provide file title and select a file");
    }
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/projects/${project.projectId}/meter-files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMeterFile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload meter file");
      setProject(data.project);
      onProjectUpdated(data.project);
      setIsMeterFileModalOpen(false);
      setNewMeterFile({ name: "", fileUrl: "", docType: "Meter Documents", notes: "" });
      toast.success("Meter file / photo attached successfully");
    } catch (err: any) {
      toast.error(err.message || "Error attaching meter file");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Meter File
  const handleDeleteMeterFile = async (fileId: string) => {
    if (!window.confirm("Kya aap is meter file ko delete karna chahte hain?")) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/projects/${project.projectId}/meter-files/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete meter file");
      setProject(data.project);
      onProjectUpdated(data.project);
      toast.success("Meter file deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Error deleting meter file");
    } finally {
      setIsSaving(false);
    }
  };

  // Record Payment
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.amount || Number(newPayment.amount) <= 0) {
      return toast.error("Please enter a valid amount");
    }

    try {
      const res = await fetch(`${baseUrl}/api/projects/${project.projectId}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPayment),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add payment");

      setProject(data.project);
      onProjectUpdated(data.project);
      toast.success(data.message || "Payment recorded");
      setIsPaymentModalOpen(false);
      setNewPayment({
        paymentDate: new Date().toISOString().split("T")[0],
        amount: "",
        paymentMode: "UPI",
        transactionId: "",
        bankCashUPI: "",
        receiptNumber: "",
        notes: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Payment error");
    }
  };

  // Add Document
  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name || !newDoc.fileUrl) {
      return toast.error("Please enter document name and file URL / path");
    }

    try {
      const res = await fetch(`${baseUrl}/api/projects/${project.projectId}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDoc),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add document");

      setProject(data.project);
      onProjectUpdated(data.project);
      toast.success(data.message || "Document attached");
      setIsDocModalOpen(false);
      setNewDoc({
        docType: "Aadhaar",
        name: "",
        fileUrl: "",
        status: "UPLOADED",
        notes: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Doc error");
    }
  };

  // Add Follow-up
  const handleAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFollowUp.notes.trim()) {
      return toast.error("Please enter follow-up notes");
    }

    try {
      const res = await fetch(`${baseUrl}/api/projects/${project.projectId}/followups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newFollowUp),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add follow-up");

      setProject(data.project);
      onProjectUpdated(data.project);
      toast.success(data.message || "Follow-up saved");
      setIsFollowUpModalOpen(false);
      setNewFollowUp({
        date: new Date().toISOString().split("T")[0],
        contactPerson: project.customerName,
        party: "Customer",
        contactMethod: "Call",
        notes: "",
        nextFollowUpDate: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Follow-up error");
    }
  };

  // Add Issue
  const handleAddIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssue.title.trim() || !newIssue.description.trim()) {
      return toast.error("Please enter issue title and description");
    }

    try {
      const res = await fetch(`${baseUrl}/api/projects/${project.projectId}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newIssue),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to log issue");

      setProject(data.project);
      onProjectUpdated(data.project);
      toast.success(data.message || "Issue logged");
      setIsIssueModalOpen(false);
      setNewIssue({
        title: "",
        category: "Installation",
        description: "",
        priority: "MEDIUM",
        dateReported: new Date().toISOString().split("T")[0],
      });
    } catch (err: any) {
      toast.error(err.message || "Issue error");
    }
  };

  // Masking helpers
  const maskAadhaar = (val?: string) => {
    if (!val) return "Not Provided";
    if (showAadhaar) return val;
    const clean = val.replace(/\s+/g, "");
    if (clean.length < 4) return "XXXX";
    return `XXXX XXXX ${clean.slice(-4)}`;
  };

  const maskPan = (val?: string) => {
    if (!val) return "Not Provided";
    if (showPan) return val;
    if (val.length < 4) return "XXXXX";
    return `XXXXX${val.slice(-4)}`;
  };

  // Financial calculations
  const totalCost = project.payments?.totalProjectCost || 0;
  const customerPaid = project.payments?.amountPaid || 0;
  const customerBalance = project.payments?.amountRemaining || 0;
  const loanApproved = project.bankLoan?.loanAmountApproved || 0;
  const loanDisbursed = project.bankLoan?.loanAmountDisbursed || 0;
  const centralExpected = project.subsidyTracking?.centralSubsidy?.expectedAmount || 0;
  const centralReceived = project.subsidyTracking?.centralSubsidy?.receivedAmount || 0;
  const centralPending = Math.max(0, centralExpected - centralReceived);
  const stateExpected = project.subsidyTracking?.stateSubsidy?.expectedAmount || 0;
  const stateReceived = project.subsidyTracking?.stateSubsidy?.receivedAmount || 0;
  const statePending = Math.max(0, stateExpected - stateReceived);
  const totalReceived = customerPaid + loanDisbursed + centralReceived + stateReceived;
  const totalOutstanding = Math.max(0, totalCost - totalReceived);

  return (
    <div className="space-y-6">
      {/* 🏠 Visual Rooftop Solar House & Live Status */}
      <RooftopSolarHouseView project={project} />

      {/* 1. Header Banner & Sticky Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md print:border-none print:shadow-none print:p-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-900 text-white tracking-wider">
                {project.projectId}
              </span>
              {project.enquiryId && (
                <Badge variant="outline" className="text-xs bg-slate-100 text-slate-700">
                  Enquiry: {project.enquiryId}
                </Badge>
              )}
              <Badge className="bg-primary text-white font-medium text-xs">
                {project.solarInstallation?.capacityKW} KW Rooftop Solar
              </Badge>
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-800 border-amber-300">
                {project.solarInstallation?.companyName}
              </Badge>
              {project.dealerName && (
                <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-800 border-indigo-300 flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-indigo-600" />
                  Dealer: {project.dealerName} ({project.dealerId})
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl flex items-center gap-3">
              <span>{project.customerName}</span>
              <span className="text-base font-normal text-slate-500">
                ({project.city}, {project.state || "UP"})
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-primary" /> {project.mobile}
              </span>
              {project.discomDetails?.consumerNumber && (
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-amber-500" /> Consumer No: {project.discomDetails.consumerNumber}
                </span>
              )}
              {project.technicianDetails?.technicianName && (
                <span className="flex items-center gap-1">
                  <Wrench className="h-3.5 w-3.5 text-indigo-500" /> Tech: {project.technicianDetails.technicianName}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1.5">
              <span className="text-xs font-semibold text-slate-600 px-1">Status:</span>
              <select
                value={project.projectStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isSaving}
                className="h-8 rounded border border-slate-300 bg-white px-2 py-0.5 text-xs font-bold text-slate-800 shadow-sm"
              >
                <option value="ENQUIRY">ENQUIRY</option>
                <option value="FORM_ACCEPTED">FORM_ACCEPTED</option>
                <option value="DOCUMENT_VERIFICATION">DOCUMENT_VERIFICATION</option>
                <option value="LOAN_PROCESS">LOAN_PROCESS</option>
                <option value="SUBSIDY_PROCESS">SUBSIDY_PROCESS</option>
                <option value="TECHNICAL_ASSIGNED">TECHNICAL_ASSIGNED</option>
                <option value="SITE_SURVEY">SITE_SURVEY</option>
                <option value="INSTALLATION_PENDING">INSTALLATION_PENDING</option>
                <option value="INSTALLATION_COMPLETE">INSTALLATION_COMPLETE</option>
                <option value="METER_PENDING">METER_PENDING</option>
                <option value="METER_CONFIGURED">METER_CONFIGURED</option>
                <option value="SUBSIDY_PENDING">SUBSIDY_PENDING</option>
                <option value="SUBSIDY_RECEIVED">SUBSIDY_RECEIVED</option>
                <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            {onEditProject && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-blue-500/50 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 print:hidden text-xs font-semibold"
                onClick={() => onEditProject(project)}
              >
                <Edit className="h-3.5 w-3.5" /> ✏️ Edit Data (Jankari Badlein)
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-slate-700 hover:bg-slate-100 print:hidden"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4" /> Print Customer File
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800 print:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* 2. Financial Summary Card (Auto Calculations) */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Project Cost</span>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">₹{totalCost.toLocaleString("en-IN")}</div>
            <span className="text-[10px] text-slate-500">Gross Quoted</span>
          </div>
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase">Customer Paid</span>
            <div className="text-lg font-extrabold text-emerald-900 mt-0.5">₹{customerPaid.toLocaleString("en-IN")}</div>
            <span className="text-[10px] text-emerald-700">Balance: ₹{customerBalance.toLocaleString("en-IN")}</span>
          </div>
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
            <span className="text-[11px] font-semibold text-blue-800 uppercase">Bank Loan</span>
            <div className="text-lg font-extrabold text-blue-950 mt-0.5">₹{loanDisbursed.toLocaleString("en-IN")}</div>
            <span className="text-[10px] text-blue-700">Approved: ₹{loanApproved.toLocaleString("en-IN")}</span>
          </div>
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
            <span className="text-[11px] font-semibold text-amber-800 uppercase">Central Subsidy</span>
            <div className="text-lg font-extrabold text-amber-950 mt-0.5">₹{centralReceived.toLocaleString("en-IN")}</div>
            <span className="text-[10px] text-amber-700">Pending: ₹{centralPending.toLocaleString("en-IN")}</span>
          </div>
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
            <span className="text-[11px] font-semibold text-indigo-800 uppercase">State Subsidy</span>
            <div className="text-lg font-extrabold text-indigo-950 mt-0.5">₹{stateReceived.toLocaleString("en-IN")}</div>
            <span className="text-[10px] text-indigo-700">Pending: ₹{statePending.toLocaleString("en-IN")}</span>
          </div>
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
            <span className="text-[11px] font-semibold text-purple-800 uppercase">Total Received</span>
            <div className="text-lg font-extrabold text-purple-950 mt-0.5">₹{totalReceived.toLocaleString("en-IN")}</div>
            <span className="text-[10px] text-purple-700">Due: ₹{totalOutstanding.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* 3. Sub-Tabs Bar */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-200 pb-1 print:hidden scrollbar-none">
        {[
          { id: "overview", label: "Overview", icon: Building2 },
          { id: "personal", label: "Personal Details", icon: User },
          { id: "electricity", label: "Electricity & DISCOM", icon: Zap },
          { id: "meter", label: "Meter & Net Metering", icon: Cpu },
          { id: "installation", label: "Solar Installation (1-20KW)", icon: Sun },
          { id: "payments", label: "Payments Ledger", icon: IndianRupee },
          { id: "loan", label: "Bank Loan", icon: Landmark },
          { id: "subsidy", label: "Subsidy Tracking", icon: ShieldCheck },
          { id: "documents", label: "Documents", icon: FileText },
          { id: "technician", label: "Technician", icon: Wrench },
          { id: "followups", label: "Follow-ups & Contacts", icon: MessageSquare },
          { id: "issues", label: "Issues & Complaints", icon: AlertTriangle },
          { id: "timeline", label: "Timeline History", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as SubTab)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-white shadow"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content */}
      <div className="space-y-6">
        {/* ========================================================= */}
        {/* SUBTAB 1: OVERVIEW */}
        {/* ========================================================= */}
        {activeSubTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> Project Master Summary
                </CardTitle>
                <CardDescription className="text-xs">
                  Unified view of customer requirement, physical location, and current progress.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">Full Address</span>
                    <span className="font-medium text-slate-900">{project.address || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">City & District</span>
                    <span className="font-medium text-slate-900">{project.city}, {project.district || project.state}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">PIN Code</span>
                    <span className="font-medium text-slate-900">{project.pincode || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">Solar Brand</span>
                    <span className="font-semibold text-primary">{project.solarInstallation?.companyName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">Solar Capacity</span>
                    <span className="font-bold text-slate-900">{project.solarInstallation?.capacityKW} KW</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">Installation Status</span>
                    <Badge variant="outline" className="font-semibold text-xs">
                      {project.solarInstallation?.installationStatus}
                    </Badge>
                  </div>
                </div>

                {/* Enquiry Provenance Section */}
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Original Lead / Enquiry Provenance
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Enquiry ID</span>
                      <span className="font-mono font-bold text-slate-900">{project.enquiryId || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Enquiry Date</span>
                      <span className="font-medium text-slate-900">
                        {project.enquiryDate ? new Date(project.enquiryDate).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Lead Source</span>
                      <span className="font-medium text-slate-900">{project.source || "Website"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Initial Quoted Cost</span>
                      <span className="font-bold text-slate-900">₹{totalCost.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Current Discussion / "Kis se baat chal rahi hai" Banner */}
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-blue-600" /> Current Follow-up / Kis Se Baat Chal Rahi Hai
                    </h4>
                    <Badge className="bg-blue-600 text-white text-[10px]">
                      {project.currentFollowUp?.currentFollowUpWith || "CUSTOMER"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-700 italic">
                    "{project.currentFollowUp?.currentDiscussion || "No active discussions logged."}"
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-blue-950 pt-1 border-t border-blue-200/60">
                    <span><strong>Contact Person:</strong> {project.currentFollowUp?.contactPerson || project.customerName}</span>
                    <span><strong>Phone:</strong> {project.currentFollowUp?.phone || project.mobile}</span>
                    <span><strong>Next Follow-up Date:</strong> {project.currentFollowUp?.nextFollowUpDate || "Not Scheduled"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions & Contact Card */}
            <div className="space-y-4">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900">Quick Contact & Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-emerald-700 border-emerald-300 hover:bg-emerald-50 text-xs"
                    onClick={() => {
                      window.open(
                        `https://api.whatsapp.com/send/?phone=91${project.mobile.replace(/[^0-9]/g, "")}&text=Hello+${encodeURIComponent(project.customerName)}%2C+regarding+your+${project.solarInstallation?.capacityKW}KW+Solar+Project+(${project.projectId})+at+Matri+Shakti+Infrastructure...`,
                        "_blank"
                      );
                    }}
                  >
                    <FaWhatsapp className="h-4 w-4 text-emerald-600" /> WhatsApp Customer
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-slate-700 text-xs"
                    onClick={() => window.open(`tel:${project.mobile}`, "_self")}
                  >
                    <Phone className="h-4 w-4 text-primary" /> Call Customer ({project.mobile})
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-xs"
                    onClick={() => setIsPaymentModalOpen(true)}
                  >
                    <IndianRupee className="h-4 w-4 text-indigo-600" /> Record Customer Payment
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-blue-700 border-blue-200 hover:bg-blue-50 text-xs"
                    onClick={() => setIsFollowUpModalOpen(true)}
                  >
                    <MessageSquare className="h-4 w-4 text-blue-600" /> Log Follow-up / Discussion
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-amber-700 border-amber-200 hover:bg-amber-50 text-xs"
                    onClick={() => setIsIssueModalOpen(true)}
                  >
                    <AlertTriangle className="h-4 w-4 text-amber-600" /> Log Issue / Complaint
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-purple-700 border-purple-200 hover:bg-purple-50 text-xs"
                    onClick={() => setIsDocModalOpen(true)}
                  >
                    <FileText className="h-4 w-4 text-purple-600" /> Attach Document
                  </Button>
                </CardContent>
              </Card>

              {/* Progress Checklist Snippet */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Milestone Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Electricity Bill Verified:</span>
                    <Badge variant={project.billVerification?.consumerNumberCorrect === "CORRECT" ? "default" : "outline"} className="text-[10px]">
                      {project.billVerification?.consumerNumberCorrect || "PENDING"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Meter Configuration:</span>
                    <Badge variant={project.meterDetails?.configStatus === "CONFIGURED" ? "default" : "outline"} className="text-[10px]">
                      {project.meterDetails?.configStatus || "NOT_STARTED"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Solar Installation:</span>
                    <Badge variant={project.solarInstallation?.installationStatus === "COMPLETED" ? "default" : "outline"} className="text-[10px]">
                      {project.solarInstallation?.installationStatus || "NOT_SCHEDULED"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Central Subsidy:</span>
                    <Badge variant={project.subsidyTracking?.centralSubsidy?.status === "RECEIVED" ? "default" : "outline"} className="text-[10px]">
                      {project.subsidyTracking?.centralSubsidy?.status || "NOT_APPLIED"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment Status:</span>
                    <Badge variant={project.payments?.paymentStatus === "PAID" ? "default" : "outline"} className="text-[10px]">
                      {project.payments?.paymentStatus || "PENDING"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 2: PERSONAL DETAILS (With Aadhaar/PAN Masking) */}
        {/* ========================================================= */}
        {activeSubTab === "personal" && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Customer Personal & KYC Details
              </CardTitle>
              <CardDescription className="text-xs">
                Aadhaar and PAN details are masked for security. Click unmask to view full details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const data = {
                    customerName: (form.elements.namedItem("customerName") as HTMLInputElement).value,
                    fatherHusbandName: (form.elements.namedItem("fatherHusbandName") as HTMLInputElement).value,
                    mobile: (form.elements.namedItem("mobile") as HTMLInputElement).value,
                    alternateMobile: (form.elements.namedItem("alternateMobile") as HTMLInputElement).value,
                    whatsapp: (form.elements.namedItem("whatsapp") as HTMLInputElement).value,
                    email: (form.elements.namedItem("email") as HTMLInputElement).value,
                    aadhaarNumber: (form.elements.namedItem("aadhaarNumber") as HTMLInputElement).value,
                    panNumber: (form.elements.namedItem("panNumber") as HTMLInputElement).value,
                    address: (form.elements.namedItem("address") as HTMLInputElement).value,
                    city: (form.elements.namedItem("city") as HTMLInputElement).value,
                    district: (form.elements.namedItem("district") as HTMLInputElement).value,
                    state: (form.elements.namedItem("state") as HTMLInputElement).value,
                    pincode: (form.elements.namedItem("pincode") as HTMLInputElement).value,
                  };
                  handleSaveSection("personal", data, "Personal details saved");
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Customer Name *</label>
                    <Input name="customerName" defaultValue={project.customerName} required className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Father / Husband Name</label>
                    <Input name="fatherHusbandName" defaultValue={project.fatherHusbandName} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Mobile Number *</label>
                    <Input name="mobile" defaultValue={project.mobile} required className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Alternate Mobile</label>
                    <Input name="alternateMobile" defaultValue={project.alternateMobile} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">WhatsApp Number</label>
                    <Input name="whatsapp" defaultValue={project.whatsapp} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Email Address</label>
                    <Input name="email" defaultValue={project.email} className="mt-1" />
                  </div>

                  {/* Masked Aadhaar Field */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">Aadhaar Number</label>
                      <button
                        type="button"
                        onClick={() => setShowAadhaar(!showAadhaar)}
                        className="text-[11px] font-semibold text-primary flex items-center gap-1 hover:underline"
                      >
                        {showAadhaar ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {showAadhaar ? "Mask" : "Unmask"}
                      </button>
                    </div>
                    <Input
                      name="aadhaarNumber"
                      type={showAadhaar ? "text" : "password"}
                      defaultValue={project.aadhaarNumber}
                      placeholder="12 Digit Aadhaar"
                      className="mt-1 font-mono"
                    />
                    <span className="text-[10px] text-slate-500">
                      Current: {maskAadhaar(project.aadhaarNumber)}
                    </span>
                  </div>

                  {/* Masked PAN Field */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">PAN Number</label>
                      <button
                        type="button"
                        onClick={() => setShowPan(!showPan)}
                        className="text-[11px] font-semibold text-primary flex items-center gap-1 hover:underline"
                      >
                        {showPan ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {showPan ? "Mask" : "Unmask"}
                      </button>
                    </div>
                    <Input
                      name="panNumber"
                      type={showPan ? "text" : "password"}
                      defaultValue={project.panNumber}
                      placeholder="10 Character PAN"
                      className="mt-1 font-mono uppercase"
                    />
                    <span className="text-[10px] text-slate-500">
                      Current: {maskPan(project.panNumber)}
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">PIN Code</label>
                    <Input name="pincode" defaultValue={project.pincode} className="mt-1" />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs font-semibold text-slate-700">Installation Address</label>
                    <Input name="address" defaultValue={project.address} className="mt-1" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">City / Tehsil *</label>
                    <Input name="city" defaultValue={project.city} required className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">District</label>
                    <Input name="district" defaultValue={project.district} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">State</label>
                    <Input name="state" defaultValue={project.state || "Uttar Pradesh"} className="mt-1" />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <Button type="submit" disabled={isSaving} className="bg-primary text-white">
                    Save Personal Details
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 3: ELECTRICITY & DISCOM DETAILS */}
        {/* ========================================================= */}
        {activeSubTab === "electricity" && (
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" /> Electricity Department / DISCOM Connection Details
                </CardTitle>
                <CardDescription className="text-xs">
                  Official connection records for UP Discom (PVVNL, MVVNL, DVVNL, PuVVNL) net-metering synchronization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const discomDetails = {
                      discomName: (form.elements.namedItem("discomName") as HTMLInputElement).value,
                      division: (form.elements.namedItem("division") as HTMLInputElement).value,
                      subDivision: (form.elements.namedItem("subDivision") as HTMLInputElement).value,
                      officeLocation: (form.elements.namedItem("officeLocation") as HTMLInputElement).value,
                      officeAddress: (form.elements.namedItem("officeAddress") as HTMLInputElement).value,
                      contactPerson: (form.elements.namedItem("contactPerson") as HTMLInputElement).value,
                      contactNumber: (form.elements.namedItem("contactNumber") as HTMLInputElement).value,
                      consumerName: (form.elements.namedItem("consumerName") as HTMLInputElement).value,
                      consumerNumber: (form.elements.namedItem("consumerNumber") as HTMLInputElement).value,
                      connectionNumber: (form.elements.namedItem("connectionNumber") as HTMLInputElement).value,
                      accountNumber: (form.elements.namedItem("accountNumber") as HTMLInputElement).value,
                      meterNumber: (form.elements.namedItem("meterNumber") as HTMLInputElement).value,
                      billNumber: (form.elements.namedItem("billNumber") as HTMLInputElement).value,
                      latestBillDate: (form.elements.namedItem("latestBillDate") as HTMLInputElement).value,
                      currentBillAmount: parseFloat((form.elements.namedItem("currentBillAmount") as HTMLInputElement).value) || 0,
                      connectionType: (form.elements.namedItem("connectionType") as HTMLSelectElement).value,
                      sanctionedLoad: (form.elements.namedItem("sanctionedLoad") as HTMLInputElement).value,
                      existingLoad: (form.elements.namedItem("existingLoad") as HTMLInputElement).value,
                    };
                    handleSaveSection("discomDetails", discomDetails, "Electricity details saved");
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">DISCOM Name</label>
                      <Input name="discomName" defaultValue={project.discomDetails?.discomName || "Purvanchal Vidyut Vitaran Nigam Ltd (PVVNL)"} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Electricity Division</label>
                      <Input name="division" defaultValue={project.discomDetails?.division} placeholder="e.g. Maharajganj Division" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Sub-Division</label>
                      <Input name="subDivision" defaultValue={project.discomDetails?.subDivision} placeholder="e.g. Paniyara Sub-Division" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Consumer Name (On Bill)</label>
                      <Input name="consumerName" defaultValue={project.discomDetails?.consumerName || project.customerName} className="mt-1 font-medium" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Consumer Number / Account ID *</label>
                      <Input name="consumerNumber" defaultValue={project.discomDetails?.consumerNumber} className="mt-1 font-mono font-bold text-primary" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Connection Number</label>
                      <Input name="connectionNumber" defaultValue={project.discomDetails?.connectionNumber} className="mt-1 font-mono" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Meter Number</label>
                      <Input name="meterNumber" defaultValue={project.discomDetails?.meterNumber} className="mt-1 font-mono" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Latest Bill Number</label>
                      <Input name="billNumber" defaultValue={project.discomDetails?.billNumber} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Current Bill Amount (₹)</label>
                      <Input name="currentBillAmount" type="number" defaultValue={project.discomDetails?.currentBillAmount || 0} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Sanctioned Load</label>
                      <Input name="sanctionedLoad" defaultValue={project.discomDetails?.sanctionedLoad} placeholder="e.g. 5 KW / 3 Phase" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Connection Type</label>
                      <select name="connectionType" defaultValue={project.discomDetails?.connectionType || "Domestic"} className="w-full mt-1 h-9 rounded-md border border-slate-200 bg-white px-3 text-xs">
                        <option value="Domestic">Domestic (LMV-1)</option>
                        <option value="Commercial">Commercial (LMV-2)</option>
                        <option value="Industrial">Industrial (LMV-6)</option>
                        <option value="Agricultural">Agricultural (LMV-5)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Office Contact Person & Phone</label>
                      <Input name="contactPerson" defaultValue={project.discomDetails?.contactPerson} placeholder="JE / SDO Name & Phone" className="mt-1" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <Button type="submit" disabled={isSaving} className="bg-primary text-white">
                      Save DISCOM Details
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Bill Verification Checklist & Name Correction */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Electricity Bill Verification Checklist */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> Electricity Bill Verification Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { key: "nameCorrect", label: "Name Matches Customer KYC" },
                    { key: "consumerNumberCorrect", label: "Consumer Number Validated" },
                    { key: "addressCorrect", label: "Installation Address Matches Bill" },
                    { key: "billNumberCorrect", label: "Bill Number Verified with DISCOM" },
                    { key: "aadhaarDetailsCorrect", label: "Aadhaar Linked with Connection" },
                    { key: "panDetailsCorrect", label: "PAN Details Verified" },
                    { key: "connectionDetailsCorrect", label: "Sanctioned Load Adequate for Solar" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                      <span className="text-slate-700 font-medium">{item.label}</span>
                      <select
                        defaultValue={(project.billVerification as any)?.[item.key] || "PENDING"}
                        onChange={(e) => {
                          const updated = { ...project.billVerification, [item.key]: e.target.value };
                          handleSaveSection("billVerification", updated, `${item.label} updated`);
                        }}
                        className="h-7 rounded border border-slate-200 bg-white px-2 text-[11px] font-semibold"
                      >
                        <option value="CORRECT">CORRECT</option>
                        <option value="INCORRECT">INCORRECT</option>
                        <option value="PENDING">PENDING</option>
                        <option value="NOT_APPLICABLE">N/A</option>
                      </select>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Name Correction Tracking */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-600" /> Name Correction Tracking
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Track DISCOM electricity bill name correction for subsidy eligibility.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const nameCorrection = {
                        required: (form.elements.namedItem("nameCorrectionRequired") as HTMLSelectElement).value === "YES",
                        submitted: (form.elements.namedItem("nameCorrectionSubmitted") as HTMLSelectElement).value === "YES",
                        status: (form.elements.namedItem("nameCorrectionStatus") as HTMLSelectElement).value,
                        correctionAppNumber: (form.elements.namedItem("correctionAppNumber") as HTMLInputElement).value,
                        deptOffice: (form.elements.namedItem("deptOffice") as HTMLInputElement).value,
                        submissionDate: (form.elements.namedItem("submissionDate") as HTMLInputElement).value,
                        completedDate: (form.elements.namedItem("completedDate") as HTMLInputElement).value,
                        remarks: (form.elements.namedItem("remarks") as HTMLInputElement).value,
                      };
                      handleSaveSection("nameCorrection", nameCorrection, "Name correction details updated");
                    }}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700">Name Correction Required?</label>
                        <select name="nameCorrectionRequired" defaultValue={project.nameCorrection?.required ? "YES" : "NO"} className="w-full mt-1 h-8 rounded border border-slate-200 bg-white px-2">
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Current Status</label>
                        <select name="nameCorrectionStatus" defaultValue={project.nameCorrection?.status || "NOT_REQUIRED"} className="w-full mt-1 h-8 rounded border border-slate-200 bg-white px-2 font-bold">
                          <option value="NOT_REQUIRED">NOT_REQUIRED</option>
                          <option value="PENDING">PENDING</option>
                          <option value="SUBMITTED">SUBMITTED</option>
                          <option value="UNDER_PROCESS">UNDER_PROCESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Application Number</label>
                        <Input name="correctionAppNumber" defaultValue={project.nameCorrection?.correctionAppNumber} className="h-8 mt-1" />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Department Office</label>
                        <Input name="deptOffice" defaultValue={project.nameCorrection?.deptOffice} className="h-8 mt-1" />
                      </div>
                      <div className="col-span-2">
                        <label className="font-semibold text-slate-700">Remarks</label>
                        <Input name="remarks" defaultValue={project.nameCorrection?.remarks} placeholder="Notes regarding name correction process" className="h-8 mt-1" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <Button type="submit" size="sm" className="bg-primary text-white text-xs">
                        Update Name Correction
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 4: METER & NET METERING */}
        {/* ========================================================= */}
        {activeSubTab === "meter" && (
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" /> Meter Details & Bi-Directional Configuration
                </CardTitle>
                <CardDescription className="text-xs">
                  Existing consumer meter verification and DISCOM solar bi-directional net-meter configuration tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const meterDetails = {
                      ...project.meterDetails,
                      existingMeterType: (form.elements.namedItem("existingMeterType") as HTMLSelectElement).value,
                      meterNumber: (form.elements.namedItem("meterNumber") as HTMLInputElement).value,
                      meterReading: (form.elements.namedItem("meterReading") as HTMLInputElement).value,
                      meterStatus: (form.elements.namedItem("meterStatus") as HTMLInputElement).value,
                      configStatus: (form.elements.namedItem("configStatus") as HTMLSelectElement).value,
                      configRefNumber: (form.elements.namedItem("configRefNumber") as HTMLInputElement).value,
                      configDate: (form.elements.namedItem("configDate") as HTMLInputElement).value,
                      remarks: (form.elements.namedItem("remarks") as HTMLInputElement).value,
                    };
                    handleSaveSection("meterDetails", meterDetails, "Meter configuration updated");
                  }}
                  className="space-y-4 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700">Existing Meter Type</label>
                      <select name="existingMeterType" defaultValue={project.meterDetails?.existingMeterType || "Smart Meter"} className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2">
                        <option value="Old Meter">Old Meter (Mechanical / Electromechanical)</option>
                        <option value="Smart Meter">Smart Meter (Bi-Directional Ready)</option>
                        <option value="New Meter">New Meter (Electronic Digital)</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Meter Number</label>
                      <Input name="meterNumber" defaultValue={project.meterDetails?.meterNumber} className="mt-1 font-mono" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Initial Meter Reading (KWh)</label>
                      <Input name="meterReading" defaultValue={project.meterDetails?.meterReading} className="mt-1 font-mono" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Solar Net-Meter Config Status *</label>
                      <select name="configStatus" defaultValue={project.meterDetails?.configStatus || "NOT_STARTED"} className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2 font-bold text-primary">
                        <option value="NOT_STARTED">NOT_STARTED</option>
                        <option value="APPLIED">APPLIED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIGURED">CONFIGURED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Configuration Reference / Application No.</label>
                      <Input name="configRefNumber" defaultValue={project.meterDetails?.configRefNumber} className="mt-1 font-mono" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Configuration / Replacement Date</label>
                      <Input name="configDate" type="date" defaultValue={project.meterDetails?.configDate} className="mt-1" />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="font-semibold text-slate-700">Department Office Remarks</label>
                      <Input name="remarks" defaultValue={project.meterDetails?.remarks} placeholder="Remarks from DISCOM JE / Meter Testing Laboratory" className="mt-1" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isSaving} className="bg-primary text-white">
                      Save Meter Configuration
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Post-Installation 7 Verification Checks */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Post-Installation Meter & Generation Verification
                </CardTitle>
                <CardDescription className="text-xs">
                  Verify that solar panels, bi-directional net-meter, and solar export generation are functioning correctly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {[
                    { key: "panelInstalled", label: "Solar Panels Installed Successfully" },
                    { key: "meterConfigured", label: "Bi-Directional Meter Configured" },
                    { key: "meterWorkingCorrectly", label: "Meter Working Correctly" },
                    { key: "meterReadingCorrect", label: "Meter Reading Displaying OK" },
                    { key: "solarGenerationShowing", label: "Solar Generation Showing (Export KWh)" },
                    { key: "netMeteringWorking", label: "Net Metering Active & Exporting" },
                    { key: "billCorrectAfterInstallation", label: "Electricity Bill Correct Post-Solar" },
                  ].map((check) => {
                    const isChecked = Boolean((project.meterDetails as any)?.[check.key]);
                    return (
                      <div
                        key={check.key}
                        onClick={() => {
                          const updated = {
                            ...project.meterDetails,
                            [check.key]: !isChecked,
                          };
                          handleSaveSection("meterDetails", updated, `${check.label} updated`);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          isChecked
                            ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span>{check.label}</span>
                        <Badge className={isChecked ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}>
                          {isChecked ? "YES" : "NO"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Meter Photos & Inspection Documents Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-sky-600" /> Bi-Directional Net-Meter Documents & Inspection Photos
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Upload net-meter photo, DISCOM testing lab report, seal verification document, and clearance certificates.
                  </CardDescription>
                </div>
                <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white gap-1 text-xs" onClick={() => setIsMeterFileModalOpen(true)}>
                  <Plus className="h-3.5 w-3.5" /> ➕ Upload Meter File / Photo
                </Button>
              </CardHeader>
              <CardContent>
                {(() => {
                  const meterDocs = (project.documents || []).filter(
                    (d) => d.docType?.includes("Meter") || d.name?.toLowerCase().includes("meter")
                  );
                  const hasPhoto = Boolean(project.meterDetails?.meterPhoto);

                  if (meterDocs.length === 0 && !hasPhoto) {
                    return (
                      <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                        Abhi tak koi meter photo ya testing report upload nahi hui hai. Upar "Upload Meter File" button dabayein.
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      {hasPhoto && (
                        <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 shadow-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-sky-600 text-white text-[10px]">Net-Meter Photo</Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteMeterFile("meterPhoto")}
                              disabled={isSaving}
                              className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                              title="Delete meter photo"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div className="h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                            <img src={project.meterDetails?.meterPhoto} alt="Meter" className="h-full w-full object-cover" />
                          </div>
                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <span className="font-mono text-slate-600 font-bold">{project.meterDetails?.meterNumber || "Smart Meter"}</span>
                            <a href={project.meterDetails?.meterPhoto} target="_blank" rel="noreferrer" className="text-sky-700 font-bold hover:underline">
                              View Full ➔
                            </a>
                          </div>
                        </div>
                      )}

                      {meterDocs.map((doc) => (
                        <div key={doc.id} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[10px] border-sky-300 text-sky-800 bg-sky-50">{doc.docType}</Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteMeterFile(doc.id)}
                              disabled={isSaving}
                              className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                              title="Delete meter document"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <h4 className="font-bold text-slate-800 truncate">{doc.name}</h4>
                          <p className="text-[11px] text-slate-400">{new Date(doc.uploadDate).toLocaleDateString()}</p>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                            <span className="text-slate-500 truncate max-w-[140px]">{doc.notes || "Inspection file"}</span>
                            <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline">
                              View ➔
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 5: SOLAR INSTALLATION (1-20 KW) & QUALITY CHECKLIST */}
        {/* ========================================================= */}
        {activeSubTab === "installation" && (
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sun className="h-4 w-4 text-primary" /> Solar Rooftop System Specifications (1 KW – 20 KW)
                </CardTitle>
                <CardDescription className="text-xs">
                  Hardware configuration, panel count, inverter specifications, structure, and physical installation status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const solarInstallation = {
                      ...project.solarInstallation,
                      companyName: (form.elements.namedItem("companyName") as HTMLInputElement).value,
                      capacityKW: parseInt((form.elements.namedItem("capacityKW") as HTMLSelectElement).value, 10) || 5,
                      panelWattage: parseInt((form.elements.namedItem("panelWattage") as HTMLInputElement).value, 10) || 550,
                      panelCount: parseInt((form.elements.namedItem("panelCount") as HTMLInputElement).value, 10) || 10,
                      inverterBrand: (form.elements.namedItem("inverterBrand") as HTMLInputElement).value,
                      inverterModel: (form.elements.namedItem("inverterModel") as HTMLInputElement).value,
                      inverterSerialNumber: (form.elements.namedItem("inverterSerialNumber") as HTMLInputElement).value,
                      structureType: (form.elements.namedItem("structureType") as HTMLInputElement).value,
                      technician: (form.elements.namedItem("technician") as HTMLInputElement).value,
                      installationTeam: (form.elements.namedItem("installationTeam") as HTMLInputElement).value,
                      installationStatus: (form.elements.namedItem("installationStatus") as HTMLSelectElement).value,
                    };
                    handleSaveSection("solarInstallation", solarInstallation, "Solar installation details saved");
                  }}
                  className="space-y-4 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700">Solar Brand / Company *</label>
                      <Input name="companyName" defaultValue={project.solarInstallation?.companyName || "Tata Power Solar"} className="mt-1 font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Capacity (1 KW – 20 KW) *</label>
                      <select name="capacityKW" defaultValue={project.solarInstallation?.capacityKW || 5} className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2 font-bold text-primary">
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((kw) => (
                          <option key={kw} value={kw}>{kw} KW Solar Rooftop Package</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Installation Status *</label>
                      <select name="installationStatus" defaultValue={project.solarInstallation?.installationStatus || "NOT_SCHEDULED"} className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2 font-bold">
                        <option value="NOT_SCHEDULED">NOT_SCHEDULED</option>
                        <option value="SCHEDULED">SCHEDULED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="INSPECTION_PENDING">INSPECTION_PENDING</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Panel Wattage (e.g. 550W)</label>
                      <Input name="panelWattage" type="number" defaultValue={project.solarInstallation?.panelWattage || 550} className="mt-1" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Number of Panels</label>
                      <Input name="panelCount" type="number" defaultValue={project.solarInstallation?.panelCount || 10} className="mt-1" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Inverter Brand</label>
                      <Input name="inverterBrand" defaultValue={project.solarInstallation?.inverterBrand || "Solis"} className="mt-1" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Inverter Model</label>
                      <Input name="inverterModel" defaultValue={project.solarInstallation?.inverterModel} className="mt-1" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Inverter Serial Number</label>
                      <Input name="inverterSerialNumber" defaultValue={project.solarInstallation?.inverterSerialNumber} className="mt-1 font-mono" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Structure Type</label>
                      <Input name="structureType" defaultValue={project.solarInstallation?.structureType || "Hot Dip Galvanized Rooftop Structure"} className="mt-1" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Assigned Technician</label>
                      <Input name="technician" defaultValue={project.solarInstallation?.technician} placeholder="Lead Engineer / Technician" className="mt-1 font-medium" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Installation Team</label>
                      <Input name="installationTeam" defaultValue={project.solarInstallation?.installationTeam} placeholder="Team A / Contractor" className="mt-1" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isSaving} className="bg-primary text-white">
                      Save Installation Specs
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* 12-point Quality Checklist */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> 12-Point Installation Quality Checklist
                </CardTitle>
                <CardDescription className="text-xs">
                  Physical and electrical safety standards verified before customer handover.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {[
                    { key: "panelsInstalled", label: "1. Panels Securely Mounted" },
                    { key: "structureInstalled", label: "2. HDG Structure Rust-Proofed" },
                    { key: "inverterInstalled", label: "3. Inverter Mounted & Weatherproof" },
                    { key: "dcWiringComplete", label: "4. DC Solar Cabling in Conduit" },
                    { key: "acWiringComplete", label: "5. AC Distribution Box Connected" },
                    { key: "earthingComplete", label: "6. Dual Earthing (AC & DC) Verified" },
                    { key: "lightningProtection", label: "7. Lightning Arrester Installed" },
                    { key: "safetyCheck", label: "8. MCB / Isolator Safety Tested" },
                    { key: "inverterCommissioned", label: "9. Inverter Synchronized with Grid" },
                    { key: "generationTested", label: "10. Peak Solar Generation Tested" },
                    { key: "meterProcessStarted", label: "11. Net Metering Inspection Initiated" },
                    { key: "customerHandoverComplete", label: "12. Warranty & Handover Kit Provided" },
                  ].map((item) => {
                    const statusVal = project.solarInstallation?.checklist?.[item.key] || "PENDING";
                    return (
                      <div key={item.key} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                        <span className="font-medium text-slate-800">{item.label}</span>
                        <select
                          value={statusVal}
                          onChange={(e) => {
                            const updatedChecklist = {
                              ...(project.solarInstallation?.checklist || {}),
                              [item.key]: e.target.value,
                            };
                            const updatedInstallation = {
                              ...project.solarInstallation,
                              checklist: updatedChecklist,
                            };
                            handleSaveSection("solarInstallation", updatedInstallation, `${item.label} updated`);
                          }}
                          className={`h-7 rounded border px-1.5 text-[11px] font-bold ${
                            statusVal === "DONE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="DONE">DONE</option>
                          <option value="NOT_APPLICABLE">N/A</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 6: PAYMENTS LEDGER */}
        {/* ========================================================= */}
        {activeSubTab === "payments" && (
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-emerald-600" /> Customer Payment Ledger & Transactions
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Record customer down-payments, milestone advances, and view live remaining balance.
                  </CardDescription>
                </div>
                <Button size="sm" className="bg-primary text-white gap-1 text-xs" onClick={() => setIsPaymentModalOpen(true)}>
                  <Plus className="h-3.5 w-3.5" /> Record Payment
                </Button>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Payment Status Dropdown with Requested Options */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Current Payment Status (Bhugtan Sthiti):</span>
                    <p className="text-[11px] text-slate-500">Live payment state according to bank & customer cash/UPI settlement</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={project.payments?.paymentStatus || "Pending"}
                      onChange={(e) => handleUpdatePaymentStatus(e.target.value)}
                      disabled={isSaving}
                      className="h-8 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-800 shadow-sm"
                    >
                      <option value="Payment Done">✅ Payment Done</option>
                      <option value="Pending">⏳ Pending</option>
                      <option value="Not Given">❌ Not Given</option>
                      <option value="Other">⚠️ Other</option>
                    </select>
                    <Badge className={
                      project.payments?.paymentStatus === "Payment Done" || project.payments?.paymentStatus === "PAID"
                        ? "bg-emerald-600 text-white text-[11px]"
                        : project.payments?.paymentStatus === "Not Given"
                        ? "bg-red-600 text-white text-[11px]"
                        : "bg-amber-500 text-white text-[11px]"
                    }>
                      {project.payments?.paymentStatus || "Pending"}
                    </Badge>
                  </div>
                </div>

                {/* Cost Adjustment Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const payments = {
                      ...project.payments,
                      totalProjectCost: parseFloat((form.elements.namedItem("totalProjectCost") as HTMLInputElement).value) || 0,
                      customerContribution: parseFloat((form.elements.namedItem("customerContribution") as HTMLInputElement).value) || 0,
                      subsidyExpected: parseFloat((form.elements.namedItem("subsidyExpected") as HTMLInputElement).value) || 0,
                    };
                    handleSaveSection("payments", payments, "Cost structure updated");
                  }}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs items-end"
                >
                  <div>
                    <label className="font-semibold text-slate-700">Total Project Cost (₹)</label>
                    <Input name="totalProjectCost" type="number" defaultValue={project.payments?.totalProjectCost || 0} className="mt-1 font-bold" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Subsidy Expected (₹)</label>
                    <Input name="subsidyExpected" type="number" defaultValue={project.payments?.subsidyExpected || 0} className="mt-1 font-bold" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Net Customer Contribution (₹)</label>
                    <Input name="customerContribution" type="number" defaultValue={project.payments?.customerContribution || 0} className="mt-1 font-bold" />
                  </div>
                  <Button type="submit" size="sm" variant="outline" className="text-xs font-bold">
                    Save Cost Structure
                  </Button>
                </form>

                {/* Transactions Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100/75 text-slate-700 uppercase font-semibold text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Mode</th>
                        <th className="py-2.5 px-3">Transaction / Ref ID</th>
                        <th className="py-2.5 px-3">Receipt No</th>
                        <th className="py-2.5 px-3">Notes</th>
                        <th className="py-2.5 px-3 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {project.payments?.transactions && project.payments.transactions.length > 0 ? (
                        project.payments.transactions.map((txn) => (
                          <tr key={txn.id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-medium">{txn.paymentDate}</td>
                            <td className="py-2.5 px-3 font-extrabold text-emerald-700">₹{txn.amount.toLocaleString("en-IN")}</td>
                            <td className="py-2.5 px-3">
                              <Badge variant="outline" className="text-[10px]">{txn.paymentMode}</Badge>
                            </td>
                            <td className="py-2.5 px-3 font-mono">{txn.transactionId || "—"}</td>
                            <td className="py-2.5 px-3">{txn.receiptNumber || "—"}</td>
                            <td className="py-2.5 px-3 text-slate-600">{txn.notes || "—"}</td>
                            <td className="py-2.5 px-3 text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeletePayment(txn.id)}
                                disabled={isSaving}
                                className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                title="Delete this payment transaction"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-slate-400">
                            No payment transactions recorded yet. Click "Record Payment" to add customer advance.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 7: BANK LOAN */}
        {/* ========================================================= */}
        {activeSubTab === "loan" && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Landmark className="h-4 w-4 text-blue-600" /> Bank Solar Loan & Disbursement Tracking
              </CardTitle>
              <CardDescription className="text-xs">
                Track nationalized & private bank solar loans (SBI Surya Ghar, Canara Bank, PNB, etc.).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const bankLoan = {
                    loanRequired: (form.elements.namedItem("loanRequired") as HTMLSelectElement).value === "YES",
                    loanStatus: (form.elements.namedItem("loanStatus") as HTMLSelectElement).value,
                    bankName: (form.elements.namedItem("bankName") as HTMLInputElement).value,
                    branchName: (form.elements.namedItem("branchName") as HTMLInputElement).value,
                    loanAppNumber: (form.elements.namedItem("loanAppNumber") as HTMLInputElement).value,
                    loanAmountApplied: parseFloat((form.elements.namedItem("loanAmountApplied") as HTMLInputElement).value) || 0,
                    loanAmountApproved: parseFloat((form.elements.namedItem("loanAmountApproved") as HTMLInputElement).value) || 0,
                    loanAmountDisbursed: parseFloat((form.elements.namedItem("loanAmountDisbursed") as HTMLInputElement).value) || 0,
                    firstDisbursement: parseFloat((form.elements.namedItem("firstDisbursement") as HTMLInputElement).value) || 0,
                    secondDisbursement: parseFloat((form.elements.namedItem("secondDisbursement") as HTMLInputElement).value) || 0,
                    nextExpectedPayment: parseFloat((form.elements.namedItem("nextExpectedPayment") as HTMLInputElement).value) || 0,
                    nextPaymentDate: (form.elements.namedItem("nextPaymentDate") as HTMLInputElement).value,
                    emi: parseFloat((form.elements.namedItem("emi") as HTMLInputElement).value) || 0,
                    loanTenure: (form.elements.namedItem("loanTenure") as HTMLInputElement).value,
                    interestRate: (form.elements.namedItem("interestRate") as HTMLInputElement).value,
                    loanOfficerName: (form.elements.namedItem("loanOfficerName") as HTMLInputElement).value,
                    loanOfficerPhone: (form.elements.namedItem("loanOfficerPhone") as HTMLInputElement).value,
                  };
                  handleSaveSection("bankLoan", bankLoan, "Bank loan details updated");
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700">Bank Loan Required?</label>
                    <select name="loanRequired" defaultValue={project.bankLoan?.loanRequired ? "YES" : "NO"} className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2">
                      <option value="NO">NO (Self Funded)</option>
                      <option value="YES">YES (Bank Loan)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Loan Status *</label>
                    <select name="loanStatus" defaultValue={project.bankLoan?.loanStatus || "NOT_REQUIRED"} className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2 font-bold text-blue-900">
                      <option value="NOT_REQUIRED">NOT_REQUIRED</option>
                      <option value="APPLICATION_PENDING">APPLICATION_PENDING</option>
                      <option value="DOCUMENT_PENDING">DOCUMENT_PENDING</option>
                      <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="PARTIALLY_DISBURSED">PARTIALLY_DISBURSED</option>
                      <option value="FULLY_DISBURSED">FULLY_DISBURSED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Bank Name</label>
                    <Input name="bankName" defaultValue={project.bankLoan?.bankName} placeholder="e.g. State Bank of India (SBI)" className="mt-1" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Branch Name & Address</label>
                    <Input name="branchName" defaultValue={project.bankLoan?.branchName} placeholder="e.g. Paniyara Branch" className="mt-1" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Loan Application Number</label>
                    <Input name="loanAppNumber" defaultValue={project.bankLoan?.loanAppNumber} className="mt-1 font-mono" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Loan Amount Applied (₹)</label>
                    <Input name="loanAmountApplied" type="number" defaultValue={project.bankLoan?.loanAmountApplied || 0} className="mt-1" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Loan Amount Approved (₹)</label>
                    <Input name="loanAmountApproved" type="number" defaultValue={project.bankLoan?.loanAmountApproved || 0} className="mt-1 font-bold text-emerald-800" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Total Loan Disbursed (₹)</label>
                    <Input name="loanAmountDisbursed" type="number" defaultValue={project.bankLoan?.loanAmountDisbursed || 0} className="mt-1 font-bold text-blue-900" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Next Expected Payment (₹)</label>
                    <Input name="nextExpectedPayment" type="number" defaultValue={project.bankLoan?.nextExpectedPayment || 0} className="mt-1" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Next Payment Date</label>
                    <Input name="nextPaymentDate" type="date" defaultValue={project.bankLoan?.nextPaymentDate} className="mt-1" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Monthly EMI (₹)</label>
                    <Input name="emi" type="number" defaultValue={project.bankLoan?.emi || 0} className="mt-1" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Loan Officer Name & Phone</label>
                    <Input name="loanOfficerName" defaultValue={project.bankLoan?.loanOfficerName} placeholder="Manager / Field Officer" className="mt-1" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSaving} className="bg-primary text-white">
                    Save Bank Loan Details
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 8: SUBSIDY TRACKING (Central + State) */}
        {/* ========================================================= */}
        {activeSubTab === "subsidy" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Central Subsidy (PM Surya Ghar) */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-amber-600" /> Central Government Subsidy (MNRE)
                    </CardTitle>
                    <Badge className="bg-amber-600 text-white text-[10px]">
                      {project.subsidyTracking?.centralSubsidy?.status || "NOT_APPLIED"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Up to ₹78,000 direct DBT subsidy deposited into consumer bank account.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const centralSubsidy = {
                        applied: (form.elements.namedItem("applied") as HTMLSelectElement).value === "YES",
                        status: (form.elements.namedItem("status") as HTMLSelectElement).value,
                        appNumber: (form.elements.namedItem("appNumber") as HTMLInputElement).value,
                        expectedAmount: parseFloat((form.elements.namedItem("expectedAmount") as HTMLInputElement).value) || 0,
                        receivedAmount: parseFloat((form.elements.namedItem("receivedAmount") as HTMLInputElement).value) || 0,
                        receivedDate: (form.elements.namedItem("receivedDate") as HTMLInputElement).value,
                      };
                      const updatedSubsidy = { ...project.subsidyTracking, centralSubsidy };
                      handleSaveSection("subsidyTracking", updatedSubsidy, "Central subsidy updated");
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700">Applied on Portal?</label>
                        <select name="applied" defaultValue={project.subsidyTracking?.centralSubsidy?.applied ? "YES" : "NO"} className="w-full mt-1 h-8 rounded border border-slate-200 bg-white px-2">
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Subsidy Status</label>
                        <select name="status" defaultValue={project.subsidyTracking?.centralSubsidy?.status || "NOT_APPLIED"} className="w-full mt-1 h-8 rounded border border-slate-200 bg-white px-2 font-bold">
                          <option value="NOT_APPLIED">NOT_APPLIED</option>
                          <option value="APPLIED">APPLIED</option>
                          <option value="UNDER_PROCESS">UNDER_PROCESS</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="RECEIVED">RECEIVED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Application Number</label>
                        <Input name="appNumber" defaultValue={project.subsidyTracking?.centralSubsidy?.appNumber} className="h-8 mt-1 font-mono" />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Expected Amount (₹)</label>
                        <Input name="expectedAmount" type="number" defaultValue={project.subsidyTracking?.centralSubsidy?.expectedAmount || 78000} className="h-8 mt-1 font-bold" />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Received Amount (₹)</label>
                        <Input name="receivedAmount" type="number" defaultValue={project.subsidyTracking?.centralSubsidy?.receivedAmount || 0} className="h-8 mt-1 font-bold text-emerald-800" />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Received Date</label>
                        <Input name="receivedDate" type="date" defaultValue={project.subsidyTracking?.centralSubsidy?.receivedDate} className="h-8 mt-1" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <Button type="submit" size="sm" className="bg-primary text-white text-xs">
                        Save Central Subsidy
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* UP State Subsidy (UPNEDA) */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-indigo-600" /> UP State Government Subsidy (UPNEDA)
                    </CardTitle>
                    <Badge className="bg-indigo-600 text-white text-[10px]">
                      {project.subsidyTracking?.stateSubsidy?.status || "NOT_APPLIED"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Up to ₹30,000 state incentive credited under Uttar Pradesh Solar Policy.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const stateSubsidy = {
                        applied: (form.elements.namedItem("applied") as HTMLSelectElement).value === "YES",
                        status: (form.elements.namedItem("status") as HTMLSelectElement).value,
                        appNumber: (form.elements.namedItem("appNumber") as HTMLInputElement).value,
                        expectedAmount: parseFloat((form.elements.namedItem("expectedAmount") as HTMLInputElement).value) || 0,
                        receivedAmount: parseFloat((form.elements.namedItem("receivedAmount") as HTMLInputElement).value) || 0,
                        receivedDate: (form.elements.namedItem("receivedDate") as HTMLInputElement).value,
                      };
                      const updatedSubsidy = { ...project.subsidyTracking, stateSubsidy };
                      handleSaveSection("subsidyTracking", updatedSubsidy, "State subsidy updated");
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700">Applied with UPNEDA?</label>
                        <select name="applied" defaultValue={project.subsidyTracking?.stateSubsidy?.applied ? "YES" : "NO"} className="w-full mt-1 h-8 rounded border border-slate-200 bg-white px-2">
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Subsidy Status</label>
                        <select name="status" defaultValue={project.subsidyTracking?.stateSubsidy?.status || "NOT_APPLIED"} className="w-full mt-1 h-8 rounded border border-slate-200 bg-white px-2 font-bold">
                          <option value="NOT_APPLIED">NOT_APPLIED</option>
                          <option value="APPLIED">APPLIED</option>
                          <option value="UNDER_PROCESS">UNDER_PROCESS</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="RECEIVED">RECEIVED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Application Number</label>
                        <Input name="appNumber" defaultValue={project.subsidyTracking?.stateSubsidy?.appNumber} className="h-8 mt-1 font-mono" />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Expected Amount (₹)</label>
                        <Input name="expectedAmount" type="number" defaultValue={project.subsidyTracking?.stateSubsidy?.expectedAmount || 30000} className="h-8 mt-1 font-bold" />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Received Amount (₹)</label>
                        <Input name="receivedAmount" type="number" defaultValue={project.subsidyTracking?.stateSubsidy?.receivedAmount || 0} className="h-8 mt-1 font-bold text-emerald-800" />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">Received Date</label>
                        <Input name="receivedDate" type="date" defaultValue={project.subsidyTracking?.stateSubsidy?.receivedDate} className="h-8 mt-1" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <Button type="submit" size="sm" className="bg-primary text-white text-xs">
                        Save State Subsidy
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 9: DOCUMENTS */}
        {/* ========================================================= */}
        {activeSubTab === "documents" && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" /> Customer & Project Document Vault
                </CardTitle>
                <CardDescription className="text-xs">
                  Secure admin-only storage for KYC, electricity bills, net metering approvals, and receipts.
                </CardDescription>
              </div>
              <Button size="sm" className="bg-primary text-white gap-1 text-xs" onClick={() => setIsDocModalOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> Attach Document
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.documents && project.documents.length > 0 ? (
                  project.documents.map((doc) => (
                    <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] font-semibold">{doc.docType}</Badge>
                        <Badge className={
                          doc.status === "VERIFIED" ? "bg-emerald-600 text-white text-[10px]" :
                          doc.status === "REJECTED" ? "bg-red-600 text-white text-[10px]" :
                          "bg-amber-500 text-white text-[10px]"
                        }>
                          {doc.status}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{doc.fileUrl}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-400">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-primary hover:underline"
                          >
                            View File ➔
                          </a>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingDoc(doc);
                              setIsEditDocModalOpen(true);
                            }}
                            className="h-6 w-6 p-0 text-primary hover:bg-primary/10"
                            title="Edit Document Info"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                            title="Delete Document"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-8 text-center text-slate-400 text-xs">
                    No documents attached yet. Click "Attach Document" to store Aadhaar, PAN, or Electricity Bill.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 10: TECHNICIAN */}
        {/* ========================================================= */}
        {activeSubTab === "technician" && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-indigo-600" /> Technician & Site Survey Assignment
              </CardTitle>
              <CardDescription className="text-xs">
                Assign technician for physical rooftop survey, shadow analysis, structure installation, and testing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const technicianDetails = {
                    technicianName: (form.elements.namedItem("technicianName") as HTMLInputElement).value,
                    phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
                    jobType: (form.elements.namedItem("jobType") as HTMLInputElement).value,
                    visitDate: (form.elements.namedItem("visitDate") as HTMLInputElement).value,
                    visitStatus: (form.elements.namedItem("visitStatus") as HTMLSelectElement).value,
                    technicianNotes: (form.elements.namedItem("technicianNotes") as HTMLTextAreaElement).value,
                  };
                  handleSaveSection("technicianDetails", technicianDetails, "Technician assignment updated");
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700">Technician Name</label>
                    <Input name="technicianName" defaultValue={project.technicianDetails?.technicianName} placeholder="e.g. Amit Kumar (Senior Solar Engineer)" className="mt-1 font-semibold" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Technician Phone</label>
                    <Input name="phone" defaultValue={project.technicianDetails?.phone} placeholder="98XXXXXXXX" className="mt-1" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Job Assignment Type</label>
                    <Input name="jobType" defaultValue={project.technicianDetails?.jobType || "Site Survey & Rooftop Structural Analysis"} className="mt-1" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Visit Scheduled Date</label>
                    <Input name="visitDate" type="date" defaultValue={project.technicianDetails?.visitDate} className="mt-1" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Visit Status</label>
                    <select name="visitStatus" defaultValue={project.technicianDetails?.visitStatus || "NOT_ASSIGNED"} className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2 font-bold">
                      <option value="NOT_ASSIGNED">NOT_ASSIGNED</option>
                      <option value="ASSIGNED">ASSIGNED</option>
                      <option value="VISITED">VISITED</option>
                      <option value="RESCHEDULED">RESCHEDULED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="font-semibold text-slate-700">Technician Notes & Roof Observations</label>
                    <Textarea name="technicianNotes" defaultValue={project.technicianDetails?.technicianNotes} rows={3} placeholder="Shadow free area, roof orientation, civil work required, etc." className="mt-1 bg-white" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSaving} className="bg-primary text-white">
                    Save Technician Assignment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 11: FOLLOW-UPS & COMMUNICATION ("Kis se baat chal rahi hai") */}
        {/* ========================================================= */}
        {activeSubTab === "followups" && (
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" /> Communication Log & "Kis Se Baat Chal Rahi Hai"
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Complete trail of all calls, WhatsApp chats, department visits, and planned next follow-up dates.
                  </CardDescription>
                </div>
                <Button size="sm" className="bg-primary text-white gap-1 text-xs" onClick={() => setIsFollowUpModalOpen(true)}>
                  <Plus className="h-3.5 w-3.5" /> Log Discussion
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Active Discussion Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Active Follow-up Contact</span>
                    <Badge className="bg-blue-600 text-white text-[10px]">
                      {project.currentFollowUp?.currentFollowUpWith || "CUSTOMER"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    "{project.currentFollowUp?.currentDiscussion || "No active discussion recorded."}"
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-blue-950 font-medium">
                    <span>Contact: {project.currentFollowUp?.contactPerson || project.customerName}</span>
                    <span>Phone: {project.currentFollowUp?.phone || project.mobile}</span>
                    <span>Last Spoke: {project.currentFollowUp?.lastContactDate || "N/A"}</span>
                    <span>Next Planned: {project.currentFollowUp?.nextFollowUpDate || "Not Scheduled"}</span>
                  </div>
                </div>

                {/* History Timeline */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Previous Communication Logs</h4>
                  {project.followUps && project.followUps.length > 0 ? (
                    project.followUps.map((log) => (
                      <div key={log.id} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">{log.contactMethod}</Badge>
                            {log.party} ({log.contactPerson || "Direct"})
                          </span>
                          <span className="text-slate-400 text-[11px]">{log.date}</span>
                        </div>
                        <p className="text-slate-700">{log.notes}</p>
                        {log.nextFollowUpDate && (
                          <div className="text-[11px] font-semibold text-primary pt-1">
                            Next Follow-up Scheduled: {log.nextFollowUpDate}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-6 text-slate-400 text-xs">
                      No follow-up logs recorded yet. Click "Log Discussion" to add an interaction.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 12: ISSUES & COMPLAINTS */}
        {/* ========================================================= */}
        {activeSubTab === "issues" && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" /> Customer Issues, Complaints & Resolutions
                </CardTitle>
                <CardDescription className="text-xs">
                  Log customer grievances, meter reading issues, or inverter faults with priority tracking.
                </CardDescription>
              </div>
              <Button size="sm" className="bg-primary text-white gap-1 text-xs" onClick={() => setIsIssueModalOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> Log New Issue
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.issues && project.issues.length > 0 ? (
                  project.issues.map((issue) => (
                    <div key={issue.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{issue.title}</span>
                          <Badge className={
                            issue.priority === "URGENT" ? "bg-red-600 text-white text-[10px]" :
                            issue.priority === "HIGH" ? "bg-amber-600 text-white text-[10px]" :
                            "bg-slate-700 text-white text-[10px]"
                          }>
                            {issue.priority}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {issue.status}
                        </Badge>
                      </div>
                      <p className="text-slate-700">{issue.description}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span>Reported on: {issue.dateReported} by {issue.reportedBy || "Customer"}</span>
                        <span>Category: {issue.category || "General"}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-slate-400 text-xs">
                    No active issues or complaints recorded for this project.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 13: TIMELINE HISTORY */}
        {/* ========================================================= */}
        {activeSubTab === "timeline" && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Chronological Project Lifecycle Timeline
              </CardTitle>
              <CardDescription className="text-xs">
                Audit trail from initial website enquiry through all milestone transitions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 py-2">
                {project.timeline && project.timeline.length > 0 ? (
                  project.timeline.map((evt, idx) => (
                    <div key={evt.id || idx} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-primary border-2 border-white shadow-sm" />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{evt.title}</span>
                          <Badge variant="outline" className="text-[10px] bg-slate-50">{evt.status}</Badge>
                          <span className="text-[11px] text-slate-400">{evt.date} {evt.time}</span>
                        </div>
                        {evt.notes && <p className="text-xs text-slate-600">{evt.notes}</p>}
                        <span className="text-[10px] text-slate-400 block">Logged by: {evt.user || "System"}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="pl-6 text-xs text-slate-400">Timeline events will appear as the project progresses.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: RECORD PAYMENT */}
      {/* ========================================================= */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Record Customer Payment</DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Add payment transaction. Outstanding customer balance will update automatically.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPayment} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700">Payment Amount (₹) *</label>
              <Input
                type="number"
                required
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                placeholder="e.g. 50000"
                className="mt-1 text-base font-bold text-emerald-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Payment Date</label>
              <Input
                type="date"
                required
                value={newPayment.paymentDate}
                onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Payment Mode</label>
              <select
                value={newPayment.paymentMode}
                onChange={(e) => setNewPayment({ ...newPayment, paymentMode: e.target.value })}
                className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Bank Transfer">Bank Transfer (NEFT / RTGS / IMPS)</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash Receipt</option>
                <option value="Card">Debit / Credit Card</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700">Transaction ID / UTR / Cheque No.</label>
              <Input
                value={newPayment.transactionId}
                onChange={(e) => setNewPayment({ ...newPayment, transactionId: e.target.value })}
                placeholder="e.g. UPI Ref / Bank UTR Number"
                className="mt-1 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Receipt Number</label>
              <Input
                value={newPayment.receiptNumber}
                onChange={(e) => setNewPayment({ ...newPayment, receiptNumber: e.target.value })}
                placeholder="e.g. REC-2026-0012"
                className="mt-1 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Notes</label>
              <Input
                value={newPayment.notes}
                onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                placeholder="Down payment / Structure advance"
                className="mt-1"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-white">Save Transaction</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 2: ATTACH DOCUMENT */}
      {/* ========================================================= */}
      <Dialog open={isDocModalOpen} onOpenChange={setIsDocModalOpen}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Attach Customer Document</DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Save file link or attachment reference to this customer project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDoc} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700">Document Type *</label>
              <select
                value={newDoc.docType}
                onChange={(e) => setNewDoc({ ...newDoc, docType: e.target.value })}
                className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2 font-medium"
              >
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="PAN">PAN Card</option>
                <option value="Electricity Bill">Electricity Bill</option>
                <option value="Bank Documents">Bank Passbook / Cancelled Cheque</option>
                <option value="Loan Approval">Loan Sanction Letter</option>
                <option value="Loan Disbursement Proof">Loan Disbursement Receipt</option>
                <option value="Subsidy Documents">PM Surya Ghar Subsidy Acknowledgement</option>
                <option value="Installation Documents">Site Handover / Inspection Report</option>
                <option value="Meter Documents">Bi-Directional Meter Test Certificate</option>
                <option value="Agreement">Customer EPC Agreement</option>
                <option value="Payment Receipts">Payment Receipt</option>
                <option value="Other">Other Document</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700">Document Label / Title *</label>
              <Input
                required
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                placeholder="e.g. Ramesh_Kumar_Electricity_Bill_Aug2026.pdf"
                className="mt-1"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">File URL / Storage Path *</label>
              <Input
                required
                value={newDoc.fileUrl}
                onChange={(e) => setNewDoc({ ...newDoc, fileUrl: e.target.value })}
                placeholder="https://... or /uploads/..."
                className="mt-1"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Verification Status</label>
              <select
                value={newDoc.status}
                onChange={(e) => setNewDoc({ ...newDoc, status: e.target.value })}
                className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2"
              >
                <option value="UPLOADED">UPLOADED</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="PENDING">PENDING</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDocModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-white">Save Document</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 3: LOG FOLLOW-UP */}
      {/* ========================================================= */}
      <Dialog open={isFollowUpModalOpen} onOpenChange={setIsFollowUpModalOpen}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Log Interaction / Follow-up</DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Record discussion with customer, bank, or electricity department.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddFollowUp} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700">Party Talked To *</label>
                <select
                  value={newFollowUp.party}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, party: e.target.value })}
                  className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2 font-medium"
                >
                  <option value="Customer">Customer</option>
                  <option value="Bank">Bank / Loan Officer</option>
                  <option value="Electricity Department">Electricity Department / JE</option>
                  <option value="Technician">Technician / Installer</option>
                  <option value="Subsidy Department">Subsidy Department / UPNEDA</option>
                  <option value="Internal Team">Internal Team</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Contact Method</label>
                <select
                  value={newFollowUp.contactMethod}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, contactMethod: e.target.value })}
                  className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2"
                >
                  <option value="Call">Phone Call</option>
                  <option value="WhatsApp">WhatsApp Message</option>
                  <option value="Visit">In-Person Visit / Meeting</option>
                  <option value="Email">Email</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700">Contact Person Name</label>
              <Input
                value={newFollowUp.contactPerson}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, contactPerson: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Discussion Notes *</label>
              <Textarea
                required
                rows={3}
                value={newFollowUp.notes}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, notes: e.target.value })}
                placeholder="What was discussed? Next required action?"
                className="mt-1 bg-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Next Follow-up Date</label>
              <Input
                type="date"
                value={newFollowUp.nextFollowUpDate}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, nextFollowUpDate: e.target.value })}
                className="mt-1"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFollowUpModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-white">Save Interaction</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 4: LOG ISSUE / COMPLAINT */}
      {/* ========================================================= */}
      <Dialog open={isIssueModalOpen} onOpenChange={setIsIssueModalOpen}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Log Issue / Complaint</DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Report customer grievance, meter testing delay, or civil issue.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddIssue} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700">Issue Title *</label>
              <Input
                required
                value={newIssue.title}
                onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                placeholder="e.g. Net meter bi-directional testing pending"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700">Category</label>
                <select
                  value={newIssue.category}
                  onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value })}
                  className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2"
                >
                  <option value="Installation">Installation</option>
                  <option value="Meter / DISCOM">Meter / DISCOM</option>
                  <option value="Subsidy Delay">Subsidy Delay</option>
                  <option value="Loan Delay">Loan Delay</option>
                  <option value="Inverter / Generation">Inverter / Generation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Priority</label>
                <select
                  value={newIssue.priority}
                  onChange={(e) => setNewIssue({ ...newIssue, priority: e.target.value })}
                  className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2 font-bold"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700">Description *</label>
              <Textarea
                required
                rows={3}
                value={newIssue.description}
                onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                placeholder="Detailed description of the issue"
                className="mt-1 bg-white"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsIssueModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-white">Log Issue</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: EDIT DOCUMENT INFO */}
      {/* ========================================================= */}
      <Dialog open={isEditDocModalOpen} onOpenChange={setIsEditDocModalOpen}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Edit className="h-4 w-4 text-primary" /> Edit Customer Document
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Update document title, type, verification status, and notes.
            </DialogDescription>
          </DialogHeader>
          {editingDoc && (
            <form onSubmit={handleEditDocumentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Document Title *</label>
                <Input
                  required
                  value={editingDoc.name}
                  onChange={(e) => setEditingDoc({ ...editingDoc, name: e.target.value })}
                  className="mt-1 font-medium"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Document Type</label>
                <select
                  value={editingDoc.docType}
                  onChange={(e) => setEditingDoc({ ...editingDoc, docType: e.target.value })}
                  className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2 font-medium"
                >
                  <option value="Aadhaar">Aadhaar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="Electricity Bill">Electricity Bill</option>
                  <option value="Bank Documents">Bank Documents / Passbook</option>
                  <option value="Loan Approval">Loan Approval</option>
                  <option value="Loan Disbursement Proof">Loan Disbursement Proof</option>
                  <option value="Subsidy Documents">Subsidy Documents</option>
                  <option value="Installation Documents">Installation Documents</option>
                  <option value="Meter Documents">Meter Documents</option>
                  <option value="Agreement">Agreement</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Verification Status</label>
                <select
                  value={editingDoc.status}
                  onChange={(e) => setEditingDoc({ ...editingDoc, status: e.target.value })}
                  className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2 font-bold"
                >
                  <option value="UPLOADED">UPLOADED</option>
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Notes / Remarks</label>
                <Input
                  value={editingDoc.notes || ""}
                  onChange={(e) => setEditingDoc({ ...editingDoc, notes: e.target.value })}
                  placeholder="e.g. Verified by UPPCL division office"
                  className="mt-1"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDocModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving} className="bg-primary text-white">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: UPLOAD METER FILE / PHOTO */}
      {/* ========================================================= */}
      <Dialog open={isMeterFileModalOpen} onOpenChange={setIsMeterFileModalOpen}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-sky-600" /> Upload Net-Meter File / Photo
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Upload bi-directional smart meter photo, DISCOM testing lab certificate, or meter seal photo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadMeterFile} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700">Document / Photo Title *</label>
              <Input
                required
                value={newMeterFile.name}
                onChange={(e) => setNewMeterFile({ ...newMeterFile, name: e.target.value })}
                placeholder="e.g. Smart Bi-Directional Net Meter Final Photo"
                className="mt-1 font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Meter Category</label>
              <select
                value={newMeterFile.docType}
                onChange={(e) => setNewMeterFile({ ...newMeterFile, docType: e.target.value })}
                className="w-full mt-1 h-9 rounded border border-slate-200 bg-white px-2 font-medium"
              >
                <option value="Meter Documents">Meter Documents & Clearance</option>
                <option value="Meter Photo">Net-Meter Front Photo</option>
                <option value="Meter Test Report">Meter Test & Calibration Report</option>
                <option value="DISCOM Seal Verification">DISCOM Meter Seal Verification</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700">Select File / Take Photo *</label>
              <Input
                type="file"
                accept="image/*,.pdf"
                required={!newMeterFile.fileUrl}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === "string") {
                      setNewMeterFile({
                        ...newMeterFile,
                        fileUrl: reader.result,
                        name: newMeterFile.name || file.name,
                      });
                    }
                  };
                  reader.readAsDataURL(file);
                }}
                className="mt-1"
              />
            </div>
            {newMeterFile.fileUrl && newMeterFile.fileUrl.startsWith("data:image") && (
              <div className="h-24 rounded-lg border p-1 bg-slate-50 flex items-center justify-center">
                <img src={newMeterFile.fileUrl} alt="Preview" className="h-full object-contain rounded" />
              </div>
            )}
            <div>
              <label className="font-semibold text-slate-700">Notes / Remarks</label>
              <Input
                value={newMeterFile.notes}
                onChange={(e) => setNewMeterFile({ ...newMeterFile, notes: e.target.value })}
                placeholder="e.g. Installed and optical seal verified by DISCOM engineer"
                className="mt-1"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsMeterFileModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving} className="bg-sky-600 hover:bg-sky-700 text-white">Upload Meter File</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
