import { Piece } from './piece';
import { Square } from '../square';

export class Bishop extends Piece {
  constructor(color: 'white' | 'black') {
    super('bishop', color);
  }

  move(board: Square[][]) {
    throw new Error('Method not implemented.');
  }
  getAllPossibleMoves(file: string, rank: number) { }
}
