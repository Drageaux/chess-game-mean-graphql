import { Piece } from './piece';
import { Square } from '@shared/interfaces';
import { Move } from '../move';
import { default as movesGetter } from '../moves-getter';
import { Observable, of } from 'rxjs';

export class Bishop extends Piece {
  constructor(color: 'white' | 'black') {
    super('bishop', color);
  }

  getAllPossibleMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Observable<Move[]> {
    const params: [string, number, Square[][]] = [file, rank, board];
    let allPossibleMoves = [];
    allPossibleMoves = allPossibleMoves.concat(
      ...movesGetter.getDiagonalLineMoves(this, ...params)
    );
    return of(allPossibleMoves);
  }
}
