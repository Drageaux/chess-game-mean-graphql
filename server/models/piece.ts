import { prop, Typegoose } from 'typegoose';

type Color = 'white' | 'black';
const Colors = {
  WHITE: 'white' as Color,
  BLACK: 'black' as Color
};

type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
const PieceTypes = {
  PAWN: 'pawn' as PieceType,
  KNIGHT: 'knight' as PieceType,
  BISHOP: 'bishop' as PieceType,
  ROOK: 'rook' as PieceType,
  QUEEN: 'queen' as PieceType,
  KING: 'king' as PieceType
};

export class Piece extends Typegoose {
  @prop({ required: true, enum: Object.values(Colors) })
  color: Color;

  @prop({ required: true, enum: Object.values(PieceTypes) })
  type: PieceType;

  @prop({ default: false })
  captured?: boolean;

  @prop()
  get name() {
    return `${this.color} ${this.type}`;
  }
}

export default new Piece().getModelForClass(Piece);
