import { Square, FileEnum } from '../square';

export abstract class Piece {
  name: string;
  color: 'white' | 'black';
  constructor(name: string, color: 'white' | 'black') {
    this.name = name;
    this.color = color;
  }

  toString() {
    return this.color + ' ' + this.name;
  }

  abstract move(board: Square[][], position: Square);
  abstract getAllPossibleMoves(file: string, rank: number);
}
