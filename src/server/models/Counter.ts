import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICounter extends Document {
  name: string;
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

if (mongoose.models && mongoose.models.Counter) {
  delete (mongoose.models as any).Counter;
}

export const CounterModel: Model<ICounter> = mongoose.model<ICounter>(
  "Counter",
  CounterSchema
);

/**
 * Generates an atomic sequential formatted ID, e.g. MS-ENQ-2026-000001 or MS-PROJ-2026-000001
 */
export async function getNextSequence(
  type: "enquiry" | "project" | "dealer" | "complaint" | "technician"
): Promise<string> {
  const currentYear = new Date().getFullYear();
  const counterKey = `${type}_${currentYear}`;

  const counter = await CounterModel.findOneAndUpdate(
    { name: counterKey },
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true }
  );

  const seqNumber = counter ? counter.seq : 1;
  const padded = seqNumber.toString().padStart(6, "0");

  if (type === "complaint") {
    // Matches required format: MS-2026-000123
    return `MS-${currentYear}-${padded}`;
  }
  if (type === "technician") {
    return `MS-TECH-${currentYear}-${padded}`;
  }

  let prefix = "MS-ENQ";
  if (type === "project") prefix = "MS-PROJ";
  if (type === "dealer") prefix = "MS-DEAL";

  return `${prefix}-${currentYear}-${padded}`;
}

