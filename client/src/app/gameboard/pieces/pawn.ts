import { Move } from './../move';
import { Piece } from './piece';
import { Square, FileEnum } from '../square';
import { default as parser } from '../board-parser';
import { default as movesGetter } from '../moves-getter';

export class Pawn extends Piece {
  constructor(color: 'white' | 'black') {
    super('pawn', color);
  }

  // we only care about dangerous moves
  updateAttackMoves(file: string, rank: number, board: Square[][]) {
    const params: [string, number, Square[][]] = [file, rank, board];
    const newAttackMoves = [];
    // get diagonal moves, because getCapturableMoves() requires an enemy Piece
    this.attackMoves = newAttackMoves.concat(...this.getDiagMoves(...params));
  }

  // get board-aware moves
  getAllPossibleMoves(file: string, rank: number, board: Square[][]): Move[] {
    const params: [string, number, Square[][]] = [file, rank, board];
    let allPossibleMoves = [];
    allPossibleMoves = allPossibleMoves.concat(
      ...this.getRegularMoves(...params),
      ...this.getCapturableMoves(...params)
    );

    return allPossibleMoves;
  }

  // return rank/row depending on color and number of squares
  private getVerMoves(rank: number, noSquares: number): number {
    if (this.color === 'white') {
      return rank + noSquares <= 8 ? rank + noSquares : null;
    } else {
      return rank - noSquares >= 1 ? rank - noSquares : null;
    }
  }

  // noSquares negative for left, positive for right
  private getHorMoves(file: string, noSquares: number): string {
    if (noSquares === 0) {
      return null;
    }

    const fileNum: number = FileEnum[file];
    if (noSquares > 0) {
      const rightFileEnum =
        fileNum + noSquares <= 8 ? fileNum + noSquares : null;
      return rightFileEnum ? FileEnum[rightFileEnum] : null;
    } else if (noSquares < 0) {
      const leftFileEnum =
        fileNum + noSquares >= 1 ? fileNum + noSquares : null;
      return leftFileEnum ? FileEnum[leftFileEnum] : null;
    }
  }

  private getRegularMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Move[] {
    const result: Move[] = [];
    const firstMove =
      (rank === 2 && this.color === 'white') ||
      (rank === 7 && this.color === 'black');
    const moveForward = this.getVerMoves(rank, 1);
    const moveForwardTwo = this.getVerMoves(rank, 2);

    if (moveForward) {
      const sq = parser.getSquare(file, moveForward, board);
      if (sq && !sq.piece) {
        result.push(movesGetter.makeMove(file, moveForward));
      }
    }
    if (firstMove) {
      const sq1 = parser.getSquare(file, moveForward, board);
      const sq2 = parser.getSquare(file, moveForwardTwo, board);
      if (sq1 && !sq1.piece && sq2 && !sq2.piece) {
        result.push(movesGetter.makeMove(file, moveForwardTwo));
      }
    }
    return result;
  }

  private getDiagMoves(file: string, rank: number, board: Square[][]): Move[] {
    const result: Move[] = [];
    const forwardRank = this.getVerMoves(rank, 1);
    if (!forwardRank) {
      return [];
    }
    // get right coordinate and check if its legal
    const rightFile = this.getHorMoves(file, 1);
    // get left coordinate and check if its legal
    const leftFile = this.getHorMoves(file, -1);

    // check both right and left square diagonally in front
    if (rightFile) {
      const sq = parser.getSquare(rightFile, forwardRank, board);
      if (sq && ((sq.piece && sq.piece.color !== this.color) || !sq.piece)) {
        result.push(movesGetter.makeMove(rightFile, forwardRank));
      }
    }
    if (leftFile) {
      const sq = parser.getSquare(leftFile, forwardRank, board);
      if (sq && ((sq.piece && sq.piece.color !== this.color) || !sq.piece)) {
        result.push(movesGetter.makeMove(leftFile, forwardRank));
      }
    }
    return result;
  }

  // capture an enemy by moving 1 square diagonally
  private getCapturableMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Move[] {
    const result: Move[] = [];
    const forwardRank = this.getVerMoves(rank, 1);
    if (!forwardRank) {
      return [];
    }
    // get right coordinate and check if its legal
    const rightFile = this.getHorMoves(file, 1);
    // get left coordinate and check if its legal
    const leftFile = this.getHorMoves(file, -1);

    // check both right and left square diagonally in front
    if (rightFile) {
      const sq = parser.getSquare(rightFile, forwardRank, board);
      if (sq && sq.piece && sq.piece.color !== this.color) {
        result.push(movesGetter.makeMove(rightFile, forwardRank));
      }
    }
    if (leftFile) {
      const sq = parser.getSquare(leftFile, forwardRank, board);
      if (sq && sq.piece && sq.piece.color !== this.color) {
        result.push(movesGetter.makeMove(leftFile, forwardRank));
      }
    }
    return result;
  }

  promote() {
    throw Error('Method not implemented');
  }
}
