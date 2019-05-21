import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

import Piece from './piece';
const pieceSchema = Piece.schema;

// easier for Mongoose to understand
const File = Object.freeze({
  1: 'a',
  2: 'b',
  3: 'c',
  4: 'd',
  5: 'e',
  6: 'f',
  7: 'g',
  8: 'h'
});

const BOARD_SIZE = 8;
// lookup-enum type, easier for JS forward and reverse accessing
export enum FILE {
  'a' = 1,
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h'
}

const squareSchema = new Schema({
  // prevent udpates for x and y
  file: { alias: 'x', type: String, enum: Object.values(File), required: true },
  rank: { alias: 'y', type: Number, required: true },
  piece: pieceSchema
});

// "flattened" 2D array of squares
const gameboardSchema = new Schema({
  squares: { type: [squareSchema] },
  capturedPieces: [pieceSchema]
});
gameboardSchema.virtual('whiteKingLocation').get(function(v: any) {
  this.squares.populate().find(function(square: any) {
    return (
      square.piece &&
      square.piece.type === 'king' &&
      square.piece.color === 'white'
    );
  });
});
gameboardSchema.virtual('blackKingLocation').get(function(v: any) {
  this.squares.populate().find(function(square: any) {
    return (
      square.piece &&
      square.piece.type === 'king' &&
      square.piece.color === 'black'
    );
  });
});

export default mongoose.model('Gameboard', gameboardSchema);
