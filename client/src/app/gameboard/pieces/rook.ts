import { Piece } from './piece';
import { Square } from '../square';
import { Move } from '../move';
import { default as movesGetter } from '../moves-getter';
import { EventEmitter } from '@angular/core';

export class Rook extends Piece {
  hasMoved = new EventEmitter<boolean>();

  constructor(color: 'white' | 'black', hasMoved: boolean = false) {
    super('rook', color);
  }

  updateHasMoved() {
    this.hasMoved.emit(true);
  }

  getAllPossibleMoves(file: string, rank: number, board: Square[][]): Move[] {
    const params: [string, number, Square[][]] = [file, rank, board];
    let allPossibleMoves = [];
    allPossibleMoves = allPossibleMoves.concat(
      ...movesGetter.getStraightLineMoves(this, ...params)
    );
    console.log('rook moves', allPossibleMoves);
    return allPossibleMoves;
  }
}
