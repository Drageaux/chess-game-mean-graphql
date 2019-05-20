import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

import Piece from './piece';
const pieceSchema = Piece.schema;

const File = Object.freeze({
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8
});

const squareSchema = new Schema({
  // prevent udpates for x and y
  file: { alias: 'x', type: String, enum: Object.values(File), required: true },
  rank: { alias: 'y', type: Number, required: true },
  piece: pieceSchema
});
const boardSchema = new Schema({
  board: [[]]
});
export default mongoose.model('Board', boardSchema);
