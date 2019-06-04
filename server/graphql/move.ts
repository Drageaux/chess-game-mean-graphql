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
  logBoard(board);
  console.time('move');
  if (piece.type === 'rook') {
    // xMoves arr and yMoves arr
    const moveMap: Map<String, Square[]> = new Map();
    let maxFile = 8;
    let minRank = 1;
    let maxRank = 8;
    const fromFile: any = FILE[from.file];

    // find all obstacles first, then look for closest obstacles
    // then select moves between origin and obstacles
    const allMoves = board.filter(straightMoves(from));
    const allObstacles = allMoves.filter(hasPiece);
    const yBoundUpper: Square = allObstacles
      .filter(filterMovesBy('rank', 'larger', from))
      .reduce(closestY(from), null);
    const yBoundLower: Square = allObstacles
      .filter(filterMovesBy('rank', 'smaller', from))
      .reduce(closestY(from), null);
    const xBoundRight: Square = allObstacles
      .filter(filterMovesBy('file', 'larger', from))
      .reduce(closestX(from), null);
    const xBoundLeft: Square = allObstacles
      .filter(filterMovesBy('file', 'smaller', from))
      .reduce(closestX(from), null);

    // find all pieces in path, return the closest one
    // add 1 eager move if ally, add 2 eager moves if opponent
    allMoves.forEach((el: Square) => {
      const yStart = yBoundLower ? yBoundLower.rank : 1;
      const yEnd = yBoundUpper ? yBoundUpper.rank : 8;
      const xStart: number = xBoundLeft ? FILE[xBoundLeft.file] : 1;
      const xEnd = xBoundRight ? FILE[xBoundRight.file] : 8;

      if (
        FILE[el.file] >= xStart &&
        FILE[el.file] <= xEnd &&
        el.rank >= yStart &&
        el.rank <= yEnd
      ) {
        moves.push(el);
      }
    });

    console.timeEnd('move');
  }
  return moves;
}

// filter function for all squares in a straight line
const straightMoves = (from: Square) => (el: Square, index: number) => {
  return (
    (el.file === from.file || el.rank === from.rank) &&
    `${el.file}${el.rank}` !== from.name
  );
};

// filter to see if square has a piece
const hasPiece = (el: Square) => {
  return el.piece != null;
};

const filterMovesBy = (
  prop: 'file' | 'rank',
  dir: 'larger' | 'smaller',
  from: Square
) => (el: Square): boolean => {
  if (prop === 'file') {
    return dir === 'larger'
      ? FILE[el.file] > FILE[from.file]
      : FILE[el.file] < FILE[from.file];
  } else {
    return dir === 'larger' ? el.rank > from.rank : el.rank < from.rank;
  }
};

// reducer to find closest square to the right
const closestX = (from: Square) => (prev: Square, curr: Square): Square => {
  return prev == null ||
    Math.abs(FILE[curr.file] - FILE[from.file]) <
      Math.abs(FILE[prev.file] - FILE[from.file])
    ? curr
    : prev;
};

// reducer to find closest square above
const closestY = (from: Square) => (prev: Square, curr: Square): Square => {
  return prev == null ||
    Math.abs(curr.rank - from.rank) < Math.abs(prev.rank - from.rank)
    ? curr
    : prev;
};

const logBoard = (board: Square[]) => {
  const newArr = [];
  for (let i = 0; i < board.length; i = i + 8) {
    newArr.push(board.slice(i, i + 8));
  }

  for (let row of newArr) {
    console.log(row);
  }
};

moveMaker(
  new PieceModel({ color: 'white', type: 'rook' }) as Piece,
  new SquareModel({ file: 'c', rank: 5 }) as Square,
  mock
);
