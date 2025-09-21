import express from "express";
import http from "http"; // needed to wrap with socket.io
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // client dev server (Vite default)
        methods: ["GET", "POST"]
    }
});
// Handle socket connections
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    // Broadcast join message
    io.emit("chat message", `User ${socket.id} joined the chat`);
    // Listen for chat messages
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg); // broadcast to everyone
    });
    // On disconnect
    socket.on("disconnect", () => {
        io.emit("chat message", `User ${socket.id} left the chat`);
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map