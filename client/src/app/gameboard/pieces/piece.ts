import { Square } from '../square';
import { Move } from '../move';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

export abstract class Piece {
  // tslint:disable-next-line:variable-name
  private _id: string;
  name: string;
  color: 'white' | 'black';
  myFile: string;
  myRank: number;

  constructor(name: string, color: 'white' | 'black') {
    this._id = uuid();
    this.name = name;
    this.color = color;
  }

  toString() {
    return `${this.color} ${this.name}`;
  }

  get id() {
    return this._id;
  }

  getAttackMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Observable<Move[]> {
    return this.getAllPossibleMoves(file, rank, board).pipe(
      distinctUntilChanged()
    );
  }

  getAllLegalMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Observable<Move[]> {
    return this.getAllPossibleMoves(file, rank, board).pipe(
      distinctUntilChanged(),
      map((moves: Move[]) => moves.filter(m => !m.onAlly))
    );
  }

  get isKing(): boolean {
    return false;
  }

  protected abstract getAllPossibleMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Observable<Move[]>;
}
