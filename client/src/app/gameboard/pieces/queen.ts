import { Piece } from './piece';
import { Square } from '../square';
import { Move } from '../move';
import { default as movesGetter } from '../moves-getter';

export class Queen extends Piece {
  constructor(color: 'white' | 'black') {
    super('queen', color);
  }

  getAllPossibleMoves(file: string, rank: number, board: Square[][]): Move[] {
    const params: [string, number, Square[][]] = [file, rank, board];
    let allPossibleMoves = [];
    allPossibleMoves = allPossibleMoves.concat(
      ...movesGetter.getDiagonalLineMoves(this, ...params),
      ...movesGetter.getStraightLineMoves(this, ...params)
    );
    return allPossibleMoves;
  }
}
