import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

/**
 * To find current location
 *
 * Parent.findOne({ 'children': { $elemMatch: { 'field': 'Family Name',
 * 'value': 'Smith' } } }, fn ...)
 */
const pieceSchema = new Schema({
  color: { type: String, enum: ['white', 'black'], required: true },
  type: {
    type: String,
    enum: ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'],
    required: true
  },
  captured: Boolean
});
export default mongoose.model('Piece', pieceSchema);
