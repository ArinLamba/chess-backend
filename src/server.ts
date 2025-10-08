import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import registerEvents from "./events";

import dotenv from "dotenv";
dotenv.config();


const app = express();
const server = http.createServer(app);

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" })); // frontend URL
app.use(express.json());


// Start Socket.IO
const io = new Server(server, {
  cors: { 
    origin: process.env.CORS_ORIGIN || "http://localhost:3000", 
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
  registerEvents(io, socket);
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`🚀 Backend with Express + Socket.IO running on ${port}`);
});
