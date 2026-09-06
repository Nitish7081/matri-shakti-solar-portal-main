import mongoose, { Schema, Document, Model } from "mongoose";

export type ProjectStatus =
  | "ENQUIRY"
  | "FORM_ACCEPTED"
  | "DOCUMENT_VERIFICATION"
  | "LOAN_PROCESS"
  | "SUBSIDY_PROCESS"
  | "TECHNICAL_ASSIGNED"
  | "SITE_SURVEY"
  | "INSTALLATION_PENDING"
  | "INSTALLATION_COMPLETE"
  | "METER_PENDING"
  | "METER_CONFIGURED"
  | "SUBSIDY_PENDING"
  | "SUBSIDY_RECEIVED"
  | "PAYMENT_PENDING"
  | "COMPLETED"
  | "CLOSED";

export type ChecklistVerificationStatus = "CORRECT" | "INCORRECT" | "PENDING" | "NOT_APPLICABLE";
export type QualityItemStatus = "PENDING" | "DONE" | "NOT_APPLICABLE";

export interface IPaymentTransaction {
  id: string;
  paymentDate: string;
  amount: number;
  paymentMode: string; // UPI / Bank Transfer / Cash / Cheque / Card
  transactionId?: string;
  bankCashUPI?: string;
  receiptNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface IProjectDocument {
  id: string;
  docType: string; // Aadhaar / PAN / Electricity Bill / Bank Documents / Loan Approval / Subsidy Documents / Installation Documents / Meter Documents / Agreement / Payment Receipts / Other
  name: string;
  fileUrl: string;
  uploadDate: string;
  uploadedBy?: string;
  status: "UPLOADED" | "VERIFIED" | "REJECTED" | "PENDING";
  notes?: string;
}

export interface IFollowUpLog {
  id: string;
  date: string;
  time?: string;
  contactPerson: string;
  contactMethod: string; // Call / WhatsApp / Visit / Email / Other
  party: string; // Customer / Bank / Electricity Department / Technician / Subsidy Department / Internal Team / Other
  notes: string;
  nextFollowUpDate?: string;
  loggedBy?: string;
}

export interface IProjectIssue {
  id: string;
  title: string;
  category?: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dateReported: string;
  reportedBy?: string;
  assignedTo?: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING" | "RESOLVED" | "CLOSED";
  resolution?: string;
  resolutionDate?: string;
}

export interface ITimelineEvent {
  id: string;
  date: string;
  time?: string;
  user: string;
  status: string;
  title: string;
  notes?: string;
}

export interface IProject extends Document {
  // 1. Master Identifiers
  projectId: string; // e.g. MS-PROJ-2026-000001
  leadId?: mongoose.Types.ObjectId;
  enquiryId?: string; // e.g. MS-ENQ-2026-000001
  enquiryDate?: Date;
  source?: string;
  projectStatus: ProjectStatus;
  dealerId?: string; // Reference to Dealer ID (e.g. MS-DEAL-2026-000001)
  dealerName?: string;

  // 2. Personal Details
  customerName: string;
  fatherHusbandName?: string;
  mobile: string;
  alternateMobile?: string;
  whatsapp?: string;
  email?: string;
  aadhaarNumber?: string; // Sensitive, masked in UI
  panNumber?: string; // Sensitive, masked in UI
  address?: string;
  city: string;
  district?: string;
  state?: string;
  pincode?: string;

  // 3. Electricity / DISCOM Details
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

  // 4. Bill Verification Checklist
  billVerification: {
    nameCorrect: ChecklistVerificationStatus;
    consumerNumberCorrect: ChecklistVerificationStatus;
    addressCorrect: ChecklistVerificationStatus;
    billNumberCorrect: ChecklistVerificationStatus;
    aadhaarDetailsCorrect: ChecklistVerificationStatus;
    panDetailsCorrect: ChecklistVerificationStatus;
    connectionDetailsCorrect: ChecklistVerificationStatus;
    verificationNotes?: string;
  };

  // 5. Name Correction Tracking
  nameCorrection: {
    required: boolean;
    submitted: boolean;
    submissionDate?: string;
    correctionAppNumber?: string;
    deptOffice?: string;
    status: "NOT_REQUIRED" | "PENDING" | "SUBMITTED" | "UNDER_PROCESS" | "COMPLETED" | "REJECTED";
    completedDate?: string;
    remarks?: string;
  };

  // 6. Meter Details & Post-Installation Verification
  meterDetails: {
    existingMeterType?: "Old Meter" | "Smart Meter" | "New Meter" | "Other";
    meterNumber?: string;
    meterReading?: string;
    meterInstallDate?: string;
    meterPhoto?: string;
    meterStatus?: string;
    // Configuration
    configStatus: "NOT_STARTED" | "APPLIED" | "PENDING" | "CONFIGURED" | "REJECTED";
    configAppDate?: string;
    configDate?: string;
    configRefNumber?: string;
    deptOffice?: string;
    remarks?: string;
    // Post Installation Verification Checks
    panelInstalled: boolean;
    meterConfigured: boolean;
    meterWorkingCorrectly: boolean;
    meterReadingCorrect: boolean;
    solarGenerationShowing: boolean;
    netMeteringWorking: boolean;
    billCorrectAfterInstallation: boolean;
    // Issue if any check fails
    issueDescription?: string;
    issueDate?: string;
    reportedTo?: string;
    resolutionStatus?: string;
    resolutionDate?: string;
    resolutionNotes?: string;
  };

  // 7. Solar Installation Details & Quality Checklist
  solarInstallation: {
    companyId?: mongoose.Types.ObjectId;
    companyName: string;
    panelBrand?: string;
    panelModel?: string;
    panelWattage: number;
    panelCount: number;
    capacityKW: number; // 1 to 20 KW
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
    installationPhotos: string[];
    installationVideo?: string;
    installationStatus: "NOT_SCHEDULED" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "INSPECTION_PENDING";
    // 12-point Quality Checklist
    checklist: {
      panelsInstalled: QualityItemStatus;
      structureInstalled: QualityItemStatus;
      inverterInstalled: QualityItemStatus;
      dcWiringComplete: QualityItemStatus;
      acWiringComplete: QualityItemStatus;
      earthingComplete: QualityItemStatus;
      lightningProtection: QualityItemStatus;
      safetyCheck: QualityItemStatus;
      inverterCommissioned: QualityItemStatus;
      generationTested: QualityItemStatus;
      meterProcessStarted: QualityItemStatus;
      customerHandoverComplete: QualityItemStatus;
    };
  };

  // 8. Customer Payment Management
  payments: {
    totalProjectCost: number;
    subsidyExpected: number;
    customerContribution: number;
    downPayment: number;
    amountPaid: number; // calculated sum of transactions
    amountRemaining: number; // calculated balance
    paymentStatus: "PENDING" | "PARTIAL" | "PAID" | "REFUND_PENDING" | "REFUNDED";
    transactions: IPaymentTransaction[];
  };

  // 9. Bank Loan Management
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
    loanStatus:
      | "NOT_REQUIRED"
      | "APPLICATION_PENDING"
      | "DOCUMENT_PENDING"
      | "UNDER_REVIEW"
      | "APPROVED"
      | "PARTIALLY_DISBURSED"
      | "FULLY_DISBURSED"
      | "REJECTED"
      | "CLOSED";
  };

  // 10. Subsidy Management (Central + UP State)
  subsidyTracking: {
    centralSubsidy: {
      applied: boolean;
      appDate?: string;
      appNumber?: string;
      expectedAmount: number;
      approvedAmount?: number;
      receivedAmount: number;
      receivedDate?: string;
      status: "NOT_APPLIED" | "APPLIED" | "UNDER_PROCESS" | "APPROVED" | "REJECTED" | "RECEIVED";
    };
    stateSubsidy: {
      applied: boolean;
      appDate?: string;
      appNumber?: string;
      expectedAmount: number;
      approvedAmount?: number;
      receivedAmount: number;
      receivedDate?: string;
      status: "NOT_APPLIED" | "APPLIED" | "UNDER_PROCESS" | "APPROVED" | "REJECTED" | "RECEIVED";
    };
  };

  // 11. Document Management
  documents: IProjectDocument[];

  // 12. Technician Assignment
  technicianDetails: {
    technicianName?: string;
    phone?: string;
    assignedDate?: string;
    assignedBy?: string;
    jobType?: string;
    visitDate?: string;
    visitStatus?: "NOT_ASSIGNED" | "ASSIGNED" | "VISITED" | "RESCHEDULED" | "COMPLETED" | "CANCELLED";
    technicianNotes?: string;
  };

  // 13. Communication & Follow-up ("Kis se baat chal rahi hai")
  currentFollowUp: {
    currentFollowUpWith:
      | "CUSTOMER"
      | "BANK"
      | "ELECTRICITY_DEPARTMENT"
      | "TECHNICIAN"
      | "SUBSIDY_DEPARTMENT"
      | "INTERNAL_TEAM"
      | "OTHER";
    contactPerson?: string;
    phone?: string;
    lastContactDate?: string;
    nextFollowUpDate?: string;
    currentDiscussion?: string;
    notes?: string;
  };
  followUps: IFollowUpLog[];

  // 14. Other Issues / Complaints
  issues: IProjectIssue[];

  // 15. Timeline History
  timeline: ITimelineEvent[];

  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      index: true,
    },
    enquiryId: {
      type: String,
      trim: true,
      index: true,
    },
    enquiryDate: {
      type: Date,
    },
    source: {
      type: String,
      default: "website-enquiry",
    },
    projectStatus: {
      type: String,
      required: true,
      default: "ENQUIRY",
      index: true,
    },
    dealerId: {
      type: String,
      trim: true,
      index: true,
      default: "",
    },
    dealerName: {
      type: String,
      trim: true,
      default: "",
    },

    // Personal Details
    customerName: { type: String, required: true, trim: true, index: true },
    fatherHusbandName: { type: String, trim: true, default: "" },
    mobile: { type: String, required: true, trim: true, index: true },
    alternateMobile: { type: String, trim: true, default: "" },
    whatsapp: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    aadhaarNumber: { type: String, trim: true, default: "" },
    panNumber: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    city: { type: String, required: true, trim: true, index: true },
    district: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "Uttar Pradesh" },
    pincode: { type: String, trim: true, default: "" },

    // Electricity / DISCOM Details
    discomDetails: {
      discomName: { type: String, default: "Purvanchal Vidyut Vitaran Nigam Ltd (PVVNL)" },
      division: { type: String, default: "" },
      subDivision: { type: String, default: "" },
      officeLocation: { type: String, default: "" },
      officeAddress: { type: String, default: "" },
      contactPerson: { type: String, default: "" },
      contactNumber: { type: String, default: "" },
      consumerName: { type: String, default: "" },
      consumerNumber: { type: String, default: "", index: true },
      connectionNumber: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      meterNumber: { type: String, default: "" },
      billNumber: { type: String, default: "" },
      latestBillDate: { type: String, default: "" },
      currentBillAmount: { type: Number, default: 0 },
      connectionType: { type: String, default: "Domestic" },
      sanctionedLoad: { type: String, default: "" },
      existingLoad: { type: String, default: "" },
    },

    // Bill Verification Checklist
    billVerification: {
      nameCorrect: { type: String, default: "PENDING" },
      consumerNumberCorrect: { type: String, default: "PENDING" },
      addressCorrect: { type: String, default: "PENDING" },
      billNumberCorrect: { type: String, default: "PENDING" },
      aadhaarDetailsCorrect: { type: String, default: "PENDING" },
      panDetailsCorrect: { type: String, default: "PENDING" },
      connectionDetailsCorrect: { type: String, default: "PENDING" },
      verificationNotes: { type: String, default: "" },
    },

    // Name Correction Tracking
    nameCorrection: {
      required: { type: Boolean, default: false },
      submitted: { type: Boolean, default: false },
      submissionDate: { type: String, default: "" },
      correctionAppNumber: { type: String, default: "" },
      deptOffice: { type: String, default: "" },
      status: { type: String, default: "NOT_REQUIRED" },
      completedDate: { type: String, default: "" },
      remarks: { type: String, default: "" },
    },

    // Meter Details & Verification
    meterDetails: {
      existingMeterType: { type: String, default: "Smart Meter" },
      meterNumber: { type: String, default: "" },
      meterReading: { type: String, default: "" },
      meterInstallDate: { type: String, default: "" },
      meterPhoto: { type: String, default: "" },
      meterStatus: { type: String, default: "Functional" },
      configStatus: { type: String, default: "NOT_STARTED" },
      configAppDate: { type: String, default: "" },
      configDate: { type: String, default: "" },
      configRefNumber: { type: String, default: "" },
      deptOffice: { type: String, default: "" },
      remarks: { type: String, default: "" },
      panelInstalled: { type: Boolean, default: false },
      meterConfigured: { type: Boolean, default: false },
      meterWorkingCorrectly: { type: Boolean, default: false },
      meterReadingCorrect: { type: Boolean, default: false },
      solarGenerationShowing: { type: Boolean, default: false },
      netMeteringWorking: { type: Boolean, default: false },
      billCorrectAfterInstallation: { type: Boolean, default: false },
      issueDescription: { type: String, default: "" },
      issueDate: { type: String, default: "" },
      reportedTo: { type: String, default: "" },
      resolutionStatus: { type: String, default: "" },
      resolutionDate: { type: String, default: "" },
      resolutionNotes: { type: String, default: "" },
    },

    // Solar Installation Details & Quality Checklist
    solarInstallation: {
      companyId: { type: Schema.Types.ObjectId, ref: "SolarCompany" },
      companyName: { type: String, default: "Tata Power Solar", index: true },
      panelBrand: { type: String, default: "Tata Power Solar" },
      panelModel: { type: String, default: "Mono PERC Half-Cut" },
      panelWattage: { type: Number, default: 550 },
      panelCount: { type: Number, default: 10 },
      capacityKW: { type: Number, default: 5, min: 1, max: 20, index: true },
      inverterBrand: { type: String, default: "Solis" },
      inverterModel: { type: String, default: "5KW-OG-550" },
      inverterSerialNumber: { type: String, default: "" },
      structureType: { type: String, default: "Hot Dip Galvanized Rooftop Structure" },
      batteryIncluded: { type: Boolean, default: false },
      batteryCapacity: { type: String, default: "" },
      installationDate: { type: String, default: "" },
      installationTeam: { type: String, default: "" },
      technician: { type: String, default: "", index: true },
      installationAddress: { type: String, default: "" },
      installationPhotos: { type: [String], default: [] },
      installationVideo: { type: String, default: "" },
      installationStatus: { type: String, default: "NOT_SCHEDULED", index: true },
      checklist: {
        panelsInstalled: { type: String, default: "PENDING" },
        structureInstalled: { type: String, default: "PENDING" },
        inverterInstalled: { type: String, default: "PENDING" },
        dcWiringComplete: { type: String, default: "PENDING" },
        acWiringComplete: { type: String, default: "PENDING" },
        earthingComplete: { type: String, default: "PENDING" },
        lightningProtection: { type: String, default: "PENDING" },
        safetyCheck: { type: String, default: "PENDING" },
        inverterCommissioned: { type: String, default: "PENDING" },
        generationTested: { type: String, default: "PENDING" },
        meterProcessStarted: { type: String, default: "PENDING" },
        customerHandoverComplete: { type: String, default: "PENDING" },
      },
    },

    // Customer Payment Management
    payments: {
      totalProjectCost: { type: Number, default: 0 },
      subsidyExpected: { type: Number, default: 0 },
      customerContribution: { type: Number, default: 0 },
      downPayment: { type: Number, default: 0 },
      amountPaid: { type: Number, default: 0 },
      amountRemaining: { type: Number, default: 0 },
      paymentStatus: { type: String, default: "PENDING", index: true },
      transactions: [
        {
          id: { type: String, required: true },
          paymentDate: { type: String, required: true },
          amount: { type: Number, required: true },
          paymentMode: { type: String, default: "UPI" },
          transactionId: { type: String, default: "" },
          bankCashUPI: { type: String, default: "" },
          receiptNumber: { type: String, default: "" },
          notes: { type: String, default: "" },
          createdAt: { type: String, default: () => new Date().toISOString() },
        },
      ],
    },

    // Bank Loan Management
    bankLoan: {
      loanRequired: { type: Boolean, default: false },
      bankName: { type: String, default: "" },
      branchName: { type: String, default: "" },
      bankLocation: { type: String, default: "" },
      branchAddress: { type: String, default: "" },
      loanAppNumber: { type: String, default: "" },
      loanAmountApplied: { type: Number, default: 0 },
      loanAmountApproved: { type: Number, default: 0 },
      loanAmountDisbursed: { type: Number, default: 0 },
      firstDisbursement: { type: Number, default: 0 },
      secondDisbursement: { type: Number, default: 0 },
      nextExpectedPayment: { type: Number, default: 0 },
      nextPaymentDate: { type: String, default: "" },
      remainingBankAmount: { type: Number, default: 0 },
      emi: { type: Number, default: 0 },
      loanTenure: { type: String, default: "" },
      interestRate: { type: String, default: "" },
      loanOfficerName: { type: String, default: "" },
      loanOfficerPhone: { type: String, default: "" },
      appDate: { type: String, default: "" },
      approvalDate: { type: String, default: "" },
      disbursementDate: { type: String, default: "" },
      loanStatus: { type: String, default: "NOT_REQUIRED", index: true },
    },

    // Subsidy Tracking
    subsidyTracking: {
      centralSubsidy: {
        applied: { type: Boolean, default: false },
        appDate: { type: String, default: "" },
        appNumber: { type: String, default: "" },
        expectedAmount: { type: Number, default: 78000 },
        approvedAmount: { type: Number, default: 0 },
        receivedAmount: { type: Number, default: 0 },
        receivedDate: { type: String, default: "" },
        status: { type: String, default: "NOT_APPLIED", index: true },
      },
      stateSubsidy: {
        applied: { type: Boolean, default: false },
        appDate: { type: String, default: "" },
        appNumber: { type: String, default: "" },
        expectedAmount: { type: Number, default: 30000 },
        approvedAmount: { type: Number, default: 0 },
        receivedAmount: { type: Number, default: 0 },
        receivedDate: { type: String, default: "" },
        status: { type: String, default: "NOT_APPLIED", index: true },
      },
    },

    // Documents
    documents: [
      {
        id: { type: String, required: true },
        docType: { type: String, required: true },
        name: { type: String, required: true },
        fileUrl: { type: String, required: true },
        uploadDate: { type: String, default: () => new Date().toISOString() },
        uploadedBy: { type: String, default: "Admin" },
        status: { type: String, default: "UPLOADED" },
        notes: { type: String, default: "" },
      },
    ],

    // Technician
    technicianDetails: {
      technicianName: { type: String, default: "" },
      phone: { type: String, default: "" },
      assignedDate: { type: String, default: "" },
      assignedBy: { type: String, default: "" },
      jobType: { type: String, default: "Site Survey & Installation" },
      visitDate: { type: String, default: "" },
      visitStatus: { type: String, default: "NOT_ASSIGNED" },
      technicianNotes: { type: String, default: "" },
    },

    // Follow-ups ("Kis se baat chal rahi hai")
    currentFollowUp: {
      currentFollowUpWith: { type: String, default: "CUSTOMER" },
      contactPerson: { type: String, default: "" },
      phone: { type: String, default: "" },
      lastContactDate: { type: String, default: "" },
      nextFollowUpDate: { type: String, default: "" },
      currentDiscussion: { type: String, default: "" },
      notes: { type: String, default: "" },
    },
    followUps: [
      {
        id: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, default: "" },
        contactPerson: { type: String, default: "" },
        contactMethod: { type: String, default: "Call" },
        party: { type: String, default: "Customer" },
        notes: { type: String, required: true },
        nextFollowUpDate: { type: String, default: "" },
        loggedBy: { type: String, default: "Admin" },
      },
    ],

    // Issues
    issues: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        category: { type: String, default: "General" },
        description: { type: String, required: true },
        priority: { type: String, default: "MEDIUM" },
        dateReported: { type: String, required: true },
        reportedBy: { type: String, default: "Customer" },
        assignedTo: { type: String, default: "" },
        status: { type: String, default: "OPEN" },
        resolution: { type: String, default: "" },
        resolutionDate: { type: String, default: "" },
      },
    ],

    // Timeline History
    timeline: [
      {
        id: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, default: "" },
        user: { type: String, default: "System" },
        status: { type: String, default: "INFO" },
        title: { type: String, required: true },
        notes: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id ? (ret._id as mongoose.Types.ObjectId).toString() : undefined;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for searching & reporting
ProjectSchema.index({ customerName: "text", mobile: "text", city: "text", projectId: "text" });
ProjectSchema.index({ createdAt: -1 });

if (mongoose.models && mongoose.models.Project) {
  delete (mongoose.models as any).Project;
}

export const ProjectModel: Model<IProject> = mongoose.model<IProject>("Project", ProjectSchema);
