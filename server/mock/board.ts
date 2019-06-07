import { Square } from '../models/board';
import { PieceType, Color } from '../models/piece';

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
      // @ts-ignore quick fix
      const newSquare: Square = {
        file: (x + 1) as File,
        rank: y + 1
      };

      const newPiece: any = {};

      // set color
      switch (y + 1) {
        case 1:
          switch (x + 1) {
            case 1:
            case 8:
              newPiece.type = PieceType.Rook;
              break;
            case 2:
            case 7:
              newPiece.type = PieceType.Knight;
              break;
            case 3:
            case 6:
              newPiece.type = PieceType.Bishop;
              break;
            case 4:
              newPiece.type = PieceType.Queen;
              break;
            case 5:
              newPiece.type = PieceType.King;
          }
          newPiece.color = Color.White;
          newSquare.piece = newPiece;
          break;
        case 2:
          newPiece.type = PieceType.Pawn;
          newPiece.color = Color.White;
          newSquare.piece = newPiece;
          break;
        case 7:
          newPiece.type = PieceType.Pawn;
          newPiece.color = Color.Black;
          newSquare.piece = newPiece;
          break;
        case 8:
          switch (x + 1) {
            case 1:
            case 8:
              newPiece.type = PieceType.Rook;
              break;
            case 2:
            case 7:
              newPiece.type = PieceType.Knight;
              break;
            case 3:
            case 6:
              newPiece.type = PieceType.Bishop;
              break;
            case 4:
              newPiece.type = PieceType.Queen;
              break;
            case 5:
              newPiece.type = PieceType.King;
          }
          newPiece.color = Color.Black;
          newSquare.piece = newPiece;
          break;
        default:
          break;
      }

      newBoard.push(newSquare);
    }
  }
  return newBoard;
}
export default initBoard();
