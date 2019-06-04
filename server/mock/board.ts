import { Square } from 'models/board';

// lookup-enum type, easier for JS forward and reverse accessing
enum File {
  'a' = 1,
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h'
}
const BOARD_SIZE = 8;

function initBoard(): Square[] {
  let newBoard: Square[] = [];
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const newSquare: any = {
        file: File[x + 1],
        rank: y + 1
      };

      const newPiece: any = {};

      // set color
      switch (y + 1) {
        case 1:
          switch (x + 1) {
            case 1:
            case 8:
              newPiece.type = 'rook';
              break;
            case 2:
            case 7:
              newPiece.type = 'knight';
              break;
            case 3:
            case 6:
              newPiece.type = 'bishop';
              break;
            case 4:
              newPiece.type = 'queen';
              break;
            case 5:
              newPiece.type = 'king';
          }
          newPiece.color = 'white';
          newSquare.piece = newPiece;
          break;
        case 2:
          newPiece.type = 'pawn';
          newPiece.color = 'white';
          newSquare.piece = newPiece;
          break;
        case 7:
          newPiece.type = 'pawn';
          newPiece.color = 'black';
          newSquare.piece = newPiece;
          break;
        case 8:
          switch (x + 1) {
            case 1:
            case 8:
              newPiece.type = 'rook';
              break;
            case 2:
            case 7:
              newPiece.type = 'knight';
              break;
            case 3:
            case 6:
              newPiece.type = 'bishop';
              break;
            case 4:
              newPiece.type = 'queen';
              break;
            case 5:
              newPiece.type = 'king';
          }
          newPiece.color = 'black';
          newSquare.piece = newPiece;
          break;
        default:
          break;
      }

      newBoard.push(newSquare);
    }
  }

  // sort descending in rank and ascending in file
  // returned order shouldn't be further modified
  newBoard = newBoard.sort((a, b) => {
    if (a.rank - b.rank === 0) {
      if (a.file > b.file) {
        return 1;
      } else if (a.file < b.file) {
        return -1;
      } else return 0;
    } else return b.rank - a.rank;
  });

  return newBoard;
}

export default initBoard();
