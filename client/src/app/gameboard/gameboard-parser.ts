import { Square, FileEnum } from './square';
import { Move } from './move';

export default class GameboardParser {
  static getSquare(
    file: string | number,
    rank: number,
    board: Square[][]
  ): Square {
    if (!file || !rank) {
      return null;
    }
    // if is a number, get index
    // else turn it into a number
    let fileEnum;
    if (isNaN(Number(file.toString()))) {
      fileEnum = FileEnum[file];
    } else {
      fileEnum = file;
    }

    if (this.isOutOfBound(fileEnum, rank)) {
      return null;
    }
    return board[rank - 1][fileEnum - 1];
  }

  static movesToStrings(moves: Move[]): string[] {
    const result: string[] = [];
    for (const m of moves) {
      result.push(m.file + '' + m.rank);
    }
    return result;
  }

  static isOutOfBound(file: number, rank: number) {
    return rank < 1 || rank > 8 || file < 1 || file > 8;
  }
}
