import { Piece } from './piece';

export class King extends Piece {
  constructor(color: 'white' | 'black') {
    super('king', color);
  }
}
