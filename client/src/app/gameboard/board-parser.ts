import { Square, FileEnum } from './square';
import { Move } from './move';

export default class BoardParser {
  static getSquare(
    file: string | number,
    rank: number,
    board: Square[][]
  ): Square {
    if (this.isOutOfBound(file, rank)) {
      return null;
    }
    return board[rank - 1][this.fileStrToNum(file) - 1];
  }

  static movesToStrings(moves: Move[]): string[] {
    const result: string[] = [];
    for (const m of moves) {
      result.push(`${m.file}${m.rank}`);
    }
    return result;
  }

  static fileStrToNum(file: string | number): number {
    let fileEnum;
    if (isNaN(Number(file.toString()))) {
      fileEnum = FileEnum[file];
    } else {
      fileEnum = file;
    }
    return fileEnum;
  }

  static isOutOfBound(file: number | string, rank: number) {
    if (!file || !rank) {
      return true;
    }
    // if is a number, get index
    // else turn it into a number
    const fileEnum = this.fileStrToNum(file);

    return rank < 1 || rank > 8 || fileEnum < 1 || fileEnum > 8;
  }
}
