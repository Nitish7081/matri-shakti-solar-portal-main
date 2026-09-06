import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITechnician extends Document {
  technicianId: string; // e.g. MS-TECH-2026-000001
  name: string;
  phone: string;
  email?: string;
  address?: string;
  specialization: string;
  active: boolean;
  availability: "AVAILABLE" | "ON_JOB" | "ON_LEAVE";
  assignedJobsCount: number;
  assignedProjectIds: string[];
  assignedComplaintIds: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TechnicianSchema = new Schema<ITechnician>(
  {
    technicianId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Technician name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      index: true,
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
    specialization: {
      type: String,
      trim: true,
      default: "Solar Rooftop & Inverter Systems",
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    availability: {
      type: String,
      enum: ["AVAILABLE", "ON_JOB", "ON_LEAVE"],
      default: "AVAILABLE",
      index: true,
    },
    assignedJobsCount: {
      type: Number,
      default: 0,
    },
    assignedProjectIds: {
      type: [String],
      default: [],
    },
    assignedComplaintIds: {
      type: [String],
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

TechnicianSchema.index({ active: 1, availability: 1 });

export const TechnicianModel: Model<ITechnician> =
  mongoose.models.Technician ||
  mongoose.model<ITechnician>("Technician", TechnicianSchema);
