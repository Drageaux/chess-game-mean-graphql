import { prop, Typegoose, InstanceType, pre } from 'typegoose';
import {
  ObjectType,
  Field,
  InterfaceType,
  ID,
  registerEnumType
} from 'type-graphql';
import { Color, PieceType } from './enums';

@ObjectType()
@pre<Piece>('save', function(next) {
  // console.log(this.color);
  console.log(next);
  next();
})
export class Piece extends Typegoose {
  @Field(type => PieceType)
  @prop({ required: true, enum: PieceType })
  type: PieceType;

  @Field(type => Color) // using type => Color paused the build schema process somehow
  @prop({ required: true, enum: Color })
  color: Color;

  @Field({ nullable: true })
  @prop({ default: false })
  captured?: boolean;

  @Field({ nullable: true })
  name(): string {
    return this._name;
  }

  @prop()
  get _name(this: InstanceType<Piece>): string {
    return `${this.color} ${this.type}`;
  }
}

export const PieceModel = new Piece().getModelForClass(Piece, {
  schemaOptions: {
    _id: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
});
