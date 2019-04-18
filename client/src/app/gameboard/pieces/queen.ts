import { Piece } from './piece';

export class Queen extends Piece {
  constructor(color: 'white' | 'black') {
    super('queen', color);
  }
}
