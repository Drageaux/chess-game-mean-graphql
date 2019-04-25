import { Component, OnInit, EventEmitter } from '@angular/core';
import { Square, FileEnum } from './square';
import BoardParser, { default as parser } from './board-parser';
import { default as movesGetter } from './moves-getter';
import { Piece } from './pieces/piece';
import { Pawn } from './pieces/pawn';
import { Rook } from './pieces/rook';
import { Knight } from './pieces/knight';
import { Bishop } from './pieces/bishop';
import { Queen } from './pieces/queen';
import { King } from './pieces/king';
import { Move } from './move';
import { of } from 'rxjs/internal/observable/of';
import { Observer, Observable, zip, timer, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.scss']
})
export class GameboardComponent implements OnInit {
  // TODO: auth
  isAdmin = true;

  // const
  BOARD_SIZE = 8;
  parser = BoardParser;
  board: Square[][] = [];

  // game status
  moving = false;
  currMovesMap: Map<string, Move> = new Map();
  currTurn: 'black' | 'white' = 'white';
  currSquare: Square;
  capturedPieces: Set<Piece> = new Set();
  whiteKingPiece: King;
  blackKingPiece: King;
  whiteKingChecked = false;
  blackKingChecked = false;
  // events
  onMoved = new EventEmitter<any>();
  onMovedObs: Observable<any>[] = [];
  // opponent interactions
  attackMovesMap: { white: Map<string, Move>; black: Map<string, Move> } = {
    white: new Map(),
    black: new Map()
  };

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
    this.whiteKingPiece = new King('white');
    this.blackKingPiece = new King('black');

    for (const rank of this.board) {
      for (const sq of rank) {
        let piece: Piece = null;
        if (sq.rank === 2) {
          piece = new Pawn('white');
        } else if (sq.rank === 7) {
          piece = new Pawn('black');
        } else if (sq.rank === 1) {
          const f = sq.file;
          if (f === 'a' || f === 'h') {
            piece = new Rook('white');
            const subscription = (piece as Rook).hasMoved.subscribe($event => {
              this.whiteKingPiece.hasMoved = $event;
              subscription.unsubscribe();
            });
          } else if (f === 'b' || f === 'g') {
            piece = new Knight('white');
          } else if (f === 'c' || f === 'f') {
            piece = new Bishop('white');
          } else if (f === 'd') {
            piece = new Queen('white');
          } else if (f === 'e') {
            piece = this.whiteKingPiece;
          }
        } else if (sq.rank === 8) {
          const f = sq.file;
          if (f === 'a' || f === 'h') {
            piece = new Rook('black');
            const subscription = (piece as Rook).hasMoved.subscribe($event => {
              this.blackKingPiece.hasMoved = $event;
              subscription.unsubscribe();
            });
          } else if (f === 'b' || f === 'g') {
            piece = new Knight('black');
          } else if (f === 'c' || f === 'f') {
            piece = new Bishop('black');
          } else if (f === 'd') {
            piece = new Queen('black');
          } else if (f === 'e') {
            piece = this.blackKingPiece;
          }
        }

        if (piece) {
          piece.myFile = sq.file;
          piece.myRank = sq.rank;

          this.configurePieceEvents(piece);

          sq.piece = piece;
        }
      }
    }

    // this.addTestPieces();
    // check for attack moves for 2nd player
    this.aggregateAttackMoves('black');
  }

  private addTestPieces() {
    // for testing
    this.insertPiece('a', 6, new Pawn('white'));
    this.insertPiece('d', 6, new Pawn('black'));
    this.insertPiece('e', 6, new Rook('white'));
    this.insertPiece('e', 3, new Pawn('black'));
    this.insertPiece('f', 3, new Pawn('white'));
    this.insertPiece('h', 6, new Bishop('white'));
    this.removePiece('b', 8);
    this.removePiece('c', 8);
    this.removePiece('d', 8);
    this.removePiece('f', 8);
    this.removePiece('g', 8);
  }

  /*********************
   * USER INTERACTIONS *
   *********************/
  // event handling
  handleSquareClick(s: Square) {
    if (s === this.currSquare) {
      return;
    }

    if (s.piece && s.piece.color === this.currTurn) {
      // if click current player's piece, activate the tile
      this.selectPiece(s);
    } else if (this.moving && this.currMovesMap.has(`${s.file}${s.rank}`)) {
      // if click empty tile while a piece is selected/moving, move
      this.movePiece(
        this.currSquare,
        this.currMovesMap.get(`${s.file}${s.rank}`)
      );
    }
  }

  selectPiece(s: Square) {
    this.currSquare = s;
    const p: Piece = s.piece;
    if (p) {
      this.moving = true;

      p.getAllLegalMoves(s.file, s.rank, this.board).subscribe(
        allPieceLegalMoves => {
          // if is king, filter out dangerous moves
          if (p instanceof King) {
            if (p.color === 'white') {
              allPieceLegalMoves = allPieceLegalMoves.filter(
                m => !this.attackMovesMap.black.has(`${m.file}${m.rank}`)
              );
            } else if (p.color === 'black') {
              allPieceLegalMoves = allPieceLegalMoves.filter(
                m => !this.attackMovesMap.white.has(`${m.file}${m.rank}`)
              );
            }
          }

          this.currMovesMap.clear();
          allPieceLegalMoves.forEach(m => {
            this.currMovesMap.set(`${m.file}${m.rank}`, m);
          });
          console.log(
            `${s.piece} ${s.file}${s.rank} moves:`,
            this.currMovesMap
          );
        }
      );
    }
  }

  /*******************
   * DATA MANAGEMENT *
   *******************/
  /**
   * Adds event subscription, etc., to the [[Piece]]
   * On move, get [[Piece]]'s attack moves to check the enemy [[King]]
   */
  private configurePieceEvents(piece: Piece) {
    // observing upon move; get moves that may be dangerous for the opposing King
    const subscription = this.onMoved.subscribe(($event: 'white' | 'black') => {
      if (this.capturedPieces.has(piece)) {
        // free up resource every move
        // don't do any of this if captured
        subscription.unsubscribe();
        return;
      }
      if (piece.color === $event) {
        // make aggregation observable
        const observable = new Observable(observer => {
          piece
            .getAttackMoves(piece.myFile, piece.myRank, this.board)
            .subscribe((result: Move[]) => {
              observer.next(result);
              // free up resource after every attack moves update
              // because this observable is remade every move
              observer.complete();
            });
        });
        this.onMovedObs.push(observable);
      }
    });
  }

  private insertPiece(file: string, rank: number, piece: Piece): boolean {
    // check if a piece already exists
    this.configurePieceEvents(piece);
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
      const piece: Piece = this.board[rank - 1][parser.fileStrToNum(file) - 1]
        .piece;
      this.capturedPieces.add(piece);
      this.board[rank - 1][parser.fileStrToNum(file) - 1].piece = null;
      return true;
    }
    return false;
  }

  /**
   * Moving a piece from one place to a destination, given an original Square object and the next Move
   * (check for special moves, update necessary properties)
   */
  private movePiece(s: Square, move: Move) {
    const nextSquare = parser.getSquare(move.file, move.rank, this.board);
    if (!nextSquare) {
      // TODO: throw wrong square
      return;
    }

    // capture piece on destination
    if (nextSquare.piece) {
      this.capturedPieces.add(nextSquare.piece);
    }
    // move piece to new position & update piece's knowledge of its position
    nextSquare.piece = s.piece;
    nextSquare.piece.myFile = nextSquare.file;
    nextSquare.piece.myRank = nextSquare.rank;
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
      return;
    }

    const color: 'white' | 'black' = nextSquare.piece.color;
    // stop moving
    this.stopMoving();

    this.aggregateAttackMoves(color);
    // switch player, making sure to compare colors based on the piece that just moved
    this.currTurn = color === 'white' ? 'black' : 'white';
  }

  /**
   * In order to check enemy King, all ally Pieces must know
   * the Squares they are attacking
   */
  private aggregateAttackMoves(color: 'white' | 'black') {
    // console.time('getting attack moves');
    // signals that this turn is over, trigger onMoved event
    this.onMoved.emit(color);
    // after onMoved and every of this color's attack moves is updated
    // aggregate attack moves to check the enemy King
    zip(...this.onMovedObs).subscribe((val: Move[][]) => {
      const attackMoves: Move[] = [].concat.apply([], val);
      attackMoves.forEach(m =>
        this.attackMovesMap[color].set(`${m.file}${m.rank}`, m)
      );
      // refresh moves maps and observables list
      if (color === 'white') {
        this.attackMovesMap.black.clear();
      } else if (color === 'black') {
        this.attackMovesMap.white.clear();
      }
      this.onMovedObs = [];
      // console.timeEnd('getting attack moves');
    });
  }

  private checkEnemyKing(myColor: 'white' | 'black') {
    myColor === 'white'
      ? (this.blackKingChecked = true)
      : (this.whiteKingChecked = true);
  }

  private stopMoving() {
    this.currMovesMap.clear();
    this.moving = false;
  }

  /*****************
   * SPECIAL MOVES *
   *****************/
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
