import { Piece } from './piece';

export class Knight extends Piece {
  constructor(color: 'white' | 'black') {
    super('knight', color);
  }
}
