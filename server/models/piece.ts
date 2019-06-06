import { prop, Typegoose, pre } from 'typegoose';

export enum Color {
  White = 'white',
  Black = 'black'
}

export enum PieceType {
  Pawn = 'pawn',
  Knight = 'knight',
  Bishop = 'bishop',
  Rook = 'rook',
  Queen = 'queen',
  King = 'king'
}

@pre<Piece>('save', function(next) {
  console.log(this.color);
  console.log(next);
  next();
})
export class Piece extends Typegoose {
  @prop({ required: true, enum: Color })
  color: Color;

  @prop({ required: true, enum: PieceType })
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
