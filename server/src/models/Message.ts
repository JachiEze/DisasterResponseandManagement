import mongoose from "mongoose";

export interface IMessage extends mongoose.Document {
  username: string;
  role: string;
  text: string;
  createdAt: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    username: { type: String, required: true },
    role: { type: String, required: true },
    text: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
