import { Subscription, Observable } from 'rxjs';
import { Component } from '@angular/core';
import { Gameboard } from './gameboard';
import { Square } from './square';
import { Piece } from './pieces/piece';
import { King } from './pieces/king';
import { Move } from './move';
import { default as parser } from './board-parser';
import { distinctUntilChanged } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Game } from '@app/interfaces';
import { Color } from '@app/enums';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.scss']
})
export class GameboardComponent {
  // TODO: auth
  isAdmin = true;

  // const
  gb = new Gameboard();
  board2: Square[][] = [];

  // firestore
  private gameDoc: AngularFirestoreDocument<Game>;
  game: Observable<Game>;

  constructor(private db: AngularFirestore) {
    this.gameDoc = this.db.doc<Game>('/games/0svakWzstAjEkmqMN1qt');
    this.game = this.gameDoc.valueChanges();
  }
  update() {
    this.gameDoc.update({ gameOver: true });
  }
  createNewGame() {
    this.db.collection('games').add({
      gameStarted: false,
      gameOver: false,
      currentTurn: Color.White,
      checked: new Map<Color, boolean>([
        [Color.White, false],
        [Color.Black, false]
      ])
    } as Game);
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
