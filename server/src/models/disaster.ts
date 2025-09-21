import mongoose, { Schema, Types } from "mongoose";

export interface IDisaster extends mongoose.Document {
  reporterId: Types.ObjectId;   
  address: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  approved: boolean;
  peopleOnScene: string[]; 
  status: "Ongoing" | "Resolved";
}

const DisasterSchema = new Schema<IDisaster>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    approved: {type: Boolean, default: false},
    peopleOnScene: { type: [String], default: [] },
    status:     { type: String, enum: ["Ongoing", "Resolved"], default: "Ongoing" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Disaster = mongoose.model<IDisaster>("Disaster", DisasterSchema);
