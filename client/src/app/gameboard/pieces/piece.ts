import { Square, FileEnum } from '../square';
import { Move } from '../move';

export abstract class Piece {
  name: string;
  color: 'white' | 'black';
  myFile: string;
  myRank: number;
  attackMoves: Move[] = [];

  constructor(name: string, color: 'white' | 'black') {
    this.name = name;
    this.color = color;
  }

  toString() {
    return `${this.color} ${this.name}`;
  }

  updateAttackMoves(file: string, rank: number, board: Square[][]) {
    this.attackMoves = this.getAllPossibleMoves(file, rank, board);
  }

  getAllLegalMoves(file: string, rank: number, board: Square[][]): Move[] {
    let allLegalMoves: Move[] = [];
    const allPossibleMoves = this.getAllPossibleMoves(file, rank, board);
    allLegalMoves = allPossibleMoves.filter(m => !m.onAlly);
    return allLegalMoves;
  }

  protected abstract getAllPossibleMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Move[];
}
