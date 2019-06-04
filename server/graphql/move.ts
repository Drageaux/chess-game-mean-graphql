import { PieceModel } from './../models/piece';
import { InstanceType } from 'typegoose';
import { SessionModel, Session } from '../models/session';
import { Piece } from '../models/piece';
import { File, BoardModel, Board, Square, SquareModel } from '../models/board';
import { PubSub, gql, withFilter } from 'apollo-server-express';
const pubsub: PubSub = new PubSub();

export const typeDefs = gql`
  type Move {
    from: Square
    to: Square
  }
`;

export const resolvers = {};

import mock from '../mock/board'; // mock board is not a Mongoose model, so no vals for virtuals
import { fileURLToPath } from 'url';

// should keep a normal move list and a potential move list
function moveMaker(piece: Piece, from: Square, board: Square[]) {
  let moves: any[] = [];
  console.time('move');
  if (piece.type === 'rook') {
    let minFile: number = 1;
    let maxFile = 8;
    let minRank = 1;
    let maxRank = 8;
    // get all x and y moves
    moves = board.filter((s: Square) => {
      return (
        (s.file === from.file || s.rank === from.rank) &&
        `${s.file}${s.rank}` !== from.name
      );
    });
    // filter out above moves
    // if from file larger than left-most file, find left squares to determine closest boundary
    minFile =
      File[from.file] > minFile
        ? moves.find((s: Square) => {
            return s.piece !== null;
          })
        : minFile;
  }
  return moves;
}

moveMaker(
  new PieceModel({ color: 'white', type: 'rook' }) as Piece,
  new SquareModel({ file: 'a', rank: 5 }) as Square,
  mock
);
