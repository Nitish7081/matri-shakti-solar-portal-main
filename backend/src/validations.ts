import { z } from "zod";

// Phone sanitizer: removes spaces, dashes, parentheses
export function sanitizePhone(val?: string): string {
  if (!val) return "";
  return val.replace(/[\s\-()+]/g, "");
}

// Basic XSS & injection sanitizer for strings
export function sanitizeString(val?: string): string {
  if (!val) return "";
  return val
    .replace(/[<>]/g, "") // remove script injection characters
    .trim();
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

export const createLeadSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name is too long")
    .transform(sanitizeString),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 characters")
    .refine((val) => /^[0-9+ ]{10,15}$/.test(val), {
      message: "Please provide a valid 10-digit phone number",
    })
    .transform(sanitizePhone),
  whatsapp: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? sanitizePhone(v) : "")),
  email: z
    .string()
    .email("Please provide a valid email address")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val ? val.toLowerCase().trim() : "")),
  address: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? sanitizeString(v) : "")),
  city: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v && v.trim() ? sanitizeString(v) : "Uttar Pradesh")),
  district: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? sanitizeString(v) : "")),
  pincode: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? sanitizeString(v) : "")),
  consumerName: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? sanitizeString(v) : "")),
  consumerNumber: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? sanitizeString(v) : "")),
  connectionNumber: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? sanitizeString(v) : "")),
  billAmount: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform(sanitizeString),
  connectionType: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform(sanitizeString),
  message: z
    .string()
    .max(1000, "Message cannot exceed 1000 characters")
    .optional()
    .or(z.literal(""))
    .transform(sanitizeString),
  source: z
    .string()
    .optional()
    .default("contact-form")
    .transform(sanitizeString),
  // Mandatory or optional 1-20 KW Capacity
  requiredCapacityKW: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z
      .number()
      .int("Capacity must be an integer (1 to 20 KW)")
      .min(1, "Capacity must be between 1 KW and 20 KW")
      .max(20, "Capacity must be between 1 KW and 20 KW")
      .optional()
  ),
  interestedCompany: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform(sanitizeString),
  interestedProduct: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform(sanitizeString),
  productPrice: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  dealerId: z.string().optional().default("").transform(sanitizeString),
  dealerName: z.string().optional().default("").transform(sanitizeString),
});

export const updateLeadSchema = z.object({
  name: z.string().min(2).max(120).optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  phone: z.string().min(10).max(15).optional().transform((v) => (v !== undefined ? sanitizePhone(v) : undefined)),
  whatsapp: z.string().optional().transform((v) => (v !== undefined ? sanitizePhone(v) : undefined)),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  city: z.string().min(2).max(100).optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  dealerId: z.string().optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  dealerName: z.string().optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  district: z.string().optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  pincode: z.string().optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  consumerName: z.string().optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  consumerNumber: z.string().optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  connectionNumber: z.string().optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  billAmount: z.string().optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  connectionType: z.string().optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  message: z.string().max(1000).optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  status: z
    .enum([
      "NEW",
      "RECEIVED",
      "FORM_ACCEPTED",
      "REJECTED",
      "TECHNICAL_ASSIGNED",
      "SITE_SURVEY",
      "QUOTATION_SENT",
      "APPROVED",
      "INSTALLATION_SCHEDULED",
      "INSTALLED",
      "CONVERTED",
      "CLOSED",
      "CONTACTED",
      "IN_PROGRESS",
    ])
    .optional(),
  requiredCapacityKW: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().min(1, "Capacity must be between 1 KW and 20 KW").max(20, "Capacity must be between 1 KW and 20 KW").optional()
  ),
  interestedCompany: z.string().optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  interestedProduct: z.string().optional().transform((v) => (v !== undefined ? sanitizeString(v) : undefined)),
  productPrice: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  notes: z.string().max(2000).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createCompanySchema = z.object({
  name: z.string().min(2, "Company name is required").max(100),
  logo: z.string().optional().default(""),
  description: z.string().optional().default(""),
  website: z.string().optional().default(""),
  active: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const updateCompanySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  logo: z.string().optional(),
  description: z.string().optional(),
  website: z.string().optional(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const createPackageSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
  companyName: z.string().min(1, "Company name is required"),
  model: z.string().min(2, "Model name is required"),
  capacityKW: z.coerce
    .number()
    .int("Capacity must be an integer between 1 and 20 KW")
    .min(1, "Capacity must be at least 1 KW")
    .max(20, "Capacity cannot exceed 20 KW"),
  panelWattage: z.coerce.number().min(100).max(1000).default(550),
  panelCount: z.coerce.number().min(1).max(100).default(2),
  inverterBrand: z.string().optional().default("Standard On-Grid Inverter"),
  inverterModel: z.string().optional().default(""),
  structureType: z.string().optional().default("Hot Dip Galvanized Rooftop Structure"),
  batteryIncluded: z.boolean().default(false),
  batteryCapacity: z.string().optional().default(""),
  installationIncluded: z.boolean().default(true),
  netMeteringIncluded: z.boolean().default(true),
  warranty: z.string().default("25 Years Panel / 5 Years Inverter"),
  basePrice: z.coerce.number().min(0).default(0),
  sellingPrice: z.coerce.number().min(1, "Selling price must be greater than 0"),
  discount: z.coerce.number().min(0).default(0),
  subsidy: z.coerce.number().min(0).default(0),
  available: z.boolean().default(true),
  active: z.boolean().default(true),
  image: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export const updatePackageSchema = z.object({
  model: z.string().optional(),
  capacityKW: z.coerce.number().int().min(1).max(20).optional(),
  panelWattage: z.coerce.number().min(100).max(1000).optional(),
  panelCount: z.coerce.number().min(1).max(100).optional(),
  inverterBrand: z.string().optional(),
  inverterModel: z.string().optional(),
  structureType: z.string().optional(),
  batteryIncluded: z.boolean().optional(),
  batteryCapacity: z.string().optional(),
  installationIncluded: z.boolean().optional(),
  netMeteringIncluded: z.boolean().optional(),
  warranty: z.string().optional(),
  basePrice: z.coerce.number().min(0).optional(),
  sellingPrice: z.coerce.number().min(1).optional(),
  discount: z.coerce.number().min(0).optional(),
  subsidy: z.coerce.number().min(0).optional(),
  available: z.boolean().optional(),
  active: z.boolean().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
});

export const quickMatrixUpdateSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
  capacityKW: z.coerce.number().int().min(1).max(20),
  sellingPrice: z.coerce.number().min(0).optional(),
  basePrice: z.coerce.number().min(0).optional(),
  available: z.boolean().optional(),
  subsidy: z.coerce.number().min(0).optional(),
});

// Project / Customer Track Management Schemas
export const addPaymentTransactionSchema = z.object({
  paymentDate: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
  amount: z.coerce.number().min(1, "Payment amount must be greater than 0"),
  paymentMode: z.string().optional().default("UPI"),
  transactionId: z.string().optional().default(""),
  bankCashUPI: z.string().optional().default(""),
  bank: z.string().optional().default(""),
  receiptNumber: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

export const addProjectDocumentSchema = z.object({
  docType: z.string().optional().default("General"),
  name: z.string().min(1, "Document name is required"),
  fileUrl: z.string().optional().default(""),
  status: z.enum(["UPLOADED", "VERIFIED", "REJECTED", "PENDING"]).optional().default("UPLOADED"),
  notes: z.string().optional().default(""),
});

export const addFollowUpSchema = z.object({
  date: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
  time: z.string().optional().default(""),
  contactPerson: z.string().optional().default(""),
  contactMethod: z.string().optional().default("Call"),
  method: z.string().optional().default("Call"),
  party: z.string().optional().default("Customer"),
  followupWith: z.string().optional().default("Customer"),
  notes: z.string().optional().default(""),
  currentDiscussion: z.string().optional().default(""),
  nextFollowUpDate: z.string().optional().default(""),
});

export const addProjectIssueSchema = z.object({
  title: z.string().min(1, "Issue title is required"),
  category: z.string().optional().default("General"),
  description: z.string().optional().default(""),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional().default("MEDIUM"),
  dateReported: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
  reportedBy: z.string().optional().default("Customer"),
  assignedTo: z.string().optional().default(""),
  status: z.enum(["OPEN", "IN_PROGRESS", "WAITING", "RESOLVED", "CLOSED"]).optional().default("OPEN"),
  resolution: z.string().optional().default(""),
});

// Dealer / Vendor Management Schemas
export const createDealerSchema = z.object({
  dealerName: z.string().min(2, "Dealer/Company name is required").transform(sanitizeString),
  contactPerson: z.string().min(2, "Contact person name is required").transform(sanitizeString),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits").transform(sanitizePhone),
  whatsapp: z.string().optional().default("").transform((v) => (v ? sanitizePhone(v) : "")),
  email: z.string().email("Invalid email").optional().or(z.literal("")).default("").transform((v) => (v ? v.toLowerCase().trim() : "")),
  address: z.string().optional().default("").transform(sanitizeString),
  city: z.string().min(2, "City is required").transform(sanitizeString),
  district: z.string().optional().default("").transform(sanitizeString),
  state: z.string().optional().default("Uttar Pradesh").transform(sanitizeString),
  pincode: z.string().optional().default("").transform(sanitizeString),
  gstNumber: z.string().optional().default("").transform((v) => (v ? v.toUpperCase().trim() : "")),
  panNumber: z.string().optional().default("").transform((v) => (v ? v.toUpperCase().trim() : "")),
  registrationDate: z.string().optional().default(() => new Date().toISOString()),
  active: z.boolean().optional().default(true),
  notes: z.string().optional().default(""),
});

export const updateDealerSchema = createDealerSchema.partial();

// Complaint / Customer Support Schemas
export const createComplaintSchema = z.object({
  customerName: z.string().min(2, "Customer name is required").transform(sanitizeString),
  mobile: z.string().min(10, "Valid 10-digit mobile number is required").transform(sanitizePhone),
  email: z.string().email("Invalid email").optional().or(z.literal("")).default("").transform((v) => (v ? v.toLowerCase().trim() : "")),
  projectId: z.string().optional().default("").transform(sanitizeString),
  installationId: z.string().optional().default("").transform(sanitizeString),
  companyName: z.string().optional().default("").transform(sanitizeString),
  model: z.string().optional().default("").transform(sanitizeString),
  category: z.enum([
    "Panel Issue",
    "Inverter Issue",
    "Generation Issue",
    "Net Metering",
    "Installation Issue",
    "Maintenance",
    "Warranty",
    "Cleaning",
    "Other",
  ]),
  description: z.string().min(5, "Please provide description of the problem").max(2000).transform(sanitizeString),
  preferredContact: z.enum(["Phone Call", "WhatsApp", "Email", "Visit"]).optional().default("Phone Call"),
  photoUrl: z.string().optional().default(""),
});

export const trackComplaintSchema = z.object({
  complaintId: z.string().min(5, "Complaint ID is required").transform((v) => v.toUpperCase().trim()),
  mobile: z.string().min(10, "10-digit mobile number is required").transform(sanitizePhone),
});

export const updateComplaintSchema = z.object({
  status: z
    .enum([
      "RECEIVED",
      "UNDER_REVIEW",
      "TECHNICIAN_ASSIGNED",
      "IN_PROGRESS",
      "RESOLVED",
      "REJECTED",
      "CLOSED",
    ])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assignedTechnicianId: z.string().optional(),
  assignedTechnicianName: z.string().optional(),
  resolution: z.string().optional(),
  notes: z.string().optional(),
});

// Technician Management Schemas
export const createTechnicianSchema = z.object({
  name: z.string().min(2, "Technician name is required").transform(sanitizeString),
  phone: z.string().min(10, "10-digit phone number is required").transform(sanitizePhone),
  email: z.string().email("Invalid email").optional().or(z.literal("")).default("").transform((v) => (v ? v.toLowerCase().trim() : "")),
  address: z.string().optional().default("").transform(sanitizeString),
  specialization: z.string().optional().default("Solar Rooftop & Inverter Systems").transform(sanitizeString),
  active: z.boolean().optional().default(true),
  availability: z.enum(["AVAILABLE", "ON_JOB", "ON_LEAVE"]).optional().default("AVAILABLE"),
  notes: z.string().optional().default(""),
});

export const updateTechnicianSchema = createTechnicianSchema.partial();

// Installation Showcase Schemas
export const createInstallationSchema = z.object({
  title: z.string().min(2, "Title is required").transform(sanitizeString),
  customerName: z.string().optional().default("").transform(sanitizeString),
  projectId: z.string().optional().default("").transform(sanitizeString),
  location: z.string().min(2, "Location is required").transform(sanitizeString),
  city: z.string().min(2, "City is required").transform(sanitizeString),
  companyName: z.string().optional().default("Tata Power Solar").transform(sanitizeString),
  capacityKW: z.coerce.number().min(1).max(100).default(5),
  installationDate: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
  description: z.string().optional().default("").transform(sanitizeString),
  images: z.array(z.string()).min(1, "At least one photo is required"),
  featured: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
  technicianName: z.string().optional().default(""),
  installationStatus: z.enum(["COMPLETED", "IN_PROGRESS", "COMMISSIONED"]).optional().default("COMPLETED"),
});

export const updateInstallationSchema = createInstallationSchema.partial();


