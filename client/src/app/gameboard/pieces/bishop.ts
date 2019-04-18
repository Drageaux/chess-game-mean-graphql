import { Piece } from './piece';

export class Bishop extends Piece {
  constructor(color: 'white' | 'black') {
    super('bishop', color);
  }
}
