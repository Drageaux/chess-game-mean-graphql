import { prop, Typegoose } from 'typegoose';

export class User extends Typegoose {
  @prop()
  userName: string;

  @prop()
  email: string;
}

export default new User().getModelForClass(User);
