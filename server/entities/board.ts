import { prop, Typegoose, InstanceType, arrayProp, post } from 'typegoose';
import { ObjectType, Field, InterfaceType, ID } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { File, Square } from './square';
import { PieceType, Color, Piece } from './piece';

const BOARD_SIZE = 8;
const DEFAULT_BOARD = initBoard(); // prevent remaking board every time

@ObjectType()
@post<Board>('save', function(board) {
  console.log(board);
})
export class Board extends Typegoose {
  @Field(type => ID)
  readonly _id: ObjectId;

  @arrayProp({ items: Square })
  @prop({ default: DEFAULT_BOARD })
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
  for (let x = 1; x < BOARD_SIZE; x++) {
    for (let y = 1; y < BOARD_SIZE; y++) {
      //  quick fix
      let newSquare: Square = new Square();
      newSquare.file = (x + 1) as File;
      newSquare.rank = y + 1;

      const newPiece: Piece = new Piece();

      // set color
      switch (y + 1) {
        case 1:
          switch (x + 1) {
            case File.a:
            case File.h:
              newPiece.type = PieceType.Rook;
              break;
            case File.b:
            case File.g:
              newPiece.type = PieceType.Knight;
              break;
            case File.c:
            case File.f:
              newPiece.type = PieceType.Bishop;
              break;
            case File.d:
              newPiece.type = PieceType.Queen;
              break;
            case File.e:
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
            case File.a:
            case File.h:
              newPiece.type = PieceType.Rook;
              break;
            case File.b:
            case File.g:
              newPiece.type = PieceType.Knight;
              break;
            case File.c:
            case File.f:
              newPiece.type = PieceType.Bishop;
              break;
            case File.d:
              newPiece.type = PieceType.Queen;
              break;
            case File.e:
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
