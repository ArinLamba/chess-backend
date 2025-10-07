import { BoardType, PieceColor, Position } from "../../lib/types";
import { Piece } from "./piece";

export class Pawn extends Piece {
  constructor(color: PieceColor) {
    super(color, "pawn");
  }

  getValidMoves(row: number, col: number, board: BoardType): Position[] {
    const moves: Position[] = [];
    const dir = this.color === "white" ? -1 : 1;

    // 1-square move forward
    const nrow = row + dir;
    if(this.isValid(nrow, col) && !board[nrow][col]) {
      moves.push([nrow, col]);

      // 2-square move forward only from starting row and move is possible
      const startRow = this.color === "white" ? 6 : 1;
      const twoRow = row + 2 * dir; // i did not know that that is something
      if (row === startRow && this.isValid(twoRow, col) && !board[twoRow][col]) {
        moves.push([twoRow, col]);
      }
    }

    // capture left
    const leftCol = col - 1;
    if (this.isValid(nrow, leftCol)) {
      const target = board[nrow][leftCol];
      if (target && this.canCapture(target)) {
        moves.push([nrow, leftCol]);
      }
    }

    // capture right
    const rightCol = col + 1;
    if (this.isValid(nrow, rightCol)) {
      const target = board[nrow][rightCol];
      if (target && this.canCapture(target)) {
        moves.push([nrow, rightCol]);
      }
    }

    return moves;
  }
};