import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Gameboard, Square } from '@app/types';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnChanges, OnInit {
  @Input() currTurn: 'white' | 'black';

  _board: Gameboard = null;
  @Input()
  set board(board: Gameboard) {
    this._board = board;
  }

  // view-based
  moving = false;
  selectedSqr: Square;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    // only run when property "data" changed
    if (changes) {
      console.log(changes);
    }
  }
  ngOnInit() {}

  changeTurn() {
    this.currTurn = 'black';
  }
}

enum FILE {
  a = 1,
  b = 2,
  c = 3,
  d = 4,
  e = 5,
  f = 6,
  g = 7,
  h = 8
}
