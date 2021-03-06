import { Piece } from './piece';
import { Square, FileEnum } from '../square';
import { Move } from '../move';
import { default as movesGetter } from '../moves-getter';
import { default as parser } from '../board-parser';
import { Observable, of } from 'rxjs';
import { Rook } from './rook';

export class King extends Piece {
  // tslint:disable-next-line:variable-name
  private _canCastle = true;
  hasMoved = false;

  constructor(color: 'white' | 'black', hasMoved: boolean = false) {
    super('king', color);
    if (this.hasMoved) {
      this._canCastle = false;
    }
  }

  get isKing(): boolean {
    return true;
  }

  get canCastle() {
    return this._canCastle;
  }

  updateHasMoved() {
    this.hasMoved = true;
    this._canCastle = false;
  }

  getAllPossibleMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Observable<Move[]> {
    const params: [string, number, Square[][]] = [file, rank, board];
    let allPossibleMoves = [];
    allPossibleMoves = allPossibleMoves.concat(
      ...this.getRegularMoves(...params),
      ...this.getCastlingMoves(...params)
    );
    return of(allPossibleMoves);
  }

  private getRegularMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Move[] {
    const result: Move[] = [];
    const fileEnum: number = FileEnum[file];
    // 1,0 0,1 -1,0 0,-1
    // 1,1 -1,-1, -1,1 1,-1
    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        if (row === 0 && col === 0) {
          continue;
        } else {
          movesGetter.appendPossibleMove(
            this,
            result,
            fileEnum + row,
            rank + col,
            board
          );
        }
      }
    }

    return result;
  }

  private getCastlingMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Move[] {
    const result: Move[] = [];
    if (!this.hasMoved && this.canCastle) {
      // left side castle
      const leftRookSquare = parser.getSquare(1, rank, board);
      let leftRoadClear = true;
      if (
        leftRookSquare.piece &&
        leftRookSquare.piece.color === this.color &&
        !(leftRookSquare.piece as Rook).hasMoved
      ) {
        // check if road's clear
        for (let i = 2; i < FileEnum[file]; i++) {
          const sq = parser.getSquare(i, rank, board);
          if (sq && sq.piece) {
            leftRoadClear = false;
            break;
          }
        }
        if (leftRoadClear) {
          movesGetter.appendPossibleMove(this, result, 3, rank, board);
        }
      }
      // right side castle
      const rightRookSquare = parser.getSquare(8, rank, board);
      let rightRoadClear = true;
      if (
        rightRookSquare.piece &&
        rightRookSquare.piece.color === this.color &&
        !(rightRookSquare.piece as Rook).hasMoved
      ) {
        // check if road's clear
        for (let i = 7; i > FileEnum[file]; i--) {
          const sq = parser.getSquare(i, rank, board);
          if (sq && sq.piece) {
            rightRoadClear = false;
            break;
          }
        }
        if (rightRoadClear) {
          movesGetter.appendPossibleMove(this, result, 7, rank, board);
        }
      }
    }

    for (const move of result) {
      move.castle = true;
    }
    return result;
  }
}
