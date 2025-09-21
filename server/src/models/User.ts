import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  // updated to hold two questions & answers
  securityQuestion1: string;
  securityAnswer1: string;
  securityQuestion2: string;
  securityAnswer2: string;
  currentSession?: string | null;
  approved: boolean;
  idImageUrl?: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["dispatcher", "responder", "reporter", "admin"],
      required: true,
    },
    phone: { type: String, required: false },
    securityQuestion1: { type: String, required: false },
    securityAnswer1: { type: String, required: false },
    securityQuestion2: { type: String, required: false },
    securityAnswer2: { type: String, required: false },
    currentSession: { type: String, default: null },
    approved: { type: Boolean, default: false },
    idImageUrl: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
