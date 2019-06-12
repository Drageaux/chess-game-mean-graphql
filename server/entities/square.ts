import { prop, Typegoose, InstanceType } from 'typegoose';
import { ObjectType, Field, InterfaceType, ID, Int } from 'type-graphql';
import { Piece } from './piece';

// lookup-enum type, easier for JS forward and reverse accessing
export enum File {
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h'
}

@ObjectType()
export class Square extends Typegoose {
  @Field()
  // TODO: alias x and y when it's supported
  @prop({ enum: File, required: true })
  file: File;

  @Field(type => Int)
  @prop({ required: true })
  rank: number;

  @Field(type => Piece, { nullable: true })
  @prop()
  piece?: Piece;

  @Field()
  @prop()
  get name(this: InstanceType<Square>): string {
    return `${this.file}${this.rank}`;
  }
}

export const SquareModel = new Square().getModelForClass(Square, {
  schemaOptions: { _id: false }
});
