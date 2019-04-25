import { Square, FileEnum } from '../square';
import { Move } from '../move';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export abstract class Piece {
  name: string;
  color: 'white' | 'black';
  myFile: string;
  myRank: number;

  constructor(name: string, color: 'white' | 'black') {
    this.name = name;
    this.color = color;
  }

  toString() {
    return `${this.color} ${this.name}`;
  }

  getAttackMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Observable<Move[]> {
    return this.getAllPossibleMoves(file, rank, board);
  }

  getAllLegalMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Observable<Move[]> {
    // let allLegalMoves: Observable<Move[]> = [];
    // const allPossibleMoves =
    return this.getAllPossibleMoves(file, rank, board).pipe(
      map((moves: Move[]) => moves.filter(m => !m.onAlly))
    );
    // allLegalMoves =
    // return allLegalMoves;
  }

  protected abstract getAllPossibleMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Observable<Move[]>;
}
