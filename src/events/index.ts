import { Server, Socket } from "socket.io";
import { gameEvents } from "./game-events";

export default function registerEvents(io: Server, socket: Socket) {
  gameEvents(io, socket);

}
