import { EventEmitter } from '@angular/core';
import { Square, FileEnum } from './square';
import { default as parser } from './board-parser';
import { default as movesGetter } from './moves-getter';
import { Piece } from './pieces/piece';
import { Pawn } from './pieces/pawn';
import { Rook } from './pieces/rook';
import { Bishop } from './pieces/bishop';
import { Knight } from './pieces/knight';
import { Queen } from './pieces/queen';
import { King } from './pieces/king';
import { Move } from './move';
import { Observable, zip, Subscription } from 'rxjs';

export class Gameboard {
  // const
  BOARD_SIZE = 8;
  // game board structure
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
  onChecked = new EventEmitter<'white' | 'black'>();
  onCheckedObs: Observable<any>[] = [];
  // opponent interactions
  attackMovesMap: {
    white: Map<string, Move>;
    black: Map<string, Move>;
  } = {
    white: new Map(),
    black: new Map()
  };

  constructor() {
    for (let i = 0; i < this.BOARD_SIZE; i++) {
      this.board.push(this.addFileSquares(i + 1));
    }

    // set up Kings first to watch Rooks on move
    this.whiteKingPiece = new King('white');
    this.blackKingPiece = new King('black');
    this.insertPiece('e', 1, this.whiteKingPiece);
    this.insertPiece('e', 8, this.blackKingPiece);

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
          } else if (f === 'b' || f === 'g') {
            piece = new Knight('white');
          } else if (f === 'c' || f === 'f') {
            piece = new Bishop('white');
          } else if (f === 'd') {
            piece = new Queen('white');
          }
        } else if (sq.rank === 8) {
          const f = sq.file;
          if (f === 'a' || f === 'h') {
            piece = new Rook('black');
          } else if (f === 'b' || f === 'g') {
            piece = new Knight('black');
          } else if (f === 'c' || f === 'f') {
            piece = new Bishop('black');
          } else if (f === 'd') {
            piece = new Queen('black');
          }
        }

        if (piece) {
          this.insertPiece(sq.file, sq.rank, piece);
        }
      }
    }

    this.addTestPieces();
    // check for attack moves for 2nd player
    this.aggregateAttackMoves('black');
  }

  /***************
   * BASIC SETUP *
   ***************/
  // board construction
  private addFileSquares(currRank: number): Square[] {
    const rank: Square[] = [];
    for (let i = 0; i < 8; i++) {
      rank.push(new Square(FileEnum[i + 1], currRank));
    }
    return rank;
  }

  private addTestPieces() {
    // for testing
    this.removePiece('b', 8);
    this.removePiece('c', 8);
    this.removePiece('d', 8);
    this.removePiece('g', 8);
    this.insertPiece('a', 6, new Pawn('white'));
    this.insertPiece('d', 6, new Pawn('black'));
    this.insertPiece('e', 6, new Rook('white'));
    this.insertPiece('e', 3, new Pawn('black'));
    this.insertPiece('f', 3, new Pawn('white'));
    this.insertPiece('h', 6, new Bishop('white'));
    this.insertPiece('f', 6, new Queen('white'));
  }

  /*******************
   * DATA MANAGEMENT *
   *******************/

  insertPiece(file: string, rank: number, piece: Piece): boolean {
    // check if a piece already exists
    if (
      !parser.isOutOfBound(file, rank) &&
      !this.board[rank - 1][parser.fileStrToNum(file) - 1].piece
    ) {
      piece.myFile = file;
      piece.myRank = rank;
      this.configurePieceEvents(piece);
      this.board[rank - 1][parser.fileStrToNum(file) - 1].piece = piece;
      return true;
    }
    return false;
  }

  removePiece(file: string, rank: number) {
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
  movePiece(s: Square, move: Move) {
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
    // aggregate to check
    this.aggregateAttackMoves(color);
    // switch player, making sure to compare colors based on the piece that just moved
    this.currTurn = color === 'white' ? 'black' : 'white';
  }

  aggregateAllLegalMoves() {}

  filterOutKingMoves(p: King, allPieceLegalMoves) {
    if (p.color === 'white') {
      allPieceLegalMoves = allPieceLegalMoves.filter(m => {
        if (!this.attackMovesMap.black.has(`${m.file}${m.rank}`)) {
          if (m.castle && this.whiteKingChecked) {
            return false;
          }
          return true;
        }
      });
    } else if (p.color === 'black') {
      allPieceLegalMoves = allPieceLegalMoves.filter(m => {
        if (!this.attackMovesMap.white.has(`${m.file}${m.rank}`)) {
          if (m.castle && this.blackKingChecked) {
            return false;
          }
          return true;
        }
      });
    }
    return allPieceLegalMoves;
  }

  /**
   * Adds event subscription, etc., to the [[Piece]]
   * On move, get [[Piece]]'s attack moves to check the enemy [[King]]
   * On checked, get [[Piece]]'s defend moves to defend the ally [[King]]
   */
  private configurePieceEvents(piece: Piece) {
    // on Rook's has moved, King can't castle anymore
    if (piece instanceof Rook) {
      if (piece.color === 'white') {
        const whiteRookSubscription: Subscription = (piece as Rook).hasMoved.subscribe(
          $event => {
            this.whiteKingPiece.hasMoved = $event;
            whiteRookSubscription.unsubscribe();
          }
        );
      } else if (piece.color === 'black') {
        const blackRookSubscription: Subscription = (piece as Rook).hasMoved.subscribe(
          $event => {
            this.blackKingPiece.hasMoved = $event;
            blackRookSubscription.unsubscribe();
          }
        );
      }
    }

    // observing upon move; get moves that may be dangerous for the opposing King
    const attackSubscription: Subscription = this.onMoved.subscribe(
      ($event: 'white' | 'black') => {
        if (this.capturedPieces.has(piece)) {
          // free up resource every move
          // don't do any of this if captured
          attackSubscription.unsubscribe();
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
      }
    );

    // on checked, find moves to defend the King
    const defendSubscription = this.onChecked.subscribe(
      ($event: 'white' | 'black') => {
        if (this.capturedPieces.has(piece)) {
          // free up resource every move
          // don't do any of this if captured
          defendSubscription.unsubscribe();
          return;
        }
        if (piece.color === $event) {
          // make aggregation observable
          const observable = new Observable(observer => {
            piece
              .getAllLegalMoves(piece.myFile, piece.myRank, this.board)
              .subscribe((result: Move[]) => {
                if (piece instanceof King) {
                  result = this.filterOutKingMoves(piece, result);
                }
                observer.next(result);
                // free up resource after every attack moves update
                // because this observable is remade every move
                observer.complete();
              });
          });
          this.onCheckedObs.push(observable);
        }
      }
    );
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
      // is enemy king in ally Pieces' next moves?
      this.checkKing();
      // console.timeEnd('getting attack moves');
    });
  }

  private checkKing() {
    this.blackKingChecked = this.attackMovesMap.white.has(
      `${this.blackKingPiece.myFile}${this.blackKingPiece.myRank}`
    );
    this.whiteKingChecked = this.attackMovesMap.black.has(
      `${this.whiteKingPiece.myFile}${this.whiteKingPiece.myRank}`
    );
    // TODO: force defend
    if (this.blackKingChecked) {
      this.defend('black');
    } else if (this.whiteKingChecked) {
      this.defend('white');
    }
  }

  private defend(color: 'white' | 'black') {
    this.onChecked.emit(color);
    zip(...this.onCheckedObs).subscribe((val: Move[][]) => {
      const defendMoves: Move[] = [].concat.apply([], val);
      console.log(defendMoves);
    });
  }

  private stopMoving() {
    this.currMovesMap.clear();
    this.moving = false;
  }

  /*****************
   * SPECIAL MOVES *
   *****************/
  private castle(destination: string, color: 'white' | 'black'): void {
    if (
      (color === 'white' && this.whiteKingChecked) ||
      (color === 'black' && this.blackKingChecked)
    ) {
      return;
    }
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
