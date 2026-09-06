import mongoose, { Schema, Document, Model } from "mongoose";

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
  // Backward compatibility
  | "CONTACTED"
  | "IN_PROGRESS";

export interface ILead extends Document {
  enquiryId?: string; // e.g. MS-ENQ-2026-000001
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
  dealerId?: string; // Reference to Dealer ID (e.g. MS-DEAL-2026-000001) or ObjectId
  dealerName?: string;
  convertedToProjectId?: string; // Reference to Project ID string
  convertedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    enquiryId: {
      type: String,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 120,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      index: true,
    },
    whatsapp: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      index: true,
    },
    district: {
      type: String,
      trim: true,
      default: "",
    },
    pincode: {
      type: String,
      trim: true,
      default: "",
    },
    consumerName: {
      type: String,
      trim: true,
      default: "",
    },
    consumerNumber: {
      type: String,
      trim: true,
      default: "",
    },
    connectionNumber: {
      type: String,
      trim: true,
      default: "",
    },
    billAmount: {
      type: String,
      trim: true,
      default: "",
    },
    connectionType: {
      type: String,
      trim: true,
      default: "residential",
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    source: {
      type: String,
      default: "contact-form",
      trim: true,
    },
    status: {
      type: String,
      enum: [
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
      ],
      default: "NEW",
      index: true,
    },
    requiredCapacityKW: {
      type: Number,
      min: [1, "Capacity must be at least 1 KW"],
      max: [20, "Capacity cannot exceed 20 KW"],
      index: true,
    },
    interestedCompany: {
      type: String,
      trim: true,
      default: "",
    },
    interestedProduct: {
      type: String,
      trim: true,
      default: "",
    },
    productPrice: {
      type: Number,
    },
    notes: {
      type: String,
      default: "",
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
    convertedToProjectId: {
      type: String,
      trim: true,
      default: "",
    },
    convertedAt: {
      type: Date,
    },
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

// Helpful indexes for fast search & sorting
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ name: "text", city: "text", phone: "text", consumerNumber: "text" });

if (mongoose.models && mongoose.models.Lead) {
  delete (mongoose.models as any).Lead;
}
export const LeadModel: Model<ILead> = mongoose.model<ILead>("Lead", LeadSchema);
