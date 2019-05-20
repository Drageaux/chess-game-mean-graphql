import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

const pieceSchema = new Schema({
  color: { type: String, enum: ['white', 'black'], required: true },
  type: {
    type: String,
    enum: ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'],
    required: true
  }
});
export default mongoose.model('Piece', pieceSchema);
