import { Square, Move } from '../interfaces';
import { File, PieceType } from '../enums';

export const movesFactory = (from: Square, board: Square[]) => {
  const resultMap: Map<string, Move> = new Map();
  const boardMap = toBoardMap(board);

  if (from.piece) {
    const pieceType = from.piece.type;
    switch (pieceType) {
      case PieceType.Rook:
        return makeStraightLineMoves(from, boardMap);
      default:
        break;
    }

    return resultMap;
  } else {
    throw Error('No piece exists to move. Pick a valid square');
  }
};

/*************************************************************************/
/*********************** ITERABLE MOVES GENERATORS ***********************/
/*************************************************************************/
const makeStraightLineMoves = (
  from: Square,
  board: Map<File, Square[]>
): Map<string, Move> => {
  const result: Map<string, Move> = new Map();
  // find the closest piece
  // border-inclusive if piece is enemy (capturable)
  // border-exclusive if piece is friendly (non-capturable)

  // go left
  for (let i = from.file - 1; i >= 1; i--) {
    const newMove = travLine(from, i, from.rank, board);
    if (!newMove) {
      break;
    }
    const { to } = newMove;
    result.set(`${from.file}${from.rank}${to.file}${to.rank}`, newMove);
    if (!shouldContinueTrav(newMove)) {
      break;
    }
  }
  // go right
  for (let i = from.file + 1; i <= 8; i++) {
    const newMove = travLine(from, i, from.rank, board);
    if (!newMove) {
      break;
    }
    const { to } = newMove;
    result.set(`${from.file}${from.rank}${to.file}${to.rank}`, newMove);
    if (!shouldContinueTrav(newMove)) {
      break;
    }
  }
  // go up
  for (let i = from.rank + 1; i <= 8; i++) {
    const newMove = travLine(from, from.file, i, board);
    if (!newMove) {
      break;
    }
    const { to } = newMove;
    result.set(`${from.file}${from.rank}${to.file}${to.rank}`, newMove);
    if (!shouldContinueTrav(newMove)) {
      break;
    }
  }
  // go down
  for (let i = from.rank - 1; i >= 1; i--) {
    const newMove = travLine(from, from.file, i, board);
    if (!newMove) {
      break;
    }
    const { to } = newMove;
    result.set(`${from.file}${from.rank}${to.file}${to.rank}`, newMove);
    if (!shouldContinueTrav(newMove)) {
      break;
    }
  }

  // console.timeEnd(`get straight lines ${id}`);

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
): Move | null => {
  let newMove = null;

  if (!from.piece) {
    throw Error('Origin Square does not have a Piece');
  }

  const squareArray = board.get(newFile);
  if (squareArray) {
    const to: Square = squareArray[newRank - 1];
    if (to && from.piece) {
      newMove = {
        from,
        to,
        onAlly: to.piece && to.piece.color === from.piece.color ? true : false
      } as Move;
    }
  } else {
    throw Error('Something went wrong while checking a Square');
  }
  return newMove;
};

const shouldContinueTrav = (move: Move): boolean => {
  if (!move) {
    return false;
  }
  // continue if route is clear
  if (move.to && !move.to.piece) {
    return true;
  }

  if (
    move.to.piece &&
    move.from.piece &&
    move.to.piece.color !== move.from.piece.color
  ) {
    // NOT overlapping onAlly if different color
    // don't have to stop if the piece is enemy King
    // because if the enemy King moves anywhere in this line, it's still being attacked
    if (move.to.piece.type === 'king') {
      return true;
    }
  } else {
    // overlapping onAlly if same color
    return false;
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
      } else {
        return 0;
      }
    } else {
      return a.file > b.file ? 1 : a.file < b.file ? -1 : 0;
    }
  });
};

// input array has to be sorted by higher rank first and then file
const toBoardMap = (board: Square[]): Map<File, Square[]> => {
  const map: Map<File, Square[]> = new Map();
  const sortedBoard = sortBoardByFileThenRank(board);

  for (let i = 0; i < board.length; i = i + 8) {
    // rank of the first 8 is the same, but the files are different, hence col
    map.set((sortedBoard[i] as Square).file, sortedBoard.slice(i, i + 8));
  }
  return map;
};
