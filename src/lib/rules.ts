
import type { PieceColor, BoardType } from "./types";

export const canCastle = (board: BoardType, row: number, col: number, side: "kingside" | "queenside", color: PieceColor, attackedSquares: boolean[][]): boolean => {

  const rookCol = side === "kingside" ? 7 : 0;
  const step = side === "kingside" ? 1 : -1;

  const rook = board[row][rookCol];
  const king = board[row][col];

  // 1. Check pieces exist and unmoved
  if (!rook || rook.type !== "rook" || rook.color !== color || rook.hasMoved) return false;
  if (!king || king.type !== "king" || king.color !== color || king.hasMoved) return false;

  // 2. Check empty squares between king and rook
  for (let c = col + step; c !== rookCol; c += step) {
    if (board[row][c] !== null) return false;
  }

  // 3. Check king is not in or passing through check
  for (let c = col; c !== col + step * 3; c += step) {
    if (attackedSquares[row][c]) return false;
    if (Math.abs(c - col) === 2) break; // stop once king’s destination checked
  }

  return true;
}