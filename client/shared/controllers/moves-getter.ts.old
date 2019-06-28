// import { default as parser } from './board-parser';
import { Move, Piece, Square } from '../interfaces';
import { File, PieceType, BoardSize } from '../enums';

// turn this to true to console log time
const performanceTest = false;

export default class MovesGetter {
  static makeMove(from: Square, to: Square, onAlly: boolean = false): Move {
    return { from, to, onAlly } as Move;
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
    newFileEnum: File,
    newRank: number,
    board: Map<File, Square[]>
  ): boolean {
    // first, get valid Square
    const s: Square = board.get(newFileEnum)[newRank - 1];
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
          if (s.piece.isKing) {
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
    from: Square,
    board: Map<File, Square[]>
  ): Move[] {
    const result: Move[] = [];
    const { file, rank, piece } = from;
    if (piece.type === PieceType.Rook || piece.type === PieceType.Queen) {
      if (performanceTest) {
        // tslint:disable-next-line:no-console
        console.time('get straight lines');
      }

      // find the closest piece
      // border-inclusive if piece is enemy (capturable)
      // border-exclusive if piece is friendly (non-capturable)

      // go left
      for (let i = file - 1; i >= BoardSize.Min; i--) {
        if (this.appendPossibleMove(result, from, i, rank, board)) {
          break;
        }
      }
      // go right
      for (let i = file + 1; i <= BoardSize.Max; i++) {
        if (this.appendPossibleMove(piece, result, i, rank, board)) {
          break;
        }
      }
      // go up
      for (let i = rank + 1; i <= BoardSize.Max; i++) {
        if (this.appendPossibleMove(piece, result, file, i, board)) {
          break;
        }
      }
      // go down
      for (let i = rank - 1; i >= BoardSize.Min; i--) {
        if (this.appendPossibleMove(piece, result, file, i, board)) {
          break;
        }
      }

      if (performanceTest) {
        // tslint:disable-next-line:no-console
        console.timeEnd('get straight lines');
      }
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
  // static getDiagonalLineMoves(
  //   piece: Bishop | Queen,
  //   file: string,
  //   rank: number,
  //   board: Square[][]
  // ): Move[] {
  //   const result: Move[] = [];
  //   const fileEnum: number = FileEnum[file];

  //   if (performanceTest) {
  //     // tslint:disable-next-line:no-console
  //     console.time('get diagonal lines');
  //   }

  //   // find the closest piece
  //   // border-inclusive if piece is enemy (capturable)
  //   // border-exclusive if piece is friendly (non-capturable)

  //   let bottomLeftStop = false;
  //   let topLeftStop = false;
  //   let bottomRightStop = false;
  //   let topRightStop = false;
  //   let newFileEnum;
  //   let newRank;
  //   // go left
  //   for (let distance = BoardSize; distance <= MAX; distance++) {
  //     // go bottom-left
  //     if (!bottomLeftStop) {
  //       newFileEnum = fileEnum - distance;
  //       newRank = rank - distance;
  //       const shouldStop = this.appendPossibleMove(
  //         piece,
  //         result,
  //         newFileEnum,
  //         newRank,
  //         board
  //       );
  //       if (shouldStop) {
  //         bottomLeftStop = true;
  //       }
  //     }

  //     // go top-left
  //     if (!topLeftStop) {
  //       newFileEnum = fileEnum - distance;
  //       newRank = rank + distance;
  //       const shouldStop = this.appendPossibleMove(
  //         piece,
  //         result,
  //         newFileEnum,
  //         newRank,
  //         board
  //       );
  //       if (shouldStop) {
  //         topLeftStop = true;
  //       }
  //     }
  //     // go top-right
  //     if (!topRightStop) {
  //       newFileEnum = fileEnum + distance;
  //       newRank = rank + distance;
  //       const shouldStop = this.appendPossibleMove(
  //         piece,
  //         result,
  //         newFileEnum,
  //         newRank,
  //         board
  //       );
  //       if (shouldStop) {
  //         topRightStop = true;
  //       }
  //     }
  //     // go bottom-right
  //     if (!bottomRightStop) {
  //       newFileEnum = fileEnum + distance;
  //       newRank = rank - distance;
  //       const shouldStop = this.appendPossibleMove(
  //         piece,
  //         result,
  //         newFileEnum,
  //         newRank,
  //         board
  //       );
  //       if (shouldStop) {
  //         bottomRightStop = true;
  //       }
  //     }
  //   }

  //   if (performanceTest) {
  //     // tslint:disable-next-line:no-console
  //     console.timeEnd('get diagonal lines');
  //   }

  //   return result;
  // }
}
