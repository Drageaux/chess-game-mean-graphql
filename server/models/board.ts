import { prop, Typegoose, InstanceType, pre, arrayProp, post } from 'typegoose';
import { Piece, PieceType, Color } from './piece';

// lookup-enum type, easier for JS forward and reverse accessing
export enum File {
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

export class Square extends Typegoose {
  // TODO: alias x and y when it's supported
  @prop({ lowercase: true, enum: File, required: true })
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

export const SquareModel = new Square().getModelForClass(Square, {
  schemaOptions: {
    toObject: { getters: true },
    toJSON: { getters: true }
  }
});

@post<Board>('save', function(board) {
  console.log(board);
})
export class Board extends Typegoose {
  @arrayProp({ items: Square, default: DEFAULT_BOARD, required: true })
  squares: Square[];

  @arrayProp({ items: Piece })
  capturedPieces?: Piece[];

  @prop()
  get whiteKingLocation() {
    return this.squares.find((square: Square) => {
      return (
        square.piece &&
        square.piece.type === PieceType.King &&
        square.piece.color === Color.White
      );
    });
  }

  @prop()
  get blackKingLocation() {
    return this.squares.find((square: Square) => {
      return (
        square.piece &&
        square.piece.type === PieceType.King &&
        square.piece.color === Color.Black
      );
    });
  }
}

export const BoardModel = new Board().getModelForClass(Board);

function initBoard(): Square[] {
  let newBoard: Square[] = [];
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      // @ts-ignore quick fix
      const newSquare: Square = {
        file: (x + 1) as File,
        rank: y + 1
      };

      const newPiece: any = {};

      // set color
      switch (y + 1) {
        case 1:
          switch (x + 1) {
            case 1:
            case 8:
              newPiece.type = PieceType.Rook;
              break;
            case 2:
            case 7:
              newPiece.type = PieceType.Knight;
              break;
            case 3:
            case 6:
              newPiece.type = PieceType.Bishop;
              break;
            case 4:
              newPiece.type = PieceType.Queen;
              break;
            case 5:
              newPiece.type = PieceType.King;
          }
          newPiece.color = Color.White;
          newSquare.piece = newPiece;
          break;
        case 2:
          newPiece.type = PieceType.Pawn;
          newPiece.color = Color.White;
          newSquare.piece = newPiece;
          break;
        case 7:
          newPiece.type = PieceType.Pawn;
          newPiece.color = Color.Black;
          newSquare.piece = newPiece;
          break;
        case 8:
          switch (x + 1) {
            case 1:
            case 8:
              newPiece.type = PieceType.Rook;
              break;
            case 2:
            case 7:
              newPiece.type = PieceType.Knight;
              break;
            case 3:
            case 6:
              newPiece.type = PieceType.Bishop;
              break;
            case 4:
              newPiece.type = PieceType.Queen;
              break;
            case 5:
              newPiece.type = PieceType.King;
          }
          newPiece.color = Color.Black;
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
