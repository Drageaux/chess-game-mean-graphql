import { Piece } from './piece';
import { Square } from '../square';

export class King extends Piece {
  constructor(color: 'white' | 'black') {
    super('king', color);
  }

  move(board: Square[][]) {
    throw new Error('Method not implemented.');
  }
  getAllPossibleMoves(file: string, rank: number) {}
}
