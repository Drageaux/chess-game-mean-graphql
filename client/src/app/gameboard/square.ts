export class Square {
  rank: number;
  file: string;
  piece: any;

  constructor(rank: number, file: string, piece: any = null) {
    this.rank = rank;
    this.file = file;
    this.piece = piece;
  }

  toString() {
    if (!this.piece) {
      return '';
    }
    return this.piece.color + ' ' + this.piece.name;
  }

  toPositionString() {
    return '' + this.file + this.rank;
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
