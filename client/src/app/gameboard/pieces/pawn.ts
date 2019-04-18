import { Move } from './../move';
import { Piece } from './piece';
import { Square, FileEnum } from '../square';

export class Pawn extends Piece {
  firstMoved = false;

  constructor(color: 'white' | 'black') {
    super('pawn', color);
  }

  move(board: Square[][], position: Square) {
    throw new Error('Method not implemented.');
  }

  getAllPossibleMoves(file: string, rank: number) {
    const allPossibleMoves: Move[] = [];
    if (this.color === 'white') {
      allPossibleMoves.push(new Move(rank + 1, file, this));
      if (!this.firstMoved) {
        allPossibleMoves.push(new Move(rank + 2, file, this));
      }
    }

    return allPossibleMoves;
  }
}
