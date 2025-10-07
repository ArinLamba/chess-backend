import type { BoardType, PieceColor, PieceType, Position } from "../../lib/types";

export abstract class Piece {
  color: PieceColor;
  type: PieceType;
  hasMoved: boolean;

  constructor(color: PieceColor, type: PieceType) {
    this.color = color;
    this.type = type;
    this.hasMoved = false;
  }

  // every piece must implement this method
  abstract getValidMoves (row: number, col: number, board: BoardType ) : Position[];

  // shared helper: check if a position is on board
  protected isValid(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  // ✅ check if target square is empty or opponent 
  protected canCapture(target: Piece | null): boolean {
    return !target || target.color !== this.color;
  }

  // for sliding pieces like b, q, r
  protected slideMoves(
    row: number,
    col: number,
    board: BoardType,
    directions: number[][]
  ): Position[] {
    const moves: Position[] = [];

    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;

      while (this.isValid(r, c)) {
        const target = board[r][c];

        if (target === null) {
          moves.push([r, c]);
        } else {
          if (this.canCapture(target)) moves.push([r, c]);
          break;
        }

        r += dr;
        c += dc;
      }
    }

    return moves;
  }

};