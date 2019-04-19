import { Move } from './../move';
import { Piece } from './piece';
import { Square, FileEnum } from '../square';
import { default as parser } from '../gameboard-parser';

export class Pawn extends Piece {
  constructor(color: 'white' | 'black') {
    super('pawn', color);
  }

  move(board: Square[][], position: Square) {
    throw new Error('Method not implemented.');
  }

  // get board-agnostic moves
  getAllPossibleMoves(file: string, rank: number, board: Square[][]): Move[] {
    const params: [string, number, Square[][]] = [file, rank, board];
    let allPossibleMoves = [];
    if (this.color === 'white') {
      allPossibleMoves = allPossibleMoves.concat(
        ...this.getWhitePieceMoves(...params)
      );

      console.table(allPossibleMoves);
    }
    return allPossibleMoves;
  }

  // get moves for white pawns only
  private getWhitePieceMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Move[] {
    const params: [string, number, Square[][]] = [file, rank, board];
    let result = [];
    const firstMove = rank === 2;

    if (rank + 1 <= 8) {
      const sq = parser.getSquare(file, rank + 1, board);
      if (!sq.piece) {
        result.push(new Move(file, rank + 1));
      }
    }
    if (firstMove) {
      const sq1 = parser.getSquare(file, rank + 1, board);
      const sq2 = parser.getSquare(file, rank + 2, board);
      if (!sq1.piece && !sq2.piece) {
        result.push(new Move(file, rank + 2));
      }
    }
    // capture an enemy by moving 1 square diagonally
    result = result.concat(...this.getCapturableMoves(...params));

    return result;
  }

  private getBlackPieceMoves(file: string, rank: number, board: Square[][]) {}

  private getCapturableMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Move[] {
    const params: [string, number, Square[][]] = [file, rank, board];
    const result: Move[] = [];

    const fileNum = FileEnum[file];
    const rightFileEnum: number = fileNum + 1;
    const leftFileEnum: number = fileNum - 1;
    if (rank + 1 <= 8) {
      if (rightFileEnum <= 8) {
        const sq = parser.getSquare(FileEnum[rightFileEnum], rank + 1, board);
        if (sq.piece && sq.piece.color !== this.color) {
          result.push(new Move(FileEnum[rightFileEnum], rank + 1));
        }
      }
      if (leftFileEnum >= 1) {
        const sq = parser.getSquare(FileEnum[leftFileEnum], rank + 1, board);
        if (sq.piece && sq.piece.color !== this.color) {
          result.push(new Move(FileEnum[leftFileEnum], rank + 1));
        }
      }
    }
    return result;
  }

  // get board-aware moves
  // getLegalMoves(fromFile: string, fromRank: number, board: Square[][]): Move[] {
  //   let result = [];
  //   const allPossibleMoves = this.getAllPossibleMoves(fromFile, fromRank);

  //   result = allPossibleMoves;
  //   // TODO: differentiate 2-colored pawn
  //   for (const m of allPossibleMoves) {
  //     // TODO: block if anyone in front
  //     const square = parser.getSquare(m.file, m.rank, board);
  //     if (square.piece) {
  //       continue;
  //     } else if () {}  else {
  //       result.push(m);
  //     }
  //   }

  //   // TODO: allow if opponent 1 square away diagonally

  //   return result;
  // }
}
