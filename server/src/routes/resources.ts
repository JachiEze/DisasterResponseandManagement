import express from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { Resource } from "../models/Resource";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const { auth } = req as AuthRequest;
  if (!["admin", "dispatcher", "responder"].includes(auth?.role ?? "")) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const resources = await Resource.find().sort({ createdAt: 1 });
  res.json(resources);
});

router.post("/", requireAuth, async (req, res) => {
  const auth = (req as AuthRequest).auth;
  if (auth?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { name, quantity, location } = req.body;
  if (!name || quantity == null || !location) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const resource = new Resource({ name, quantity, location });
  await resource.save();
  res.json(resource);
});

router.put("/:id", requireAuth, async (req, res) => {
  const auth = (req as AuthRequest).auth;
  if (auth?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { name, quantity, location } = req.body;
  const updateData: Record<string, any> = {};
  if (name !== undefined) updateData.name = name;
  if (quantity !== undefined) updateData.quantity = quantity;
  if (location !== undefined) updateData.location = location;

  const updated = await Resource.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );
  res.json(updated);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const auth = (req as AuthRequest).auth;
  if (auth?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  await Resource.findByIdAndDelete(req.params.id);
  res.json({ message: "Resource deleted" });
});

export default router;


