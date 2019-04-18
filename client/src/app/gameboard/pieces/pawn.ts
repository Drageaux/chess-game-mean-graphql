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
    const allPossibleMoves: string[] = [];
    if (this.color === 'white') {
      allPossibleMoves.push(file + '' + (rank + 1));
      if (!this.firstMoved) {
        allPossibleMoves.push(file + '' + (rank + 2));
      }
    }

    return allPossibleMoves;
  }
}
