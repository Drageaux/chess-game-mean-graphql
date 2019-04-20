import { Square, FileEnum } from './square';
import { Move } from './move';
import { default as parser } from './gameboard-parser';
import { Rook } from './pieces/rook';
import { Queen } from './pieces/queen';
import { Bishop } from './pieces/bishop';

const MIN = 1;
const MAX = 8;

export default class MovesGetter {
  static getStraightLineMoves(
    piece: Rook | Queen,
    file: string,
    rank: number,
    board: Square[][]
  ): Move[] {
    const result: Move[] = [];
    const fileEnum: number = FileEnum[file];

    // tslint:disable-next-line:no-console
    console.time('get moves in 1 loop');

    // find the closest piece
    // border-inclusive if piece is enemy (capturable)
    // border-exclusive if piece is friendly (non-capturable)

    // go left
    for (let i = fileEnum - 1; i >= MIN; i--) {
      const s: Square = parser.getSquare(FileEnum[i], rank, board);
      if (s) {
        if (!s.piece) {
          result.push(new Move(FileEnum[i], rank));
        } else {
          if (s.piece.color !== piece.color) {
            result.push(new Move(FileEnum[i], rank));
          }
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
        } else {
          if (s.piece.color !== piece.color) {
            result.push(new Move(FileEnum[i], rank));
          }
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
          if (s.piece.color !== piece.color) {
            result.push(new Move(file, i));
          }
          break;
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
          if (s.piece.color !== piece.color) {
            result.push(new Move(file, i));
          }
          break;
        }
      }
    }
    // tslint:disable-next-line:no-console
    console.timeEnd('get moves in 1 loop');

    return result;
  }

  static getDiagonalLineMoves(
    piece: Bishop | Queen,
    file: string,
    rank: number,
    board: Square[][]
  ): Move[] {
    const result: Move[] = [];
    const fileEnum: number = FileEnum[file];

    // tslint:disable-next-line:no-console
    console.time('get moves in 1 loop');

    // find the closest piece
    // border-inclusive if piece is enemy (capturable)
    // border-exclusive if piece is friendly (non-capturable)

    let bottomLeftStop = false;
    let topLeftStop = false;
    let bottomRightStop = false;
    let topRightStop = false;
    // go left
    for (let distance = MIN; distance <= MAX; distance++) {
      // go bottom-left

      if (
        !bottomLeftStop &&
        !parser.isOutOfBound(FileEnum[fileEnum - distance], rank - distance)
      ) {
        const s1: Square = parser.getSquare(
          FileEnum[fileEnum - distance],
          rank - distance,
          board
        );
        if (s1) {
          if (!s1.piece) {
            result.push(
              new Move(FileEnum[fileEnum - distance], rank - distance)
            );
          } else {
            if (s1.piece.color === piece.color) {
              bottomLeftStop = true;
            } else {
              result.push(
                new Move(FileEnum[fileEnum - distance], rank - distance)
              );
              bottomLeftStop = true;
            }
          }
        }
      }
      // go top-left
      if (
        !parser.isOutOfBound(FileEnum[fileEnum - distance], rank + distance)
      ) {
        const s1: Square = parser.getSquare(
          FileEnum[fileEnum - distance],
          rank + distance,
          board
        );
        if (s1) {
          if (!s1.piece) {
            result.push(
              new Move(FileEnum[fileEnum - distance], rank + distance)
            );
          } else {
            if (s1.piece.color !== piece.color) {
              result.push(
                new Move(FileEnum[fileEnum - distance], rank + distance)
              );
            }
          }
        }
      }

      // go top-left
      /*
      for (let j = rank + 1; j <= MAX; j++) {
        const s: Square = parser.getSquare(FileEnum[i], j, board);
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
      */
    }
    /*
    // go right
    for (let i = fileEnum + 1; i <= MAX; i++) {
      // go top-right
      for (let j = rank + 1; j <= MAX; j++) {
        const s: Square = parser.getSquare(FileEnum[i], j, board);
        if (s) {
          if (!s.piece) {
            result.push(new Move(FileEnum[i], j));
          } else {
            if (s.piece.color === piece.color) {
              break;
            } else if (s.piece.color !== piece.color) {
              result.push(new Move(FileEnum[i], j));
              break;
            }
          }
        }
      }
      // go bottom-right
      for (let j = rank - 1; j >= MIN; j--) {
        const s: Square = parser.getSquare(FileEnum[i], j, board);
        if (s) {
          if (!s.piece) {
            result.push(new Move(FileEnum[i], j));
          } else {
            if (s.piece.color === piece.color) {
              break;
            } else if (s.piece.color !== piece.color) {
              result.push(new Move(FileEnum[i], j));
              break;
            }
          }
        }
      }
      */

    // tslint:disable-next-line:no-console
    console.timeEnd('get moves in 1 loop');

    return result;
  }
}
