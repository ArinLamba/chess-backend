
import type { BoardType, PieceColor, Position, MoveInfo } from "@/lib/types";
import { MoveHandler } from "@/chess/handlers/move-handler";
import { CheckHandler } from "@/chess/handlers/check-handler";
import { PieceFactory } from "@/chess/handlers/piece-factory";

export class Game {
  board: BoardType;
  turn: PieceColor;
  private lastMoveInfo: MoveInfo | null = null;
  private legalMovesCache: Map<string, Position[]> = new Map();


  constructor(board: BoardType, turn: PieceColor = "white") {
    this.board = board;
    this.turn = turn;
  }

  getMoveInfo(): MoveInfo | null {
    return this.lastMoveInfo ? { ...this.lastMoveInfo } : null;
  }

  cloneBoard(): BoardType {
    return PieceFactory.cloneBoard(this.board);
  }

  getLegalMoves(row: number, col: number): Position[] {
    const key = `${row}${col}${this.turn}`;
    if (this.legalMovesCache.has(key)) return this.legalMovesCache.get(key)!;

    const moves = MoveHandler.computeLegalMoves(this, row, col);
    this.legalMovesCache.set(key, moves);
    return moves;
  }

  makeMove(from: Position, to: Position) {
    this.legalMovesCache.clear();
    this.lastMoveInfo = MoveHandler.moveMetadata(this, from, to);
    MoveHandler.movePieceOnBoard(this.board, from, to);
    this.turn = this.turn === "white" ? "black" : "white";
  }

  detectCheckMate() {
    return CheckHandler.isCheckmate(this, this.turn);
  }
}
