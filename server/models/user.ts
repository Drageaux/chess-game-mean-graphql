import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: String,
  email: String
});
export default mongoose.model('User', userSchema);
