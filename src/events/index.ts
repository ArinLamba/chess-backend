import { Server, Socket } from "socket.io";
import { gameEvents } from "./game-events";

export default function registerEvents(io: Server, socket: Socket) {
  console.log("Registering events for:", socket.id);
  gameEvents(io, socket);

}
