import { Piece } from './piece';
import { Square, FileEnum } from '../square';
import { Move } from '../move';
import { default as movesGetter } from '../moves-getter';

export class Rook extends Piece {
  constructor(color: 'white' | 'black') {
    super('rook', color);
  }

  getAllPossibleMoves(file: string, rank: number, board: Square[][]): Move[] {
    const params: [string, number, Square[][]] = [file, rank, board];
    let allPossibleMoves = [];
    allPossibleMoves = allPossibleMoves.concat(
      ...movesGetter.getStraightLineMoves(this, ...params)
    );
    console.log('rook moves', allPossibleMoves);
    return allPossibleMoves;
  }
}
