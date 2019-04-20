import { Square, FileEnum } from './square';
import { Move } from './move';

export default class GameboardParser {
  static getSquare(file: string, rank: number, board: Square[][]): Square {
    if (this.isOutOfBound(file, rank)) {
      return null;
    }
    return board[rank - 1][FileEnum[file] - 1];
  }

  static movesToStrings(moves: Move[]): string[] {
    const result: string[] = [];
    for (const m of moves) {
      result.push(m.file + '' + m.rank);
    }
    return result;
  }

  static isOutOfBound(file: string, rank: number) {
    return rank < 1 || rank > 8 || FileEnum[file] < 1 || FileEnum[file] > 8;
  }
}
