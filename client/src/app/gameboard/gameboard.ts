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
import { map } from 'rxjs/operators';
import cloneDeep = require('lodash/cloneDeep');

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
  checked: { white: boolean; black: boolean } = {
    white: false,
    black: false
  };
  // events
  onMoved = new EventEmitter<any>();
  onMovedObs: Observable<any>[] = [];
  onChecked = new EventEmitter<'white' | 'black'>();
  onCheckedObs: Observable<any>[] = [];
  // opponent interactions
  attackMovesMaps: {
    white: Map<string, Move>;
    black: Map<string, Move>;
  } = {
    white: new Map(),
    black: new Map()
  };
  defendMovesMaps: {
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
    this.getAttackMovesMap('black', this.onMovedObs).subscribe(movesMap => {
      this.attackMovesMaps.black = movesMap;
      this.onMovedObs = [];
    });
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
   * Update the passed in board & captured pieces,
   * based on the starting point and destination
   *
   * @param capturedPieces - will have side effects
   * @param board - will have side effects
   */
  moveFromTo(
    currSquare: Square,
    nextSquare: Square,
    capturedPieces: Set<Piece>
  ) {
    if (nextSquare.piece) {
      capturedPieces.add(nextSquare.piece);
    }
    // move piece to new position & update piece's knowledge of its position
    nextSquare.piece = currSquare.piece;
    nextSquare.piece.myFile = nextSquare.file;
    nextSquare.piece.myRank = nextSquare.rank;
    // remove piece from old position
    currSquare.piece = null;
  }

  /**
   * Moving a piece from one place to a destination, given an original Square object and the next Move
   * (check for special moves, update necessary properties)
   */
  movePieceProcess(s: Square, move: Move) {
    const nextSquare = parser.getSquare(move.file, move.rank, this.board);
    if (!nextSquare) {
      // TODO: throw invalid/out of bound square
      return;
    }

    // the "atomic" move
    this.moveFromTo(s, nextSquare, this.capturedPieces);

    // check for special conditions
    // TODO: prompt to promote
    if (
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

    const attackingTeamColor: 'white' | 'black' = nextSquare.piece.color;
    // aggregate to attack enemy King
    this.getAttackMovesMap(attackingTeamColor, this.onMovedObs).subscribe(
      movesMap => {
        this.attackMovesMaps[attackingTeamColor] = movesMap;
        const defendingTeamColor: 'white' | 'black' =
          attackingTeamColor === 'white' ? 'black' : 'white';
        this.attackMovesMaps[defendingTeamColor].clear();
        if (this.checkKing(attackingTeamColor, movesMap)) {
          // force defend
          this.checked[defendingTeamColor] = true;
          this.getDefendMovesMap(defendingTeamColor);
        } else {
          this.checked[defendingTeamColor] = false;
        }
      },
      err => console.error(err),
      () => {
        this.onMovedObs = [];
        // stop moving
        this.stopMoving();
        // switch player, making sure to compare colors based on the piece that just moved
        this.currTurn = attackingTeamColor === 'white' ? 'black' : 'white';
      }
    );
  }

  filterOutKingMoves(p: King, allPieceLegalMoves) {
    const attackingTeamColor: 'white' | 'black' =
      p.color === 'white' ? 'black' : 'white';
    allPieceLegalMoves = allPieceLegalMoves.filter(m => {
      if (!this.attackMovesMaps[attackingTeamColor].has(`${m.file}${m.rank}`)) {
        if (m.castle && this.checked[p.color]) {
          return false;
        }
        return true;
      }
    });
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
    const attackSubscription: Subscription = this.onMoved.subscribe($event => {
      if (this.capturedPieces.has(piece)) {
        // free up resource every move
        // don't do any of this if captured
        attackSubscription.unsubscribe();
        return;
      }
      if (piece.color === $event.color) {
        // make aggregation observable
        const observable = new Observable(observer => {
          piece
            .getAttackMoves(piece.myFile, piece.myRank, $event.board)
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
                result = result.map(m => {
                  m.fromFile = piece.myFile;
                  m.fromRank = piece.myRank;
                  return m;
                });
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
  private getAttackMovesMap(
    attackTeamColor: 'white' | 'black',
    onMovedObs: Observable<any>[]
  ): Observable<Map<string, Move>> {
    console.time('getting attack moves');
    // signals that this turn is over, trigger onMoved event
    this.onMoved.emit({ color: attackTeamColor, board: this.board });
    // after onMoved and every of this color's attack moves is updated
    // aggregate attack moves to check the enemy King
    return zip(...onMovedObs).pipe(
      map((val: Move[][]) => {
        const newAttackMoveMaps: Map<string, Move> = new Map();

        const attackMovesArr: Move[] = [].concat.apply([], val);
        attackMovesArr.forEach(m =>
          newAttackMoveMaps.set(`${m.file}${m.rank}`, m)
        );
        this.onMovedObs = [];
        console.timeEnd('getting attack moves');
        return newAttackMoveMaps;
      })
    );
  }

  private getDefendMovesMap(color: 'white' | 'black') {
    this.onChecked.emit(color);
    return zip(...this.onCheckedObs).pipe(
      map((val: Move[][]) => {
        const newDefendMoveMaps: Move[] = [].concat.apply([], val);
        const defendMovesArr: Move[] = [].concat.apply([], val);
        defendMovesArr.forEach(m => {
          this.simulateMove();
        });
        return newDefendMoveMaps;
      })
    );
  }

  private checkKing(
    attackTeamColor: 'white' | 'black',
    movesMap: Map<string, Move>
  ): boolean {
    if (attackTeamColor === 'white') {
      return movesMap.has(
        `${this.blackKingPiece.myFile}${this.blackKingPiece.myRank}`
      );
    } else {
      return movesMap.has(
        `${this.whiteKingPiece.myFile}${this.whiteKingPiece.myRank}`
      );
    }
  }

  private stopMoving() {
    this.currMovesMap.clear();
    this.moving = false;
  }

  boards: Square[][][];
  simulateMove(move: Move) {
    let clone = this.deepcopy(this.board);

    const currSquare = parser.getSquare(move.fromFile, move.fromRank, clone);
    const nextSquare = parser.getSquare(move.file, move.rank, clone);
    if (!nextSquare) {
      // TODO: throw wrong square
      return;
    }

    this.moveFromTo(currSquare, nextSquare, new Set());
    this.boards.push(clone);
    // return zip(...onMovedObs).pipe()

    // garbage collect
    clone = null;
    return;
  }

  deepcopy(obj) {
    return cloneDeep(obj);
  }

  /*****************
   * SPECIAL MOVES *
   *****************/
  private castle(destination: string, color: 'white' | 'black'): void {
    if (
      (color === 'white' && this.checked[color]) ||
      (color === 'black' && this.checked[color])
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
      this.movePieceProcess(s, m);
    }
  }
}
