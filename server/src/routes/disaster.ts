import express from "express";
import multer from "multer";
import path from "path";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { Disaster } from "../models/disaster";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/disasters/",
  filename: (_req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

/* -------------------- CREATE DISASTER -------------------- */
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  const { auth } = req as AuthRequest;
  if (auth?.role !== "reporter")
    return res.status(403).json({ message: "Forbidden" });

  const { address, description } = req.body;
  if (!address || !description || !req.file)
    return res.status(400).json({ message: "Missing fields" });

  const disaster = await Disaster.create({
    reporterId: auth.userId,
    address,
    description,
    imageUrl: `/uploads/disasters/${req.file.filename}`,
    approved: false,
  });

  res.json(disaster);
});

/* -------------------- LIST PENDING DISASTERS -------------------- */
/* ✅ UPDATED: only return disasters that have NOT been approved */
router.get("/", requireAuth, async (req, res) => {
  const { auth } = req as AuthRequest;
  if (auth?.role !== "dispatcher" && auth?.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const list = await Disaster.find({ approved: false }).sort({ createdAt: -1 });
  res.json(list);
});

/* -------------------- ACCEPT DISASTER -------------------- */
router.put("/:id/accept", requireAuth, async (req, res) => {
  const { auth } = req as AuthRequest;
  if (auth?.role !== "dispatcher" && auth?.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const updated = await Disaster.findByIdAndUpdate(
    req.params.id,
    { approved: true },
    { new: true }
  );

  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Disaster accepted", disaster: updated });
});

/* -------------------- REJECT DISASTER -------------------- */
router.delete("/:id/reject", requireAuth, async (req, res) => {
  const { auth } = req as AuthRequest;
  if (auth?.role !== "dispatcher" && auth?.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const deleted = await Disaster.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Disaster rejected and deleted" });
});

/* -------------------- APPROVED DISASTERS -------------------- */
router.get("/approved", requireAuth, async (_req, res) => {
  const list = await Disaster.find({ approved: true }).sort({ createdAt: -1 });
  res.json(list);
});

/* -------------------- STATUS UPDATE -------------------- */
router.put("/:id/status", requireAuth, async (req, res) => {
  const { auth } = req as AuthRequest;
  if (auth?.role !== "dispatcher" && auth?.role !== "responder")
    return res.status(403).json({ message: "Forbidden" });

  const { status } = req.body;
  if (!["Ongoing", "Resolved"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const updated = await Disaster.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Not found" });

  res.json(updated);
});

/* -------------------- SCENE PARTICIPATION -------------------- */
router.put("/:id/scene/join", requireAuth, async (req, res) => {
  const { auth } = req as AuthRequest;
  if (auth?.role !== "responder")
    return res.status(403).json({ message: "Only responders can join" });

  const username = auth.username;
  const updated = await Disaster.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { peopleOnScene: username } },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
});

router.put("/:id/scene/leave", requireAuth, async (req, res) => {
  const { auth } = req as AuthRequest;
  if (auth?.role !== "responder")
    return res.status(403).json({ message: "Only responders can leave" });

  const username = auth.username;
  const updated = await Disaster.findByIdAndUpdate(
    req.params.id,
    { $pull: { peopleOnScene: username } },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
});

export default router;


