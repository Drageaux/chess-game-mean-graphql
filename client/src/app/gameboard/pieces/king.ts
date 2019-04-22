import { Piece } from './piece';
import { Square, FileEnum } from '../square';
import { Move } from '../move';
import { default as movesGetter } from '../moves-getter';

export class King extends Piece {
  constructor(color: 'white' | 'black') {
    super('king', color);
  }

  getAllPossibleMoves(file: string, rank: number, board: Square[][]): Move[] {
    const params: [string, number, Square[][]] = [file, rank, board];
    let allPossibleMoves = [];
    allPossibleMoves = allPossibleMoves.concat(
      ...this.getRegularMoves(...params)
    );
    console.log('king moves', allPossibleMoves);
    return allPossibleMoves;
  }

  private getRegularMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Move[] {
    const result: Move[] = [];
    const fileEnum: number = FileEnum[file];
    // 1,0 0,1 -1,0 0,-1
    // 1,1 -1,-1, -1,1 1,-1
    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        if (row === 0 && col === 0) {
          continue;
        } else {
          movesGetter.appendLegalMove(
            this,
            result,
            fileEnum + row,
            rank + col,
            board
          );
        }
      }
    }

    return result;
  }
}
