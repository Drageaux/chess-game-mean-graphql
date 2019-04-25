import { Piece } from './piece';
import { Square } from '../square';
import { Move } from '../move';
import { default as movesGetter } from '../moves-getter';
import { EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';

export class Rook extends Piece {
  hasMoved = new EventEmitter<boolean>();

  constructor(color: 'white' | 'black', hasMoved: boolean = false) {
    super('rook', color);
  }

  updateHasMoved() {
    this.hasMoved.emit(true);
  }

  getAllPossibleMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Observable<Move[]> {
    const params: [string, number, Square[][]] = [file, rank, board];
    let allPossibleMoves = [];
    allPossibleMoves = allPossibleMoves.concat(
      ...movesGetter.getStraightLineMoves(this, ...params)
    );
    return of(allPossibleMoves);
  }
}
