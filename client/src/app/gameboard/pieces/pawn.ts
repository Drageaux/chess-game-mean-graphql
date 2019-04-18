import { Move } from './../move';
import { Piece } from './piece';
import { Square, FileEnum } from '../square';
import { default as parser } from '../gameboard-parser';

export class Pawn extends Piece {
  constructor(color: 'white' | 'black') {
    super('pawn', color);
  }

  move(board: Square[][], position: Square) {
    throw new Error('Method not implemented.');
  }

  getAllPossibleMoves(file: string, rank: number) {
    const allPossibleMoves = [];
    if (this.color === 'white') {
      const firstMove = rank === 2;
      if (rank + 1 <= 8) {
        allPossibleMoves.push(new Move(file, rank + 1));
      }
      if (firstMove && rank + 2 <= 8) {
        allPossibleMoves.push(new Move(file, rank + 2));
      }
      // capture an enemy by moving 1 square diagonally
      if (FileEnum[file] + 1 <= 8) {
        allPossibleMoves.push(new Move(FileEnum[FileEnum[file] + 1], rank + 1));
      }
      if (FileEnum[file] - 1 >= 1) {
        allPossibleMoves.push(new Move(FileEnum[FileEnum[file] - 1], rank + 1));
      }
    }

    console.log('all possible moves for "' + this.toString() + '": ');
    console.table(allPossibleMoves);

    return allPossibleMoves;
  }

  getLegalMoves(fromFile: string, fromRank: number, board: Square[][]): Move[] {
    let result = [];
    const allPossibleMoves = this.getAllPossibleMoves(fromFile, fromRank);
    // TODO: block if opponent in front
    // TODO: allow if opponent 1 square away diagonally
    result = allPossibleMoves;

    return result;
  }
}
