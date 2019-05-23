import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  Gameboard,
  Square,
  GetBoardGQL,
  GetBoardQuery,
  GetBoardQueryVariables
} from '@app/types';
import { BehaviorSubject } from 'rxjs';
import { QueryRef } from 'apollo-angular';
import { SubSink } from 'subsink';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnChanges, OnInit {
  private subs = new SubSink();

  @Input() gameId: string;
  @Input() currTurn: 'white' | 'black';
  getBoardQuery: QueryRef<GetBoardQuery, GetBoardQueryVariables>;
  board: Gameboard;

  // view-based
  moving = false;
  selectedSqr: Square;

  constructor(private getBoardGQL: GetBoardGQL) {}

  ngOnChanges(changes: SimpleChanges): void {
    // only run when property "data" changed
    if (changes.board) {
      console.log(changes);
    }
  }
  ngOnInit() {
    this.getBoardQuery = this.getBoardGQL.watch({
      userId: '5cdda44272985718046cba86',
      gameId: this.gameId
    });
    this.subs.sink = this.getBoardQuery.valueChanges
      .pipe(map(({ data }) => data.playGame))
      .subscribe(result => {
        this.board = result.gameboard;
      });
  }

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
