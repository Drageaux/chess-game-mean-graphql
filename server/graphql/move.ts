import { PieceModel } from './../models/piece';
import { InstanceType } from 'typegoose';
import { SessionModel, Session } from '../models/session';
import { Piece } from '../models/piece';
import { FILE, BoardModel, Board, Square, SquareModel } from '../models/board';
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

// should keep a normal move list and a potential move list
function moveMaker(piece: Piece, from: Square, board: Square[]) {
  let moves: Square[] = [];
  console.time('move');
  if (piece.type === 'rook') {
    let maxFile = 8;
    let minRank = 1;
    let maxRank = 8;
    const fromFile: any = FILE[from.file];

    // get all x and y moves
    moves = board.filter((s: Square) => {
      return (
        (s.file === from.file || s.rank === from.rank) &&
        `${s.file}${s.rank}` !== from.name
      );
    });
    // filter out above moves
    // if from file larger than left-most file, find left squares to determine closest boundary
    const leftBoundary = moves.find((s: Square) => {
      return (
        s.rank === from.rank &&
        FILE[s.file] >= 1 &&
        FILE[s.file] < FILE[from.file]
      );
    });

    console.log(leftBoundary);
  }
  return moves;
}

moveMaker(
  new PieceModel({ color: 'white', type: 'rook' }) as Piece,
  new SquareModel({ file: 'c', rank: 5 }) as Square,
  mock
);
