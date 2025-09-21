import mongoose from "mongoose";

export interface IResource extends mongoose.Document {
  name: string;
  quantity: number;
  location: string;
  createdAt: Date;
}

const ResourceSchema = new mongoose.Schema<IResource>(
  {
    name: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true, min: 0 },
    location: {type: String, required: true},
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Resource = mongoose.model<IResource>("Resource", ResourceSchema);
