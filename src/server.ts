import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import registerEvents from "./events";

const app = express();
const server = http.createServer(app);

// app.use(cors({ origin: "http://localhost:3000" })); // frontend URL
// app.use(express.json());

// Example REST API route
app.get("/api", (req, res) => {
  res.json({ msg: "Backend is running" });
});

// Start Socket.IO
const io = new Server(server, {
  cors: { 
    origin: process.env.HOST || "http://localhost:3000", 
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
  registerEvents(io, socket);
});

server.listen(4000, () => {
  console.log("🚀 Backend with Express + Socket.IO running on http://localhost:4000");
});
