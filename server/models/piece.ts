import { prop, Typegoose } from 'typegoose';
import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

/**
 * To find current location
 *
 * Parent.findOne({ 'children': { $elemMatch: { 'field': 'Family Name',
 * 'value': 'Smith' } } }, fn ...)
 */
const pieceSchema = new Schema(
  {
    color: { type: String, enum: ['white', 'black'], required: true },
    type: {
      type: String,
      enum: ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'],
      required: true
    },
    captured: { type: Boolean, default: false }
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);
pieceSchema.virtual('name', function() {
  return `${this.color} ${this.type}`;
});

type Color = 'white' | 'black';
const Colors = {
  WHITE: 'white' as Color,
  BLACK: 'black' as Color
};

type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
const PieceTypes = {
  PAWN: 'pawn' as PieceType,
  KNIGHT: 'knight' as PieceType,
  BISHOP: 'bishop' as PieceType,
  ROOK: 'rook' as PieceType,
  QUEEN: 'queen' as PieceType,
  KING: 'king' as PieceType
};

export class Piece extends Typegoose {
  @prop({ required: true, enum: Object.values(Colors) })
  color: Color;

  @prop({ required: true, enum: Object.values(PieceTypes) })
  type: PieceType;

  @prop({ default: false })
  captured?: boolean;

  @prop()
  get name() {
    return `${this.color} ${this.type}`;
  }
}

export const model = new Piece().getModelForClass(Piece);

export default mongoose.model('Piece', pieceSchema);
