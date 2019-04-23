import { Component, OnInit } from '@angular/core';
import { Square, FileEnum } from './square';
import { default as parser } from './gameboard-parser';
import { default as movesGetter } from './moves-getter';
import { Piece } from './pieces/piece';
import { Pawn } from './pieces/pawn';
import { Rook } from './pieces/rook';
import { Knight } from './pieces/knight';
import { Bishop } from './pieces/bishop';
import { Queen } from './pieces/queen';
import { King } from './pieces/king';
import { Observable } from 'rxjs';
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
  currMoves: Move[] = [];
  currMovesInStr: string[] = [];
  currTurn: 'black' | 'white' = 'white';
  currSquare: Square;
  capturedPieces: Piece[] = [];
  whiteCastling = false;
  blackCastling = false;
  canCastle;

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
    const whiteKingPiece: King = new King('white');
    const blackKingPiece: King = new King('black');

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
            (sq.piece as Rook).hasMoved.subscribe(
              ($event) => (whiteKingPiece.hasMoved = $event)
            );
          } else if (f === 'b' || f === 'g') {
            sq.piece = new Knight('white');
          } else if (f === 'c' || f === 'f') {
            sq.piece = new Bishop('white');
          } else if (f === 'd') {
            sq.piece = new Queen('white');
          } else if (f === 'e') {
            sq.piece = whiteKingPiece;
          }
        } else if (sq.rank === 8) {
          const f = sq.file;
          if (f === 'a' || f === 'h') {
            sq.piece = new Rook('black');
            (sq.piece as Rook).hasMoved.subscribe(
              ($event) => (blackKingPiece.hasMoved = $event)
            );
          } else if (f === 'b' || f === 'g') {
            sq.piece = new Knight('black');
          } else if (f === 'c' || f === 'f') {
            sq.piece = new Bishop('black');
          } else if (f === 'd') {
            sq.piece = new Queen('black');
          } else if (f === 'e') {
            sq.piece = blackKingPiece;
          }
        }
      }
    }

    // for testing
    this.insertPiece('a', 6, new Pawn('white'));
    this.insertPiece('d', 6, new Pawn('black'));
    this.insertPiece('e', 6, new Rook('white'));
    this.insertPiece('e', 3, new Pawn('black'));
    this.insertPiece('f', 3, new Pawn('white'));
    this.insertPiece('h', 6, new Bishop('white'));
    this.removePiece('b', 1);
    this.removePiece('c', 1);
    this.removePiece('d', 1);
    this.removePiece('f', 1);
    this.removePiece('g', 1);
    this.removePiece('b', 8);
    this.removePiece('c', 8);
    this.removePiece('d', 8);
    this.removePiece('f', 8);
    this.removePiece('g', 8);
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
      this.movePiece(
        this.currSquare,
        this.currMoves.filter((x) => x.file === s.file && x.rank === s.rank)[0]
      );
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
      this.currMoves = p.getAllPossibleMoves(s.file, s.rank, this.board);
      this.currMovesInStr = parser.movesToStrings(this.currMoves);
    }
  }

  private insertPiece(file: string, rank: number, piece: Piece): boolean {
    // check if a piece already exists
    if (
      !parser.isOutOfBound(file, rank) &&
      !this.board[rank - 1][parser.fileStrToNum(file) - 1].piece
    ) {
      this.board[rank - 1][parser.fileStrToNum(file) - 1].piece = piece;
      return true;
    }
    return false;
  }

  private removePiece(file: string, rank: number) {
    if (!parser.isOutOfBound(file, rank)) {
      this.board[rank - 1][parser.fileStrToNum(file) - 1].piece = null;
      return true;
    }
    return false;
  }

  private movePiece(s: Square, move: Move) {
    const nextSquare = parser.getSquare(move.file, move.rank, this.board);
    if (!nextSquare) {
      // TODO: throw wrong square
      return;
    }

    // capture piece on destination
    if (nextSquare.piece) {
      this.capturedPieces.push(nextSquare.piece);
    }
    // move piece to new position
    nextSquare.piece = s.piece;
    // remove piece from old position
    s.piece = null;

    // check for special conditions
    if (nextSquare.piece instanceof Pawn) {
      // TODO: prompt to promote
      if (nextSquare.piece.color === 'white' && nextSquare.rank === 8) {
      } else if (nextSquare.piece.color === 'black' && nextSquare.rank === 1) {
      }
    } else if (
      // no longer able to castle
      nextSquare.piece instanceof Rook ||
      nextSquare.piece instanceof King
    ) {
      nextSquare.piece.updateHasMoved();
    }

    // castling
    if (move.castle) {
      this.castle(move.file, nextSquare.piece.color);
    }

    // stop moving
    this.stopMoving();
    // switch player, making sure to compare colors based on the piece that just moved
    this.currTurn = nextSquare.piece.color === 'white' ? 'black' : 'white';
  }

  private stopMoving() {
    this.currMoves = [];
    this.currMovesInStr = [];
    this.moving = false;
  }

  // special moves
  private castle(destination: string, color: 'white' | 'black'): void {
    let s: Square;
    let m: Move;
    if (destination === 'c') {
      const rank = color === 'white' ? 1 : 8;
      s = parser.getSquare('a', rank, this.board);
      m = movesGetter.makeMove('d', rank);
    } else if (destination === 'g') {
      const rank = color === 'white' ? 1 : 8;
      s = parser.getSquare('h', rank, this.board);
      m = movesGetter.makeMove('f', rank);
    }

    if (s && m) {
      this.movePiece(s, m);
    }
  }
}
