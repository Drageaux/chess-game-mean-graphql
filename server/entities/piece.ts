import { prop, Typegoose, InstanceType, pre } from 'typegoose';
import { ObjectType, Field, InterfaceType, ID } from 'type-graphql';

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

@ObjectType()
@pre<Piece>('save', function(next) {
  console.log(this.color);
  console.log(next);
  next();
})
export class Piece extends Typegoose {
  @Field()
  @prop({ required: true, enum: Color })
  color: Color;

  @Field()
  @prop({ required: true, enum: PieceType })
  type: PieceType;

  @Field()
  @prop({ default: false })
  captured: boolean;

  @Field()
  @prop()
  get name(): string {
    return `${this.color} ${this.type}`;
  }
}

export const PieceModel = new Piece().getModelForClass(Piece, {
  schemaOptions: { _id: false }
});
