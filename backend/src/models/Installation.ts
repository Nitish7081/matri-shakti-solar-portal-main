import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInstallation extends Document {
  title: string;
  customerName?: string;
  projectId?: string;
  location: string;
  city: string;
  companyName: string;
  capacityKW: number;
  installationDate: string;
  description?: string;
  images: string[];
  featured: boolean;
  active: boolean;
  technicianName?: string;
  installationStatus: "COMPLETED" | "IN_PROGRESS" | "COMMISSIONED";
  createdAt: Date;
  updatedAt: Date;
}

const InstallationSchema = new Schema<IInstallation>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    customerName: {
      type: String,
      trim: true,
      default: "",
    },
    projectId: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      index: true,
    },
    companyName: {
      type: String,
      default: "Tata Power Solar",
      trim: true,
      index: true,
    },
    capacityKW: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      default: 5,
      index: true,
    },
    installationDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    images: {
      type: [String],
      required: true,
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    technicianName: {
      type: String,
      trim: true,
      default: "",
    },
    installationStatus: {
      type: String,
      enum: ["COMPLETED", "IN_PROGRESS", "COMMISSIONED"],
      default: "COMPLETED",
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

InstallationSchema.index({ active: 1, featured: -1, createdAt: -1 });

export const InstallationModel: Model<IInstallation> =
  mongoose.models.Installation ||
  mongoose.model<IInstallation>("Installation", InstallationSchema);
