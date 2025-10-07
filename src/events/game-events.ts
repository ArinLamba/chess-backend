import { Server, Socket } from "socket.io";
import { Game } from "../chess/game";
import { generateBoard } from "../chess/helpers/board-helper";

let waitingPlayers: Socket | null = null;
const playerColor: Record<string, string> = {};
const games: Record<string, Game> = {};
const rooms: Record<string, string> = {};

export const gameEvents = (io: Server, socket: Socket) => {
  socket.on("findMatch", () => {
    // search player on db or check it on front end first dont know now which approach to follow
    // if(!playerFound) {
    //   socket.emit("player-not-found");
    // }

    // no player has joined till now
    if(!waitingPlayers) {
      waitingPlayers = socket;
      playerColor[socket.id] = "white";
    } else {
      if(waitingPlayers === socket) return;

      // Found an opponent then create a game
      const roomId = `room-${waitingPlayers.id}-${socket.id}`;
      rooms[socket.id] = roomId;
      rooms[waitingPlayers.id] = roomId; // ✅ store for both players

      waitingPlayers.join(roomId);
      socket.join(roomId);
      
      playerColor[socket.id] = "black";
      games[roomId] = new Game(generateBoard(), "white");

      io.to(roomId).emit("gameStarted", { roomId, players: [waitingPlayers.id, socket.id] });
      waitingPlayers = null;
    }

  });

  socket.on("move", (move) => {
    
    const roomId = rooms[socket.id];
    if (!roomId) {
      console.error(`❌ No room found for player ${socket.id}`);
      socket.emit("error", "You are not in a game yet.");
      return;
    }
    
    const game = games[roomId];
    if (!game) {
      console.error("❌ No game found for ID:");
      return; // exit early
    }
    
    const pColor = playerColor[socket.id];
    const [from, to] = move;
    
    // no move will be forwarded if not your move
    if(game.turn !== pColor) return;
    game.makeMove(from, to);
    const moveInfo = game.getMoveInfo();
    if(game.detectCheckMate()) io.to(roomId).emit("gameOver");
    
    io.to(roomId).emit("opponentMove", [from, to, moveInfo]);
  });


  socket.on("disconnect", () => {
    
    console.log(`User disconnected : ${socket.id}`);
    const roomId = rooms[socket.id];
    if (roomId) {
      delete games[roomId];
    }
    delete rooms[socket.id];
    delete playerColor[socket.id];
  

  });
}
