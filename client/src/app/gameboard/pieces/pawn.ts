import { Piece } from './piece';

export class Pawn extends Piece {
  constructor(color: 'white' | 'black') {
    super('pawn', color);
  }
}
