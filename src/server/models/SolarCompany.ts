import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISolarCompany extends Document {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SolarCompanySchema = new Schema<ISolarCompany>(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    logo: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
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

export const SolarCompanyModel: Model<ISolarCompany> =
  mongoose.models.SolarCompany ||
  mongoose.model<ISolarCompany>("SolarCompany", SolarCompanySchema);
