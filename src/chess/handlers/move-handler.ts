// MoveHandler.ts
import type { Position, BoardType, MoveInfo } from "@/lib/types";
import { CheckHandler } from "./check-handler";
import { Game } from "@/chess/game";
import { Piece } from "@/chess/pieces/piece";
import { PieceFactory } from "@/chess/handlers/piece-factory";


export class MoveHandler {
  static moveMetadata(game: Game, from: Position, to: Position): MoveInfo | null {
    const [fr, fc] = from;
    const [tr, tc] = to;

    const piece = game.board[fr][fc];
    const targetPiece = game.board[tr][tc];
    if (!piece) return null;

    const wasCapture = !!targetPiece;
    const wasCastling =
      piece.type === "king" && Math.abs(tc - fc) === 2
        ? (tc > fc ? "kingside" : "queenside")
        : null;

    // Promotion check
    const isPromotion =
      piece.type === "pawn" &&
      ((piece.color === "white" && tr === 0) || (piece.color === "black" && tr === 7));

    const opponent = piece.color === "white" ? "black" : "white";

    // Simulate to check check/checkmate
    const simulatedBoard = this.simulateMove(game, from, to);
    const isCheck = CheckHandler.isKingInCheckFromBoard(simulatedBoard, opponent);
    const isCheckmate = CheckHandler.isCheckmate(game, opponent);

    return {
      piece: piece.type,
      color: piece.color,
      from,
      to,
      captured: wasCapture,
      capturedPiece: targetPiece ?? undefined,
      prevHasMoved: piece.hasMoved,
      isCastling: wasCastling,
      isPromotion,
      promotedPiece: undefined, // will be set later during actual move
      isCheck,
      isCheckmate,
    };
  }

  static movePieceOnBoard(board: BoardType, from: Position, to: Position) {
    const [fr, fc] = from;
    const [tr, tc] = to;
    const piece = board[fr][fc];
    if (!piece) return;

    board[tr][tc] = piece;
    board[fr][fc] = null;
    piece.hasMoved = true;

    this.handleSpecialMoves(board, piece, from, to);
  }

  private static handleSpecialMoves(board: BoardType, piece: Piece, from: Position, to: Position) {
    if (this.isCastlingMove(piece, from, to)) this.handleCastling(board, from, to);
    if (this.isPawnPromotion(piece, to[0])) this.handlePromotion(board, to, piece);
  }

  // -------------------- CASTLING VALIDATION --------------------
  private static isCastlingMove(piece: Piece, from: Position, to: Position): boolean {
    return piece.type === "king" && Math.abs(to[1] - from[1]) === 2;
  }

  static validateCastling(game: Game, from: Position, to: Position, piece: Piece): boolean {
    if (!this.isCastlingMove(piece, from, to)) return false;

    const [row, col] = from;
    const [, tc] = to;
    const dir = tc > col ? 1 : -1;
    const pathCols = [col, col + dir, tc];
    const attackerColor = piece.color === "white" ? "black" : "white";

    for (const c of pathCols) {
      if (CheckHandler.isSquareAttacked([row, c], attackerColor, game.board)) return false;
    }

    return true;
  }
  private static handleCastling(board: BoardType, from: Position, to: Position) {
    const [fr, fc] = from;
    const [, tc] = to;
    const isKingSide = tc > fc;
    const rookFromCol = isKingSide ? 7 : 0;
    const rookToCol = isKingSide ? 5 : 3;

    const rook = board[fr][rookFromCol];
    board[fr][rookToCol] = rook;
    board[fr][rookFromCol] = null;
    if (rook) rook.hasMoved = true;
  }

  private static isPawnPromotion(piece: Piece, row: number): boolean {
    if (piece.type !== "pawn") return false;
    const lastRank = piece.color === "white" ? 0 : 7;
    return row === lastRank;
  }
  private static handlePromotion(board: BoardType, to: Position, piece: Piece) {
    // TODO: prompt a modal or name to choose the piece to promote
    const [tr, tc] = to;
    board[tr][tc] = PieceFactory.createPiece("queen", piece.color);
  }
  
  private static simulateMove(game: Game, from: Position, to: Position): BoardType {
    const b = game.cloneBoard();
    this.movePieceOnBoard(b, from, to);
    return b;
  }


  static computeLegalMoves(game: Game, row: number, col: number): Position[] {
    const piece = game.board[row][col];
    if (!piece || piece.color !== game.turn) return [];

    const pseudoMoves = piece.getValidMoves(row, col, game.board);
    const legal: Position[] = [];
    for (const [tr, tc] of pseudoMoves) {
      const simulated = this.simulateMove(game, [row, col], [tr, tc]);

      if(this.isCastlingMove(piece, [row, col], [tr, tc])) {
        if(!this.validateCastling(game, [row, col], [tr, tc], piece)) continue;
      }

      if (!CheckHandler.isKingInCheckFromBoard(simulated, piece.color)) {
        legal.push([tr, tc]);
      }
    }
    return legal;
  }
}

