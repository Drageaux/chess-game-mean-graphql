import { prop, Typegoose } from 'typegoose';
import { Piece as PieceType } from './piece';

// easier for Mongoose to understand
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
const BOARD_SIZE = 8;
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

class Square extends Typegoose {
  // TODO: alias x and y when it's supported
  @prop({ enum: Object.values(Files), required: true })
  file: File;

  @prop({ required: true })
  rank: number;

  @prop()
  piece?: PieceType;

  @prop()
  get name() {
    return `${this.file}${this.rank}`;
  }
}

export class Board extends Typegoose {
  @prop()
  squares: Square[];

  @prop()
  capturedPieces: PieceType[];

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

export const BoardModel = new Board().getModelForClass(Board);
