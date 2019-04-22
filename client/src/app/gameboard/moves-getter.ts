import { Square, FileEnum } from './square';
import { Move } from './move';
import { default as parser } from './gameboard-parser';
import { Rook } from './pieces/rook';
import { Queen } from './pieces/queen';
import { Bishop } from './pieces/bishop';

const MIN = 1;
const MAX = 8;

export default class MovesGetter {
  static makeMove(file: string | number, rank: number): Move {
    try {
      let moveFile: string;
      let moveRank: number;
      // not hurting performance that much
      if (file) {
        if (!isNaN(Number(file.toString()))) {
          moveFile = FileEnum[file];
        } else {
          moveFile = file.toString();
        }
      }
      if (!moveFile || !Object.values(FileEnum).includes(moveFile)) {
        throw Error('Wrong file/column input: a-h only');
      }
      moveRank = rank;
      if (!moveRank || moveRank < 1 || moveRank > 8) {
        throw Error('Wrong rank/row input: 1-8 only');
      }
      return new Move(moveFile, moveRank);
    } catch (e) {
      console.error(e);
    }
  }

  static getStraightLineMoves(
    piece: Rook | Queen,
    file: string,
    rank: number,
    board: Square[][]
  ): Move[] {
    const result: Move[] = [];
    const fileEnum: number = FileEnum[file];

    // tslint:disable-next-line:no-console
    console.time('get straight lines');

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
    console.timeEnd('get straight lines');

    return result;
  }

  /**
   * Breadth-first search for the correct square.
   * Stop going in a direction when hitting a border or a friendly piece
   *
   * @param piece - the Piece being picked up
   * @param file - horizontal coordinate
   * @param rank - vertical coordinate
   * @param board - the active gameboard
   */
  static getDiagonalLineMoves(
    piece: Bishop | Queen,
    file: string,
    rank: number,
    board: Square[][]
  ): Move[] {
    const result: Move[] = [];
    const fileEnum: number = FileEnum[file];

    // tslint:disable-next-line:no-console
    console.time('get diagonal lines');

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
        const s: Square = parser.getSquare(
          FileEnum[fileEnum - distance],
          rank - distance,
          board
        );
        if (s) {
          if (!s.piece) {
            result.push(
              new Move(FileEnum[fileEnum - distance], rank - distance)
            );
          } else {
            if (s.piece.color === piece.color) {
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
        !topLeftStop &&
        !parser.isOutOfBound(FileEnum[fileEnum - distance], rank + distance)
      ) {
        const s: Square = parser.getSquare(
          FileEnum[fileEnum - distance],
          rank + distance,
          board
        );
        if (s) {
          if (!s.piece) {
            result.push(
              new Move(FileEnum[fileEnum - distance], rank + distance)
            );
          } else {
            if (s.piece.color !== piece.color) {
              result.push(
                new Move(FileEnum[fileEnum - distance], rank + distance)
              );
            }
            topLeftStop = true;
          }
        }
      }
      // go top-right
      if (
        !topRightStop &&
        !parser.isOutOfBound(FileEnum[fileEnum + distance], rank + distance)
      ) {
        const s: Square = parser.getSquare(
          FileEnum[fileEnum + distance],
          rank + distance,
          board
        );
        if (s) {
          if (!s.piece) {
            result.push(
              new Move(FileEnum[fileEnum + distance], rank + distance)
            );
          } else {
            if (s.piece.color !== piece.color) {
              result.push(
                new Move(FileEnum[fileEnum + distance], rank + distance)
              );
            }
            topRightStop = true;
          }
        }
      }
      // go bottom-right
      if (
        !bottomRightStop &&
        !parser.isOutOfBound(FileEnum[fileEnum + distance], rank - distance)
      ) {
        const s: Square = parser.getSquare(
          FileEnum[fileEnum + distance],
          rank - distance,
          board
        );
        if (s) {
          if (!s.piece) {
            result.push(
              new Move(FileEnum[fileEnum + distance], rank - distance)
            );
          } else {
            if (s.piece.color !== piece.color) {
              result.push(
                new Move(FileEnum[fileEnum + distance], rank - distance)
              );
            }
            bottomRightStop = true;
          }
        }
      }
    }

    // tslint:disable-next-line:no-console
    console.timeEnd('get diagonal lines');

    return result;
  }
}
