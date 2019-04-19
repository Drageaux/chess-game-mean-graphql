import { Piece } from './piece';
import { Square } from '../square';
import { Move } from '../move';

export class King extends Piece {
  constructor(color: 'white' | 'black') {
    super('king', color);
  }

  move(board: Square[][]) {
    throw new Error('Method not implemented.');
  }

  getAllPossibleMoves(file: string, rank: number, board: Square[][]): Move[] {
    throw new Error('Method not implemented.');
  }
}
