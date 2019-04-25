import { Square, FileEnum } from './square';
import { Move } from './move';
import { default as parser } from './board-parser';
import { Rook } from './pieces/rook';
import { Queen } from './pieces/queen';
import { Bishop } from './pieces/bishop';
import { Piece } from './pieces/piece';
import { King } from './pieces/king';

// turn this to true to console log time
const performanceTest = false;
const MIN = 1;
const MAX = 8;

export default class MovesGetter {
  static makeMove(
    file: string | number,
    rank: number,
    onAlly: boolean = false
  ): Move {
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
      return new Move(moveFile, moveRank, onAlly);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * If move is valid, append Move to the passed-in moveArr, else append nothing
   * and return null.
   *
   * @params currPiece - the Piece we're trying to add
   * @params moveArr - the [[Move]] array to add currPiece
   * @returns whether the move is the end of the line
   */
  static appendPossibleMove(
    currPiece: Piece,
    moveArr: Move[],
    newFileEnum: number,
    newRank: number,
    board: Square[][]
  ): boolean {
    // first, get valid Square
    const s: Square = parser.getSquare(newFileEnum, newRank, board);
    let newMove: Move;
    if (s) {
      if (!s.piece) {
        // NOT overlapping onAlly if empty square
        newMove = this.makeMove(newFileEnum, newRank, false);
        moveArr.push(newMove);
        // don't stop
        return false;
      } else {
        if (s.piece.color !== currPiece.color) {
          // NOT overlapping onAlly if different color
          newMove = this.makeMove(newFileEnum, newRank, false);
          moveArr.push(newMove);
          // don't have to stop if the piece is enemy King
          // because if the enemy King moves anywhere in this line, it's still being attacked
          if (s.piece instanceof King) {
            return false;
          }
        } else {
          // overlapping onAlly if same color
          newMove = this.makeMove(newFileEnum, newRank, true);
          moveArr.push(newMove);
        }
        return true;
      }
    }

    return true;
  }

  static getStraightLineMoves(
    piece: Rook | Queen,
    file: string,
    rank: number,
    board: Square[][]
  ): Move[] {
    const result: Move[] = [];
    const fileEnum: number = FileEnum[file];

    if (performanceTest) {
      // tslint:disable-next-line:no-console
      console.time('get straight lines');
    }

    // find the closest piece
    // border-inclusive if piece is enemy (capturable)
    // border-exclusive if piece is friendly (non-capturable)

    // go left
    for (let i = fileEnum - 1; i >= MIN; i--) {
      if (this.appendPossibleMove(piece, result, i, rank, board)) {
        break;
      }
    }
    // go right
    for (let i = fileEnum + 1; i <= MAX; i++) {
      if (this.appendPossibleMove(piece, result, i, rank, board)) {
        break;
      }
    }
    // go up
    for (let i = rank + 1; i <= MAX; i++) {
      if (this.appendPossibleMove(piece, result, fileEnum, i, board)) {
        break;
      }
    }
    // go down
    for (let i = rank - 1; i >= MIN; i--) {
      if (this.appendPossibleMove(piece, result, fileEnum, i, board)) {
        break;
      }
    }

    if (performanceTest) {
      // tslint:disable-next-line:no-console
      console.timeEnd('get straight lines');
    }

    return result;
  }

  /**
   * Breadth-first search for the correct square.
   * Stop going in a direction when hitting a border or after stepping on a piece
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

    if (performanceTest) {
      // tslint:disable-next-line:no-console
      console.time('get diagonal lines');
    }

    // find the closest piece
    // border-inclusive if piece is enemy (capturable)
    // border-exclusive if piece is friendly (non-capturable)

    let bottomLeftStop = false;
    let topLeftStop = false;
    let bottomRightStop = false;
    let topRightStop = false;
    let newFileEnum;
    let newRank;
    // go left
    for (let distance = MIN; distance <= MAX; distance++) {
      // go bottom-left
      if (!bottomLeftStop) {
        newFileEnum = fileEnum - distance;
        newRank = rank - distance;
        const shouldStop = this.appendPossibleMove(
          piece,
          result,
          newFileEnum,
          newRank,
          board
        );
        if (shouldStop) {
          bottomLeftStop = true;
        }
      }

      // go top-left
      if (!topLeftStop) {
        newFileEnum = fileEnum - distance;
        newRank = rank + distance;
        const shouldStop = this.appendPossibleMove(
          piece,
          result,
          newFileEnum,
          newRank,
          board
        );
        if (shouldStop) {
          topLeftStop = true;
        }
      }
      // go top-right
      if (!topRightStop) {
        newFileEnum = fileEnum + distance;
        newRank = rank + distance;
        const shouldStop = this.appendPossibleMove(
          piece,
          result,
          newFileEnum,
          newRank,
          board
        );
        if (shouldStop) {
          topRightStop = true;
        }
      }
      // go bottom-right
      if (!bottomRightStop) {
        newFileEnum = fileEnum + distance;
        newRank = rank - distance;
        const shouldStop = this.appendPossibleMove(
          piece,
          result,
          newFileEnum,
          newRank,
          board
        );
        if (shouldStop) {
          bottomRightStop = true;
        }
      }
    }

    if (performanceTest) {
      // tslint:disable-next-line:no-console
      console.timeEnd('get diagonal lines');
    }

    return result;
  }
}
