import { Piece } from './piece';
import { Square } from '../square';

export class Knight extends Piece {
  constructor(color: 'white' | 'black') {
    super('knight', color);
  }

  move(board: Square[][]) {
    throw new Error('Method not implemented.');
  }
  getAllPossibleMoves(file: string, rank: number) { }
}
