import { Square, FileEnum } from '../square';
import { Move } from '../move';

export abstract class Piece {
  name: string;
  color: 'white' | 'black';
  nextMoves: Move[] = [];

  constructor(name: string, color: 'white' | 'black') {
    this.name = name;
    this.color = color;
  }

  toString() {
    return `${this.color} ${this.name}`;
  }

  updateNextMoves(file: string, rank: number, board: Square[][]) {
    this.nextMoves = this.getAllPossibleMoves(file, rank, board);
  }

  abstract getAllPossibleMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Move[];
}
