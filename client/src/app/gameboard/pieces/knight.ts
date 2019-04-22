import { Piece } from './piece';
import { Square, FileEnum } from '../square';
import { Move } from '../move';
import { default as movesGetter } from '../moves-getter';

interface NewMove {
  fileEnum: number;
  rank: number;
}

export class Knight extends Piece {
  constructor(color: 'white' | 'black') {
    super('knight', color);
  }

  getAllPossibleMoves(file: string, rank: number, board: Square[][]): Move[] {
    const params: [string, number, Square[][]] = [file, rank, board];
    let allPossibleMoves = [];
    allPossibleMoves = allPossibleMoves.concat(
      ...this.getRegularMoves(...params)
    );
    console.log('knight moves', allPossibleMoves);
    return allPossibleMoves;
  }

  private getRegularMoves(
    file: string,
    rank: number,
    board: Square[][]
  ): Move[] {
    const result: Move[] = [];
    const fileEnum: number = FileEnum[file];
    // -2+1 -1+2 -1-2 -2-1 +2+1 +1+2 +2-1 +1-2
    // TODO: better to check for boundaries first

    // brute force, since it's a constant maximum num of moves (8)
    const allMoves: NewMove[] = [
      {
        fileEnum: fileEnum - 1,
        rank: rank + 2
      },
      {
        fileEnum: fileEnum - 1,
        rank: rank - 2
      },
      {
        fileEnum: fileEnum - 2,
        rank: rank - 1
      },
      {
        fileEnum: fileEnum - 2,
        rank: rank + 1
      },
      {
        fileEnum: fileEnum + 1,
        rank: rank + 2
      },
      {
        fileEnum: fileEnum + 1,
        rank: rank - 2
      },
      {
        fileEnum: fileEnum + 2,
        rank: rank + 1
      },
      {
        fileEnum: fileEnum + 2,
        rank: rank - 1
      }
    ];
    for (const newM of allMoves) {
      movesGetter.appendLegalMove(
        this,
        result,
        newM.fileEnum,
        newM.rank,
        board
      );
    }

    return result;
  }
}
