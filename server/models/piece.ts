import { prop, Typegoose, pre } from 'typegoose';

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

@pre<Piece>('save', function(next) {
  console.log(this.color);
  console.log(next);
  next();
})
export class Piece extends Typegoose {
  @prop({ required: true, enum: Object.values(Colors) })
  color: Color;

  @prop({ required: true, enum: Object.values(PieceTypes) })
  type: PieceType;

  @prop({ default: false })
  captured?: boolean;

  @prop()
  get name(): string {
    return `${this.color} ${this.type}`;
  }
}

export const PieceModel = new Piece().getModelForClass(Piece, {
  schemaOptions: { _id: false }
});
