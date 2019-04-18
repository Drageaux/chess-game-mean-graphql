import { Component, OnInit } from '@angular/core';
import { Square, FileEnum } from './square';
import { Piece } from './piece';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.scss']
})
export class GameboardComponent implements OnInit {
  BOARD_SIZE = 8;
  board: Square[][] = [];

  constructor() {
    for (let i = 0; i < this.BOARD_SIZE; i++) {
      this.board.push(this.addFileSquares(i + 1));
    }
  }

  // board construction
  addFileSquares(currRank: number): Square[] {
    const rank: Square[] = [];
    for (let i = 0; i < 8; i++) {
      rank.push(new Square(currRank, FileEnum[i + 1]));
    }
    // console.log(rank);
    return rank;
  }

  // set up pieces
  ngOnInit() {
    for (const ranks of this.board) {
      for (const sq of ranks) {
        sq.piece = new Piece('pawn', 'white');
      }
      console.log(ranks);
    }
  }
}
