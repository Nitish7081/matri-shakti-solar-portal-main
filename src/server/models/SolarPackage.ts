import mongoose, { Schema, Model } from "mongoose";

export interface ISolarPackage {
  companyId: mongoose.Types.ObjectId;
  companyName: string;
  companySlug: string;
  model: string;
  capacityKW: number;
  panelWattage: number;
  panelCount: number;
  inverterBrand: string;
  inverterModel: string;
  structureType: string;
  batteryIncluded: boolean;
  batteryCapacity?: string;
  installationIncluded: boolean;
  netMeteringIncluded: boolean;
  warranty: string;
  basePrice: number;
  sellingPrice: number;
  discount: number;
  subsidy: number;
  available: boolean;
  active: boolean;
  image?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SolarPackageSchema = new Schema<ISolarPackage>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "SolarCompany",
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companySlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
      default: "Standard On-Grid Rooftop System",
    },
    capacityKW: {
      type: Number,
      required: true,
      min: [1, "Minimum capacity is 1 KW"],
      max: [20, "Maximum capacity is 20 KW"],
      index: true,
    },
    panelWattage: {
      type: Number,
      default: 550,
    },
    panelCount: {
      type: Number,
      default: 2,
    },
    inverterBrand: {
      type: String,
      default: "Grid-Tied Compatible",
    },
    inverterModel: {
      type: String,
      default: "",
    },
    structureType: {
      type: String,
      default: "Hot Dip Galvanized Rooftop Structure",
    },
    batteryIncluded: {
      type: Boolean,
      default: false,
    },
    batteryCapacity: {
      type: String,
      default: "",
    },
    installationIncluded: {
      type: Boolean,
      default: true,
    },
    netMeteringIncluded: {
      type: Boolean,
      default: true,
    },
    warranty: {
      type: String,
      default: "25 Years Panel / 5 Years Inverter",
    },
    basePrice: {
      type: Number,
      default: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    subsidy: {
      type: Number,
      default: 0,
    },
    available: {
      type: Boolean,
      default: true,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
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

SolarPackageSchema.index({ companyId: 1, capacityKW: 1 }, { unique: true });
SolarPackageSchema.index({ capacityKW: 1, available: 1, active: 1 });

export const SolarPackageModel: Model<ISolarPackage> =
  mongoose.models.SolarPackage ||
  mongoose.model<ISolarPackage>("SolarPackage", SolarPackageSchema);
