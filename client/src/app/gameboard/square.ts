import { Piece } from './pieces/piece';

export class Square {
  file: string;
  rank: number;
  piece: Piece;

  constructor(file: string, rank: number, piece: any = null) {
    this.file = file;
    this.rank = rank;
    this.piece = piece;
  }

  toString() {
    if (!this.piece) {
      return '';
    }
    return `${this.piece.color} ${this.piece.name}`;
  }

  toPositionString() {
    return `${this.file}${this.rank}`;
  }
}

export enum FileEnum {
  a = 1,
  b = 2,
  c = 3,
  d = 4,
  e = 5,
  f = 6,
  g = 7,
  h = 8
}
