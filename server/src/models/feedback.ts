import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Feedback = mongoose.model<IFeedback>("Feedback", FeedbackSchema);
