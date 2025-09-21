import express from "express";
import { User } from "../models/User";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();


router.get("/users", requireAuth, async (req, res) => {
  const auth = (req as AuthRequest).auth;
  if (!auth || auth.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  const allUsers = await User.find()
    .select("-password -__v")
    .lean();
  res.json(allUsers);
});


router.get("/pending", requireAuth, async (req, res) => {
  const auth = (req as AuthRequest).auth;
  if (!auth || auth.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const pending = await User.find({ approved: false }).select("-password -__v");
  res.json(pending);
});

router.post("/approve/:id", requireAuth, async (req, res) => {
  const auth = (req as AuthRequest).auth;
  if (!auth || auth.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  await User.findByIdAndUpdate(req.params.id, { approved: true });
  res.json({ message: "User approved" });
});

router.delete("/reject/:id", requireAuth, async (req, res) => {
  const auth = (req as AuthRequest).auth;
  if (!auth || auth.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User rejected and deleted" });
});

export default router;


