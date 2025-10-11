import type { Piece } from "../chess/pieces/piece";


export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type PieceColor = "white" | "black";

export type Position = [number, number];

export type BoardType = (Piece | null)[][];

export type MoveInfo = {
  piece: PieceType;
  color: PieceColor;
  from: Position;
  to: Position;

  captured: boolean;
  capturedPiece?: Piece;      // store captured piece if any
  
  prevHasMoved: boolean;      // useful for king/rook (castling)

  isCastling: "kingside" | "queenside" | null;
  isPromotion: boolean;
  promotedPiece?: Piece;      // original piece before promotion
  
  isCheck: boolean;
  isCheckmate: boolean;
};