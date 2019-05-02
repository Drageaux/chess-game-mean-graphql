export class Move {
  fromFile: string;
  fromRank: number;
  file: string;
  rank: number;
  castle: boolean;
  onAlly: boolean;

  constructor(file: string, rank: number, onAlly: boolean = false) {
    this.file = file;
    this.rank = rank;
    this.onAlly = onAlly;
  }
}
