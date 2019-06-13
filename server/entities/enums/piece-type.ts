import { registerEnumType } from 'type-graphql';

export enum PieceType {
  Pawn = 'pawn',
  Knight = 'knight',
  Bishop = 'bishop',
  Rook = 'rook',
  Queen = 'queen',
  King = 'king'
}
registerEnumType(PieceType, {
  name: 'PieceType', // mandatory
  description: 'The basic Piece Type'
});
