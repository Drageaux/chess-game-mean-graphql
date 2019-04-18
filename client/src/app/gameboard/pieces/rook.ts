import { Piece } from './piece';
import { Square } from '../square';

export class Rook extends Piece {
  constructor(color: 'white' | 'black') {
    super('rook', color);
  }

  move(board: Square[][]) {
    throw new Error('Method not implemented.');
  }
  getAllPossibleMoves(file: string, rank: number) {}
}
