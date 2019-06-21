import { AngularFireDatabase } from '@angular/fire/database';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Gameboard } from './gameboard';
import { Square } from './square';
import { Piece } from './pieces/piece';
import { King } from './pieces/king';
import { Move } from './move';
import { default as parser } from './board-parser';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Game, Board } from '@shared/interfaces';
import { Color } from '@shared/enums';
import { SubSink } from 'subsink';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.scss']
})
export class GameboardComponent implements OnInit {
  // TODO: auth
  isAdmin = true;

  // const
  private subs = new SubSink();
  private;
  gb = new Gameboard();
  // board2: Square[][] = []; // test

  // firestore
  game: Observable<Game>;
  board: Observable<Board>;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private rtdb: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.game = this.afs
      .doc<Game>(`games/${this.route.snapshot.params.gameId}`)
      .valueChanges();

    this.subs.sink = this.game
      .pipe(
        take(1),
        map(val => {
          this.board = this.rtdb
            .object<Board>(`boards/${val.board}`)
            .valueChanges();
        })
      )
      .subscribe();
    // const boardDoc = this.db.doc<Board>(
    //   `games/${this.route.snapshot.params.gameId}/board`
    // );
    // const game = this.db
    // const board = boardDoc.valueChanges().subscribe(console.log);
  }

  update() {
    // this.gameDoc.update({
    //   'gameState.gameOver': true
    // });
  }

  /*********************
   * USER INTERACTIONS *
   *********************/
  // event handling
  handleSquareClick(s: Square) {
    if (s === this.gb.currSquare || this.gb.gameOver) {
      return;
    }
    if (s.piece && s.piece.color === this.gb.currTurn) {
      // if click current player's piece, activate the tile
      this.selectPiece(s);
    } else if (
      this.gb.moving &&
      this.gb.currMovesMap.has(`${s.file}${s.rank}`)
    ) {
      // if click empty tile while a piece is selected/moving, move
      this.gb.movePieceProcess(
        this.gb.currSquare,
        this.gb.currMovesMap.get(`${s.file}${s.rank}`)
      );
    }
  }

  selectPiece(s: Square) {
    this.gb.currSquare = s;
    const p: Piece = s.piece;
    if (p) {
      // console.time('select piece');
      this.gb.moving = true;
      p.getAllLegalMoves(s.file, s.rank, this.gb.board)
        .pipe(distinctUntilChanged())
        .subscribe(allPieceLegalMoves => {
          // if is king, filter out dangerous moves
          // also filter out castling moves if currently checked
          if (p instanceof King) {
            allPieceLegalMoves = this.gb.filterOutKingMoves(
              p,
              allPieceLegalMoves
            );
          }

          this.gb.currMovesMap.clear(); // clear before getting new moves map
          allPieceLegalMoves.forEach(m => {
            // if not checked
            // or if checked but move is legal (in the list of defensive moves)
            if (
              this.gb.legalMovesMaps[p.color].has(
                `${p.myFile}${p.myRank}${m.file}${m.rank}`
              )
            ) {
              this.gb.currMovesMap.set(`${m.file}${m.rank}`, m);
            }
          });
          // console.log(
          //   `Selected ${s.piece} ${s.file}${s.rank}\nmoves:`,
          //   this.gb.currMovesMap
          // );

          // console.timeEnd('select piece');
        });
    }
  }
}
