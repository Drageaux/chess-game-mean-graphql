import { Piece } from './pieces/piece';
import { Square, FileEnum } from './square';
import { Move } from './move';
import { default as parser } from './gameboard-parser';

export default class MovesGetter {
  static getStraightLineMoves(
    piece: Piece,
    file: string,
    rank: number,
    board: Square[][]
  ): Move[] {
    const result: Move[] = [];
    const fileEnum: number = FileEnum[file];

    // tslint:disable-next-line:no-console
    console.time('get moves in 1 loop');

    // find the closest piece
    // border-inclusive if piece is enemy
    // border-exclusive if piece is friendly
    const MIN = 1;
    const MAX = 8;
    // go left
    for (let i = fileEnum - 1; i >= MIN; i--) {
      const s: Square = parser.getSquare(FileEnum[i], rank, board);
      if (s) {
        if (!s.piece) {
          result.push(new Move(FileEnum[i], rank));
        } else if (s.piece && s.piece.color === piece.color) {
          break;
        } else if (s.piece && s.piece.color !== piece.color) {
          result.push(new Move(FileEnum[i], rank));
          break;
        }
      }
    }
    // go right
    for (let i = fileEnum + 1; i <= MAX; i++) {
      const s: Square = parser.getSquare(FileEnum[i], rank, board);
      if (s) {
        if (!s.piece) {
          result.push(new Move(FileEnum[i], rank));
        } else if (s.piece && s.piece.color === piece.color) {
          break;
        } else if (s.piece && s.piece.color !== piece.color) {
          result.push(new Move(FileEnum[i], rank));
          break;
        }
      }
    }
    // go up
    for (let i = rank + 1; i <= MAX; i++) {
      const s: Square = parser.getSquare(file, i, board);
      if (s) {
        if (!s.piece) {
          result.push(new Move(file, i));
        } else {
          if (s.piece.color === piece.color) {
            break;
          } else if (s.piece.color !== piece.color) {
            result.push(new Move(file, i));
            break;
          }
        }
      }
    }
    // go down
    for (let i = rank - 1; i >= MIN; i--) {
      const s: Square = parser.getSquare(file, i, board);
      if (s) {
        if (!s.piece) {
          result.push(new Move(file, i));
        } else {
          if (s.piece.color === piece.color) {
            break;
          } else if (s.piece.color !== piece.color) {
            result.push(new Move(file, i));
            break;
          }
        }
      }
    }
    // tslint:disable-next-line:no-console
    console.timeEnd('get moves in 1 loop');

    return result;
  }
}
