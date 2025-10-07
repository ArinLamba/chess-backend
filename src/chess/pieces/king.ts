
import type { BoardType, PieceColor, Position } from "../../lib/types";
import { Piece } from "./piece";
import { KING_DIRS } from "../../lib/constants";


export class King extends Piece {
  constructor(color: PieceColor) {
    super(color, "king");
  }

  getValidMoves(row: number, col: number, board: BoardType): Position[] {
    const moves: Position[] = [];
    // const opponentColor = this.color === "white" ? "black" : "white";
    // const attackedSquares = buildAttackMap(board, opponentColor);

    // if(!this.hasMoved) {
    //   // king side casteling
    //   if(canCastle(board, row, col, "kingside", this.color, attackedSquares)) {
    //     moves.push([row, col + 2]);
    //   }

    //   // queen side casteling
    //   if(canCastle(board, row, col, "queenside", this.color, attackedSquares)) {
    //     moves.push([row, col - 2]);
    //   }
    // }

    for(const [dr, dc] of KING_DIRS) {
      const r = row + dr;
      const c = col + dc;

      if(!this.isValid(r, c) ) continue;
      const target = board[r][c];
      if(target === null || this.canCapture(target)) {
        moves.push([r, c]);
      }
    }

    return moves;
  }
};