import mongoose, { Schema, Model } from "mongoose";

export type ComplaintCategory =
  | "Panel Issue"
  | "Inverter Issue"
  | "Generation Issue"
  | "Net Metering"
  | "Installation Issue"
  | "Maintenance"
  | "Warranty"
  | "Cleaning"
  | "Other";

export type ComplaintStatus =
  | "RECEIVED"
  | "UNDER_REVIEW"
  | "TECHNICIAN_ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED"
  | "CLOSED";

export type ComplaintPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface IComplaintTimelineEvent {
  id: string;
  status: string;
  title: string;
  date: string;
  time?: string;
  user: string;
  notes?: string;
}

export interface IComplaint {
  complaintId: string; // e.g. MS-2026-000123
  customerName: string;
  mobile: string;
  email?: string;
  projectId?: string;
  installationId?: string;
  companyName?: string;
  model?: string;
  category: ComplaintCategory;
  description: string;
  preferredContact: string;
  photoUrl?: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  assignedDate?: string;
  visitDate?: string;
  resolution?: string;
  resolutionDate?: string;
  timeline: IComplaintTimelineEvent[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    projectId: {
      type: String,
      trim: true,
      default: "",
    },
    installationId: {
      type: String,
      trim: true,
      default: "",
    },
    companyName: {
      type: String,
      trim: true,
      default: "",
    },
    model: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Panel Issue",
        "Inverter Issue",
        "Generation Issue",
        "Net Metering",
        "Installation Issue",
        "Maintenance",
        "Warranty",
        "Cleaning",
        "Other",
      ],
      default: "Other",
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    preferredContact: {
      type: String,
      default: "Phone Call",
    },
    photoUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "RECEIVED",
        "UNDER_REVIEW",
        "TECHNICIAN_ASSIGNED",
        "IN_PROGRESS",
        "RESOLVED",
        "REJECTED",
        "CLOSED",
      ],
      default: "RECEIVED",
      index: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
      index: true,
    },
    assignedTechnicianId: {
      type: String,
      default: "",
    },
    assignedTechnicianName: {
      type: String,
      default: "",
    },
    assignedDate: {
      type: String,
      default: "",
    },
    visitDate: {
      type: String,
      default: "",
    },
    resolution: {
      type: String,
      default: "",
    },
    resolutionDate: {
      type: String,
      default: "",
    },
    timeline: {
      type: [
        {
          id: { type: String, required: true },
          status: { type: String, required: true },
          title: { type: String, required: true },
          date: { type: String, required: true },
          time: { type: String, default: "" },
          user: { type: String, default: "System" },
          notes: { type: String, default: "" },
        },
      ],
      default: [],
    },
    notes: {
      type: String,
      default: "",
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

ComplaintSchema.index({ mobile: 1, complaintId: 1 });
ComplaintSchema.index({ status: 1, priority: 1 });

export const ComplaintModel: Model<IComplaint> =
  mongoose.models.Complaint ||
  mongoose.model<IComplaint>("Complaint", ComplaintSchema);
