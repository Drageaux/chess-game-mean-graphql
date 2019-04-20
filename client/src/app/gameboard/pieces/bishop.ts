import { Piece } from './piece';
import { Square } from '../square';
import { Move } from '../move';
import { default as movesGetter } from '../moves-getter';

export class Bishop extends Piece {
  constructor(color: 'white' | 'black') {
    super('bishop', color);
  }

  move(board: Square[][]) {
    throw new Error('Method not implemented.');
  }

  getAllPossibleMoves(file: string, rank: number, board: Square[][]): Move[] {
    const params: [string, number, Square[][]] = [file, rank, board];
    let allPossibleMoves = [];
    allPossibleMoves = allPossibleMoves.concat(
      ...movesGetter.getDiagonalLineMoves(this, ...params)
    );
    console.log('bishop moves', allPossibleMoves);
    return allPossibleMoves;
  }
}
