// CheckHandler.ts
import type { BoardType, PieceColor, Position } from "@/lib/types";
import { Game } from "@/chess/game"


export class CheckHandler {

  static buildAttackMap(board: BoardType, attackerColor: PieceColor): boolean[][] {
    const attacked = Array.from({ length: 8 }, () => Array(8).fill(false));
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if(piece?.type === "king") continue;
        if(piece && piece.color === attackerColor) {
          const moves = piece.getValidMoves(r, c, board);
          for(const [mr, mc] of moves) attacked[mr][mc] = true;
        }
      }
    }
    return attacked;
  }
  
  static findKing(board: BoardType, color: PieceColor): Position | null {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === "king" && p.color === color) return [r, c];
      }
    }
    return null;
  }

  static isKingInCheckFromBoard(board: BoardType, color: PieceColor): boolean {
    const kingPos = this.findKing(board, color);
    if (!kingPos) return false;
    const attackerColor: PieceColor = color === "white" ? "black" : "white";
    const attackMap = this.buildAttackMap(board, attackerColor);
    const[kr, kc] = kingPos;

    return attackMap[kr][kc];
  }

  static hasLegalMoves(game: Game, color: PieceColor): boolean {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = game.board[r][c];
          if (!piece || piece.color !== color) continue;
          if (game.getLegalMoves(r, c).length > 0) return true;
        }
      }
      return false;
    }

  static isCheckmate(game: Game, color: PieceColor): boolean {
    const inCheck = this.isKingInCheckFromBoard(game.board, color);
    const hasMoves = this.hasLegalMoves(game, color); // example call — adapt logic for your needs
    return inCheck && !hasMoves;
  }
}

