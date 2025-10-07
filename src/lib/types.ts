import type { Piece } from "../chess/pieces/piece";


export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type PieceColor = "white" | "black";

export type Position = [number, number];

export type BoardType = (Piece | null)[][];

export type MoveInfo = {
  piece: PieceType
  from: Position;
  to: Position;
  color: PieceColor;
  captured: boolean;
  isCastling: "kingside" | "queenside" | null;
  isCheck: boolean;
  isCheckmate: boolean;
}