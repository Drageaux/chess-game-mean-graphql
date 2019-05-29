import { prop, Typegoose } from 'typegoose';

export class User extends Typegoose {
  @prop()
  userName: string;

  @prop()
  email: string;
}

export const UserModel = new User().getModelForClass(User);
