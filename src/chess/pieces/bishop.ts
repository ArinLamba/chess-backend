
import { BISHOP_DIRS } from "../../lib/constants";
import { BoardType, PieceColor, Position } from "../../lib/types";
import { Piece } from "./piece";

export class Bishop extends Piece {
  constructor(color: PieceColor) {
    super(color, "bishop");
  }

  getValidMoves(row: number, col: number, board: BoardType ): Position[] {
    return this.slideMoves(row, col, board, BISHOP_DIRS);
  }
};
