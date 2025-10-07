
import { KNIGHT_MOVES } from "../../lib/constants";
import { BoardType, PieceColor, Position } from "../../lib/types";
import { Piece } from "./piece";

export class Knight extends Piece {
  constructor(color: PieceColor) {
    super(color, "knight");
  }

  getValidMoves(row: number, col: number, board: BoardType ): Position[] {
    const moves: Position[] = [];
    
    for(const [dr, dc] of KNIGHT_MOVES) {
      const r = row + dr;
      const c = col + dc;
      
      // stay inside board
      if (!this.isValid(r, c)) continue;
      const target = board[r][c];

      // can move if empty or opponent piece at the place
      if(this.canCapture(target)) {
        moves.push([r, c]);
      }
    }

    return moves;
  }

};