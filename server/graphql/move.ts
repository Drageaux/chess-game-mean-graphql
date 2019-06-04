import { PieceModel } from './../models/piece';
import { InstanceType } from 'typegoose';
import { SessionModel, Session } from '../models/session';
import { Piece } from '../models/piece';
import { FILE, BoardModel, Board, Square, SquareModel } from '../models/board';
import { PubSub, gql, withFilter } from 'apollo-server-express';
const pubsub: PubSub = new PubSub();

export const typeDefs = gql`
  type Moves {
    eagerMoves: [Square]
    regularMoves: [Square]
  }

  type Move {
    from: Square
    to: Square
  }

  extend type Query {
    testGetMoves(id: Int): Moves
  }
`;

export const resolvers = {
  Query: {
    testGetMoves: async (root: any, args: any, context: any) => {
      // return moveMaker(
      //   new SquareModel({
      //     file: 'c',
      //     rank: 5,
      //     piece: new PieceModel({ color: 'white', type: 'rook' }) as Piece
      //   }) as Square,
      //   mock,
      //   args.id
      // );
      return makeStraightLineMoves(
        new SquareModel({
          file: 'c',
          rank: 5,
          piece: new PieceModel({ color: 'white', type: 'rook' }) as Piece
        }) as Square,
        mock,
        args.id
      );
    }
  }
};

import mock from '../mock/board'; // mock board is not a Mongoose model, so no vals for virtuals

interface Moves {
  regularMoves: Square[];
  eagerMoves: Square[];
}
// should keep a normal move list and a potential move list
function moveMaker(from: Square, board: Square[], id: number): Moves {
  if (!from || !from.piece) {
    return null;
  }
  let moves: Moves = { regularMoves: [], eagerMoves: [] };
  // logBoard(board);
  console.time(`move ${id}`);

  if (from.piece.type === 'rook') {
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
    // add 1 eager move if ally
    // TODO: add 2 eager moves if opponent and separate move list
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
        if (el.piece) {
          if (el.piece.color === from.piece.color) {
            moves.eagerMoves.push(el);
          } else if (el.piece.color !== from.piece.color) {
            moves.eagerMoves.push(el);
          }
        }
      }
    });

    console.timeEnd(`move ${id}`);
  }
  return moves;
}

const toTwoDBoard = (board: any): any => {
  const newArr = [];
  for (let i = 0; i < board.length; i = i + 8) {
    newArr.push(board.slice(i, i + 8));
  }
  return newArr;
};

function makeStraightLineMoves(from: Square, brd: Square[], id: number) {
  const result: any[] = [];
  const fileEnum: number = FILE[from.file];

  console.time(`get straight lines ${id}`);
  const board = toTwoDBoard(brd);
  // find the closest piece
  // border-inclusive if piece is enemy (capturable)
  // border-exclusive if piece is friendly (non-capturable)

  // go left
  for (let i = fileEnum - 1; i >= 1; i--) {
    result.push({ file: from.file, rank: from.rank });
  }
  // go right
  for (let i = fileEnum + 1; i <= 8; i++) {
    result.push({ file: from.file, rank: from.rank });
  }
  // go up
  for (let i = from.rank + 1; i <= 8; i++) {
    result.push({ file: from.file, rank: from.rank });
  }
  // go down
  for (let i = from.rank - 1; i >= 1; i--) {
    result.push({ file: from.file, rank: from.rank });
  }

  console.timeEnd(`get straight lines ${id}`);

  return result;
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
  for (let row of toTwoDBoard(board)) {
    console.log(row);
  }
};

const test = () => {
  console.time('test all');

  for (let i = 0; i < 1; i++) {
    moveMaker(
      new SquareModel({
        file: 'c',
        rank: 5,
        piece: new PieceModel({ color: 'white', type: 'rook' }) as Piece
      }) as Square,
      mock,
      i
    );
  }

  console.timeEnd('test all');

  console.time('test straight line');

  for (let i = 0; i < 1; i++) {
    makeStraightLineMoves(
      new SquareModel({
        file: 'c',
        rank: 5,
        piece: new PieceModel({ color: 'white', type: 'rook' }) as Piece
      }) as Square,
      mock,
      i
    );
  }

  console.timeEnd('test straight line');
};

test();
