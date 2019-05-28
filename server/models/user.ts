import { prop, Typegoose } from 'typegoose';
import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

export class User extends Typegoose {
  @prop()
  userName: string;

  @prop()
  email: string;
}

export default new User().getModelForClass(User);
