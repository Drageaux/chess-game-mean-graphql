import { prop, Typegoose, InstanceType, pre, arrayProp } from 'typegoose';
import { Piece } from './piece';

// easier for Mongoose/Typegoose to understand
type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
const Files = Object.freeze({
  1: 'a',
  2: 'b',
  3: 'c',
  4: 'd',
  5: 'e',
  6: 'f',
  7: 'g',
  8: 'h'
});
// lookup-enum type, easier for JS forward and reverse accessing
export enum FILE {
  'a' = 1,
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h'
}
const BOARD_SIZE = 8;
const DEFAULT_BOARD = initBoard(); // prevent remaking board every time

class Square extends Typegoose {
  // TODO: alias x and y when it's supported
  @prop({ enum: Object.values(Files), required: true })
  file: File;

  @prop({ required: true })
  rank: number;

  @prop()
  piece?: Piece;

  @prop()
  get name(this: InstanceType<Square>): string {
    return `${this.file}${this.rank}`;
  }
}

const SquareModel = new Square().getModelForClass(Square, {
  schemaOptions: {
    toObject: { getters: true },
    toJSON: { getters: true }
  }
});

export class Board extends Typegoose {
  @arrayProp({ items: Square, default: DEFAULT_BOARD })
  squares: Square[];

  @arrayProp({ items: Piece })
  capturedPieces?: Piece[];

  @prop()
  get whiteKingLocation() {
    return this.squares.find((square: Square) => {
      return (
        square.piece &&
        square.piece.type === 'king' &&
        square.piece.color === 'white'
      );
    });
  }

  @prop()
  get blackKingLocation() {
    return this.squares.find((square: Square) => {
      return (
        square.piece &&
        square.piece.type === 'king' &&
        square.piece.color === 'black'
      );
    });
  }
}

export const BoardModel = new Board().getModelForClass(Board, {
  schemaOptions: {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
});

function initBoard(): Square[] {
  let newBoard: Square[] = [];
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const newSquare: any = {
        file: FILE[x + 1],
        rank: y + 1
      };

      const newPiece: any = {};

      // set color
      switch (y + 1) {
        case 1:
          switch (x + 1) {
            case 1:
            case 8:
              newPiece.type = 'rook';
              break;
            case 2:
            case 7:
              newPiece.type = 'knight';
              break;
            case 3:
            case 6:
              newPiece.type = 'bishop';
              break;
            case 4:
              newPiece.type = 'queen';
              break;
            case 5:
              newPiece.type = 'king';
          }
          newPiece.color = 'white';
          newSquare.piece = newPiece;
          break;
        case 2:
          newPiece.type = 'pawn';
          newPiece.color = 'white';
          newSquare.piece = newPiece;
          break;
        case 7:
          newPiece.type = 'pawn';
          newPiece.color = 'black';
          newSquare.piece = newPiece;
          break;
        case 8:
          switch (x + 1) {
            case 1:
            case 8:
              newPiece.type = 'rook';
              break;
            case 2:
            case 7:
              newPiece.type = 'knight';
              break;
            case 3:
            case 6:
              newPiece.type = 'bishop';
              break;
            case 4:
              newPiece.type = 'queen';
              break;
            case 5:
              newPiece.type = 'king';
          }
          newPiece.color = 'black';
          newSquare.piece = newPiece;
          break;
        default:
          break;
      }

      newBoard.push(newSquare);
    }
  }

  // sort descending in rank and ascending in file
  // returned order shouldn't be further modified
  newBoard = newBoard.sort((a, b) => {
    if (a.rank - b.rank === 0) {
      if (a.file > b.file) {
        return 1;
      } else if (a.file < b.file) {
        return -1;
      } else return 0;
    } else return b.rank - a.rank;
  });

  return newBoard;
}
