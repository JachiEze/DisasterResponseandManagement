import express from "express";
import { Feedback } from "../models/feedback";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: "All fields required" });

  const fb = await Feedback.create({ name, email, message });
  res.json(fb);
});

router.get("/", async (_req, res) => {
  const list = await Feedback.find().sort({ createdAt: -1 });
  res.json(list);
});

export default router;
