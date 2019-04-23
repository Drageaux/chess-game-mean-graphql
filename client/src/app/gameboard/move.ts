export class Move {
  file: string;
  rank: number;
  castle: boolean;

  constructor(file: string, rank: number, castle = false) {
    this.file = file;
    this.rank = rank;
  }
}
