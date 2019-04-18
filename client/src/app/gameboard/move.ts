export class Move {
  file: string;
  rank: number;

  constructor(file: string, rank: number) {
    this.file = file;
    this.rank = rank;
  }

  isLegalMove() {}
}
