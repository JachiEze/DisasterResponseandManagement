import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";   
import { Server } from "socket.io";
import { verifyJwt } from "./utils/jwt";
import { requireAuth } from "./middleware/auth";
import { Message } from "./models/Message";
import { User } from "./models/User";       
import bcrypt from "bcryptjs";
import resourceRoutes from "./routes/resources";
import disasterRoutes from  "./routes/disaster";
import feedbackRoutes from "./routes/feedback";            

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);         
app.use("/api/resources", resourceRoutes);
app.use("/api/disasters", disasterRoutes);
app.use("/api/feedback", feedbackRoutes);


app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: req.auth });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ["http://localhost:3000","http://localhost:5173"], methods: ["GET", "POST"] }
});


const users = new Map<string, { userId: string; username: string; role: string }>();

io.use((socket, next) => {
  const token = socket.handshake.auth?.token as string | undefined;
  if (!token) return next(new Error("Authentication error: token required"));
  try {
    const payload = verifyJwt<{ userId: string; username: string; role: string }>(token);
    (socket.data as any).user = payload;
    return next();
  } catch {
    return next(new Error("Authentication error: invalid token"));
  }
});

io.on("connection", async (socket) => {
  const user = (socket.data as any).user as {
    userId: string;
    username: string;
    role: string;
  };

  users.set(socket.id, user);

  const history = await Message.find().sort({ createdAt: 1 }).limit(100).lean();
  socket.emit("chat history", history);

  socket.on("chat message", async (msg: { text: string } | string) => {
    const sender = users.get(socket.id);
    if (!sender) return;
    const text = typeof msg === "string" ? msg : msg.text;

    const saved = await Message.create({
      username: sender.username,
      role: sender.role,
      text
    });

    io.emit("chat message", {
      username: saved.username,
      role: saved.role,
      text: saved.text,
      createdAt: saved.createdAt
    });
  });

  socket.on("disconnect", () => {
    users.delete(socket.id);
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(async () => {
    
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash("#YRNdivine5000", 10);
      await User.create({
        username: "Jachi",
        email: "Jachi@gmail.com",
        password: hashed,
        role: "admin",
        approved: true,     
      });
      console.log("Default admin account created: Jachi / #YRNdivine5000");
    }

    server.listen(PORT, () =>
      console.log(`Server listening on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("Mongo connect error:", err));



