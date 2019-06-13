import { prop, Typegoose } from 'typegoose';
import { ObjectType, Field, InterfaceType, ID } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { Color } from './enums/color';

@ObjectType()
export class User extends Typegoose {
  @Field(type => ID) // type => ID disables output error for GraphQL
  readonly _id: ObjectId;

  @Field({ nullable: true })
  @prop()
  userName?: string;

  @Field({ nullable: true })
  @prop({ validate: /\S+@\S+\.\S+/ })
  email?: string;
}

// TODO: implement this (warning: using Piece's Color will prevent loading)
@ObjectType()
export class Player extends User {
  @Field(type => Color)
  color: Color;

  // TODO: personal profile here
}

export const UserModel = new User().getModelForClass(User);
