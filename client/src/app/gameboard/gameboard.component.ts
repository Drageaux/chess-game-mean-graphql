import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { Gameboard } from './gameboard';
import { Square } from './square';
import { Piece } from './pieces/piece';
import { King } from './pieces/king';
import { Move } from './move';
import { default as parser } from './board-parser';
import { cloneDeep } from 'lodash';

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

  constructor() {}

  /*********************
   * USER INTERACTIONS *
   *********************/
  // event handling
  handleSquareClick(s: Square) {
    if (s === this.gb.currSquare) {
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
      this.gb.moving = true;
      p.getAllLegalMoves(s.file, s.rank, this.gb.board).subscribe(
        allPieceLegalMoves => {
          // if is king, filter out dangerous moves
          // also filter out castling moves if currently checked
          if (p instanceof King) {
            allPieceLegalMoves = this.gb.filterOutKingMoves(
              p,
              allPieceLegalMoves
            );
          }

          this.gb.currMovesMap.clear();
          allPieceLegalMoves.forEach(m => {
            this.cloneBoard(s, m);
            this.gb.currMovesMap.set(`${m.file}${m.rank}`, m);
          });
          console.log(
            `Selected ${s.piece} ${s.file}${s.rank}\nmoves:`,
            this.gb.currMovesMap
          );
        }
      );
    }
  }

  cloneBoard(s: Square, move: Move) {
    let clone = this.deepcopy(this.gb.board);

    const currSquare = parser.getSquare(s.file, s.rank, clone);
    const nextSquare = parser.getSquare(move.file, move.rank, clone);
    if (!nextSquare) {
      // TODO: throw wrong square
      return;
    }

    this.gb.moveFromTo(currSquare, nextSquare, new Set());

    // garbage collect
    clone = null;
    return;
  }

  deepcopy(obj) {
    return cloneDeep(obj);
  }
}
