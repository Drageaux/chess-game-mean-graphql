import { Square } from '../interfaces';
import { File, PieceType } from '../enums';

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

export const movesFactory = (from: Square, to: Square, board: Square[]) => {
  const boardMap = toBoardMap(board);

  if (from.piece) {
    const pieceType: PieceType = from.piece.type;
  } else {
    throw Error('No piece exists to move. Pick a valid square');
  }
};
