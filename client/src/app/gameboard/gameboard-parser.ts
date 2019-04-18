import { Square, FileEnum } from './square';
import { Move } from './move';

export default class GameboardParser {
  static getSquare(file: string, rank: number, board: Square[][]) {
    return board[rank - 1][FileEnum[file] - 1];
  }

  static movesToStrings(moves: Move[]): string[] {
    const result: string[] = [];
    for (const m of moves) {
      result.push(m.file + '' + m.rank);
    }
    return result;
  }
}
