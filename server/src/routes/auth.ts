import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { signJwt } from "../utils/jwt";
import { requireAuth } from "../middleware/auth";
import crypto from "crypto";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (_req, file, cb) => {
    if (/image\/(jpeg|png|jpg)/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only .png/.jpg allowed"));
  },
});

const router = express.Router();


router.post("/signup", upload.single("idImage"), async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      phone,
      securityQuestion1,
      securityAnswer1,
      securityQuestion2,
      securityAnswer2,
    } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      !role ||
      !phone ||
      !securityQuestion1 ||
      !securityAnswer1 ||
      !securityQuestion2 ||
      !securityAnswer2
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "ID image is required" });
    }

    const allowedRoles = ["dispatcher", "responder", "reporter", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashed,
      role,
      phone,
      securityQuestion1,
      securityAnswer1,
      securityQuestion2,
      securityAnswer2,
      approved: false,
      idImageUrl: `/uploads/${req.file.filename}`,
    });

    await user.save();
    return res.json({
      message: "Signup successful. Your account is pending admin approval.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




router.post("/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    
    if (!user.approved) {
      return res.status(403).json({ message: "Account Pending Approval" });
    }

    if (user.currentSession) {
      return res.status(403).json({
        message: "User is already logged in elsewhere. Please log out first."
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const sessionId = crypto.randomUUID();
    user.currentSession = sessionId;
    await user.save();

    const token = signJwt({
      userId: user._id,
      username: user.username,
      role: user.role,
      sessionId
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/logout", requireAuth, async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(400).json({ message: "No user found in token" });
    }
    await User.findByIdAndUpdate(userId, { currentSession: null });
    res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;




