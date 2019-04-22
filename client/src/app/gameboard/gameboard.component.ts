import { Component, OnInit } from '@angular/core';
import { Square, FileEnum } from './square';
import { default as parser } from './gameboard-parser';
import { Piece } from './pieces/piece';
import { Pawn } from './pieces/pawn';
import { Rook } from './pieces/rook';
import { Knight } from './pieces/knight';
import { Bishop } from './pieces/bishop';
import { Queen } from './pieces/queen';
import { King } from './pieces/king';
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
  currTurn: 'black' | 'white' = 'white';
  currSquare: Square;
  capturedPieces: Piece[] = [];

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
          if (f === 'a' || f === 'h') {
            sq.piece = new Rook('white');
          } else if (f === 'b' || f === 'g') {
            sq.piece = new Knight('white');
          } else if (f === 'c' || f === 'f') {
            sq.piece = new Bishop('white');
          } else if (f === 'd') {
            sq.piece = new Queen('white');
          } /*else if (f === 'e') {
            sq.piece = new King('white');
          }
          */
        } else if (sq.rank === 8) {
          const f = sq.file;
          if (f === 'a' || f === 'h') {
            sq.piece = new Rook('black');
          } else if (f === 'b' || f === 'g') {
            sq.piece = new Knight('black');
          } else if (f === 'c' || f === 'f') {
            sq.piece = new Bishop('black');
          } else if (f === 'd') {
            sq.piece = new Queen('black');
          } /* else if (f === 'e') {
            sq.piece = new King('black');
          }
          */
        }
      }
      console.log(rank);
    }

    // for testing
    this.insertPiece('a', 6, new Pawn('white'));
    this.insertPiece('e', 6, new Rook('white'));
    this.insertPiece('e', 3, new Pawn('black'));
    this.insertPiece('f', 3, new Pawn('white'));
    this.insertPiece('h', 6, new Bishop('white'));
  }

  // event handling
  handleSquareClick(s: Square) {
    if (s.piece && s.piece.color === this.currTurn) {
      // if click current player's piece, activate the tile
      this.selectPiece(s);
    } else if (
      this.moving &&
      this.currMovesInStr.indexOf(`${s.file}${s.rank}`) !== -1
    ) {
      // if click empty tile, move
      this.movePiece(this.currSquare, s);
    }
  }

  selectPiece(s: Square) {
    if (s === this.currSquare) {
      return;
    }
    this.currSquare = s;
    const p: Piece = s.piece;
    if (p) {
      this.moving = true;

      // help render
      this.currMovesInStr = parser.movesToStrings(
        p.getAllPossibleMoves(s.file, s.rank, this.board)
      );
    }
  }

  private insertPiece(file: string, rank: number, piece: Piece) {
    // check if a piece already exists
    if (!this.board[rank - 1][FileEnum[file] - 1].piece) {
      this.board[rank - 1][FileEnum[file] - 1].piece = piece;
    }
  }

  private movePiece(s: Square, nextSquare: Square) {
    if (nextSquare.piece) {
      this.capturedPieces.push(nextSquare.piece);
    }
    // move piece to new position, and maybe do something special with it
    nextSquare.piece = s.piece;
    if (nextSquare instanceof Pawn) {
      // TODO: prompt to promote
      if (nextSquare.piece.color === 'white' && nextSquare.rank === 8) {
      } else if (nextSquare.piece.color === 'black' && nextSquare.rank === 1) {
      }
    }

    // remove piece from old position
    s.piece = null;
    // reset current status
    this.currMovesInStr = [];
    this.moving = false;
    // switch player
    this.currTurn = this.currTurn === 'white' ? 'black' : 'white';
  }
}
