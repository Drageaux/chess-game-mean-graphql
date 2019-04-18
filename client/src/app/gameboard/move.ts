export class Move {
  rank: number;
  file: string;
  piece: any;

  constructor(rank: number, file: string, byPiece: any = null) {
    this.rank = rank;
    this.file = file;
  }

  isLegalMove() {}
}
