import { Component, OnInit } from '@angular/core';
import { Square, FileEnum } from './square';
import { default as parser } from './gameboard-parser';
import { Piece } from './pieces/piece';
import { Pawn } from './pieces/pawn';
/*
import { Rook } from './pieces/rook';
import { Knight } from './pieces/knight';
import { Bishop } from './pieces/bishop';
import { Queen } from './pieces/queen';
import { King } from './pieces/king';
*/
import { Move } from './move';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.scss']
})
export class GameboardComponent implements OnInit {
  BOARD_SIZE = 8;
  board: Square[][] = [];
  moving = false;
  currMovesInStr: string[] = [];

  constructor() {
    for (let i = 0; i < this.BOARD_SIZE; i++) {
      this.board.push(this.addFileSquares(i + 1));
    }
  }

  // board construction
  addFileSquares(currRank: number): Square[] {
    const rank: Square[] = [];
    for (let i = 0; i < 8; i++) {
      rank.push(new Square(FileEnum[i + 1], currRank));
    }
    return rank;
  }

  // set up pieces
  ngOnInit() {
    for (const rank of this.board) {
      for (const sq of rank) {
        if (sq.rank === 2) {
          sq.piece = new Pawn('white');
        } else if (sq.rank === 7) {
          sq.piece = new Pawn('black');
        } else if (sq.rank === 1) {
          const f = sq.file;
          /*
          if (f === 'a' || f === 'h') {
            sq.piece = new Rook('white');
          } else if (f === 'b' || f === 'g') {
            sq.piece = new Knight('white');
          } else if (f === 'c' || f === 'f') {
            sq.piece = new Bishop('white');
          } else if (f === 'd') {
            sq.piece = new Queen('white');
          } else if (f === 'e') {
            sq.piece = new King('white');
          }
          */
        } else if (sq.rank === 8) {
          const f = sq.file;
          /*
          if (f === 'a' || f === 'h') {
            sq.piece = new Rook('black');
          } else if (f === 'b' || f === 'g') {
            sq.piece = new Knight('black');
          } else if (f === 'c' || f === 'f') {
            sq.piece = new Bishop('black');
          } else if (f === 'd') {
            sq.piece = new Queen('black');
          } else if (f === 'e') {
            sq.piece = new King('black');
          }
          */
        }
      }
      console.log(rank);
    }

    // for testing
    this.insertPiece('a', 6, new Pawn('white'));
    this.insertPiece('e', 6, new Pawn('white'));
  }

  selectSquare(s: Square) {
    const p: Piece = s.piece;
    if (p) {
      this.moving = true;

      this.currMovesInStr = parser.movesToStrings(
        p.getAllPossibleMoves(s.file, s.rank, this.board)
      );
      console.log(this.currMovesInStr);
    }
  }

  private insertPiece(file: string, rank: number, piece: Piece) {
    this.board[rank - 1][FileEnum[file] - 1].piece = piece;
  }
}
