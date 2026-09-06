import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDealer extends Document {
  dealerId: string; // e.g. MS-DEAL-2026-000001
  dealerName: string;
  contactPerson: string;
  mobile: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city: string;
  district?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  panNumber?: string;
  registrationDate: Date;
  active: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DealerSchema = new Schema<IDealer>(
  {
    dealerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    dealerName: {
      type: String,
      required: [true, "Dealer / Company name is required"],
      trim: true,
      maxlength: 150,
      index: true,
    },
    contactPerson: {
      type: String,
      required: [true, "Contact person name is required"],
      trim: true,
      maxlength: 100,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
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
    state: {
      type: String,
      trim: true,
      default: "Uttar Pradesh",
    },
    pincode: {
      type: String,
      trim: true,
      default: "",
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
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
      transform: (_, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

DealerSchema.index({ dealerName: "text", contactPerson: "text", city: "text", dealerId: "text" });

if (mongoose.models && mongoose.models.Dealer) {
  delete (mongoose.models as any).Dealer;
}

export const DealerModel: Model<IDealer> = mongoose.model<IDealer>("Dealer", DealerSchema);
