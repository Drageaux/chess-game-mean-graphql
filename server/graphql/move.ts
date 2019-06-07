import { InstanceType } from 'typegoose';
import { PieceModel, Color, PieceType } from './../models/piece';
import { SessionModel, Session } from '../models/session';
import { Piece } from '../models/piece';
import { File, BoardModel, Board, Square, SquareModel } from '../models/board';
import mock from '../mock/board'; // mock board is not a Mongoose model, so no vals for virtuals
import { Move } from 'models/move';
import { PubSub, gql, withFilter } from 'apollo-server-express';
const pubsub: PubSub = new PubSub();

export const typeDefs = gql`
  type MoveSet {
    eagerMoves: [Square]
    regularMoves: [Square]
  }

  type Move {
    from: Square
    to: Square
  }

  extend type Query {
    testGetMoves(id: Int): MoveSet
  }
`;

export const resolvers = {
  Query: {
    testGetMoves: async (root: any, args: any, context: any) => {
      // return getMoves(
      //   new SquareModel({
      //     file: 'c',
      //     rank: 5,
      //     piece: new PieceModel({ color: 'white', type: 'rook' }) as Piece
      //   }) as Square,
      //   mock
      // );
      // return new SquareModel({
      //   file: 'c',
      //   rank: 5,
      //   piece: new PieceModel({ color: 'white', type: 'rook' }) as Piece
      // });
      return getMoves(
        new SquareModel({
          file: File.c,
          rank: 5,
          piece: new PieceModel({
            color: Color.White,
            type: PieceType.Bishop
          }) as Piece
        }) as Square,
        mock
      );
    }
  }
};

interface MoveSet {
  regularMoves: Move[];
  eagerMoves: Move[];
}

const getMoves = (from: Square, board: Square[]): MoveSet => {
  switch (from.piece.type) {
    case PieceType.Rook:
      return makeStraightLineMoves(from, board);
    default:
      break;
  }
  return null;
};

const makeStraightLineMoves = (
  from: Square,
  oneDBoard: Square[],
  id?: number
): MoveSet => {
  const result: MoveSet = {
    regularMoves: [],
    eagerMoves: []
  };

  console.time(`get straight lines ${id}`);
  const board: Map<File, Square[]> = toBoardMap(oneDBoard);

  // find the closest piece
  // border-inclusive if piece is enemy (capturable)
  // border-exclusive if piece is friendly (non-capturable)

  // go left
  for (let i = from.file - 1; i >= 1; i--) {
    const newMove = travLine(from, i, from.rank, board);
    result.regularMoves.push(newMove);
    if (!shouldContinueTrav(from, newMove)) {
      break;
    }
  }
  // go right
  for (let i = from.file + 1; i <= 8; i++) {
    const newMove = travLine(from, i, from.rank, board);
    result.regularMoves.push(newMove);
    if (!shouldContinueTrav(from, newMove)) {
      break;
    }
  }
  // go up
  for (let i = from.rank + 1; i <= 8; i++) {
    const newMove = travLine(from, from.file, i, board);
    result.regularMoves.push(newMove);
    if (!shouldContinueTrav(from, newMove)) {
      break;
    }
  }
  // go down
  for (let i = from.rank - 1; i >= 1; i--) {
    const newMove = travLine(from, from.file, i, board);
    result.regularMoves.push(newMove);
    if (!shouldContinueTrav(from, newMove)) {
      break;
    }
  }

  console.timeEnd(`get straight lines ${id}`);

  return result;
};

const makeDiagonalLineMoves = (
  from: Square,
  oneDBoard: Square[],
  id?: number
): MoveSet => {
  const result: MoveSet = {
    regularMoves: [],
    eagerMoves: []
  };

  console.time(`get diagonal lines ${id}`);
  const board: Map<File, Square[]> = toBoardMap(oneDBoard);
  // find the closest piece
  // border-inclusive if piece is enemy (capturable)
  // border-exclusive if piece is friendly (non-capturable)
  let trCont = true;
  let blCont = true;
  let tlCont = true;
  let brCont = true;
  let distance = 1;

  while (distance <= 8 && (blCont || brCont || trCont || tlCont)) {
    const leftFile = from.file - distance;
    const bottomRank = from.rank - distance;
    const rightFile = from.file + distance;
    const topRank = from.rank + distance;

    // go bottom-left
    if (blCont && leftFile >= 1 && bottomRank >= 1) {
      const blNewMove = travLine(from, leftFile, bottomRank, board);
      result.regularMoves.push(blNewMove);
      blCont = shouldContinueTrav(from, blNewMove);
    }

    // go top-left
    if (tlCont && leftFile >= 1 && topRank <= 8) {
      const tlNewMove = travLine(from, leftFile, topRank, board);
      result.regularMoves.push(tlNewMove);
      tlCont = shouldContinueTrav(from, tlNewMove);
    }

    // go top-right
    if (trCont && rightFile <= 8 && topRank <= 8) {
      const trNewMove = travLine(from, leftFile, topRank, board);
      result.regularMoves.push(trNewMove);
      trCont = shouldContinueTrav(from, trNewMove);
    }

    // go bottom-right
    if (brCont && rightFile <= 8 && bottomRank >= 1) {
      const brNewMove = travLine(from, rightFile, bottomRank, board);
      result.regularMoves.push(brNewMove);
      brCont = shouldContinueTrav(from, brNewMove);
    }

    distance++;
  }
  console.timeEnd(`get diagonal lines ${id}`);

  return result;
};

/*************************************************************************/
/********************************* HELPER ********************************/
/*************************************************************************/
const travLine = (
  from: Square,
  newFile: File,
  newRank: number,
  board: Map<File, Square[]>
): Move => {
  let newMove: Move = null;
  let to: Square = board.get(newFile)[newRank - 1];
  if (to) {
    newMove = {
      ...to,
      onAlly: to.piece && to.piece.color === from.piece.color ? true : false
    };
  }
  return newMove;
};

const shouldContinueTrav = (from: Square, newMove: Move): boolean => {
  if (!newMove) {
    return false;
  }
  // continue if route is clear
  if (!newMove.piece) {
    return true;
  }

  if (newMove.piece.color !== from.piece.color) {
    // NOT overlapping onAlly if different color
    // don't have to stop if the piece is enemy King
    // because if the enemy King moves anywhere in this line, it's still being attacked
    if (newMove.piece.type === 'king') {
      return true;
    }
  } else {
    // overlapping onAlly if same color
    false;
  }
  return false;
};

const sortBoardByFileThenRank = (board: Square[]): Square[] => {
  return board.sort((a, b) => {
    if (a.file === b.file) {
      if (a.rank > b.rank) {
        return 1;
      } else if (a.rank < b.rank) {
        return -1;
      } else return 0;
    } else return a.file > b.file ? 1 : a.file < b.file ? -1 : 0;
  });
};

// input array has to be sorted by higher rank first and then file
const toBoardMap = (board: Square[]): Map<File, Square[]> => {
  const newArr: Map<File, Square[]> = new Map();
  const sortedBoard = sortBoardByFileThenRank(board);

  for (let i = 0; i < board.length; i = i + 8) {
    // rank of the first 8 is the same, but the files are different, hence col
    newArr.set((sortedBoard[i] as Square).file, sortedBoard.slice(i, i + 8));
  }
  return newArr;
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

const test = () => {
  console.time('test straight line');

  for (let i = 0; i < 1; i++) {
    makeStraightLineMoves(
      new SquareModel({
        file: File.c,
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
