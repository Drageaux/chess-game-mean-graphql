import { prop, Typegoose, InstanceType, plugin } from 'typegoose';
import { ObjectType, Field, InterfaceType, ID, Int } from 'type-graphql';
import { Piece } from './piece';
import { File } from './enums';

@ObjectType()
export class Square extends Typegoose {
  @Field(type => File)
  @prop({ enum: File, required: true })
  file: File;

  @Field(type => File)
  x(): File {
    return this.file;
  }

  @Field(type => Int)
  @prop({ required: true })
  rank: number;

  @Field(type => Int)
  y(): number {
    return this.rank;
  }

  @Field(type => Piece, { nullable: true })
  @prop()
  piece?: Piece;

  @Field()
  @prop()
  get name(): string {
    // it's stored as a number so should return the letter
    return `${File[this.file]}${this.rank}`;
  }
}

export const SquareModel = new Square().getModelForClass(Square, {
  schemaOptions: {
    _id: false
  }
});
