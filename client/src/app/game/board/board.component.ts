import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import {
  Board,
  Square,
  GetBoardGQL,
  GetBoardQuery,
  GetBoardQueryVariables,
  MovePieceGQL,
  BoardChangedGQL,
  GetMovesGQL
} from '@app/types';
import { throwError } from 'rxjs';
import { QueryRef } from 'apollo-angular';
import { SubSink } from 'subsink';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnChanges, OnInit, OnDestroy {
  private subs = new SubSink();

  @Input() gameId: string;
  @Input() currTurn: 'white' | 'black';
  getBoardQuery: QueryRef<GetBoardQuery, GetBoardQueryVariables>;
  board: Board;

  // view-based
  moving = false;
  selectedSqr: Square;

  constructor(
    private getBoardGQL: GetBoardGQL,
    private movePieceGQL: MovePieceGQL,
    private boardChangedGQL: BoardChangedGQL,
    private testGetMoves: GetMovesGQL
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // only run when property "data" changed
    if (changes.board) {
      console.log(changes);
    }
  }

  ngOnInit() {
    this.subs.sink = this.getBoardGQL
      .fetch({
        userId: '5cdda44272985718046cba86',
        gameId: this.gameId
      })
      .pipe(map(({ data }) => data.playGame))
      .subscribe(result => {
        console.log(result);
        this.board = result.board;
      });

    // this.subs.sink = this.getBoardQuery.valueChanges
    //   .pipe(map(({ data }) => data.playGame))
    //   .subscribe(result => {
    //     console.log(result);
    //     this.board = result.gameboard;
    //   });

    this.subscribeToUpdatedBoard();
  }

  subscribeToUpdatedBoard() {
    // TODO: update board
    this.subs.sink = this.boardChangedGQL
      .subscribe({
        userId: '5cdda44272985718046cba86'
      })
      .subscribe(({ data }) => {
        // updating here was about 100ms faster than on mutate return
        this.board = data.boardChanged;
        console.timeEnd('move');
      });
  }

  move() {
    const squares = this.board.squares;
    console.time('move');
    if (!squares || squares.length === 0) {
      return throwError('Board has no squares');
    }
    const fromSqr: Square = squares.find(x => `${x.file}${x.rank}` === 'e2');
    const toSqr: Square = squares.find(x => `${x.file}${x.rank}` === 'e4');
    if (fromSqr && toSqr) {
      this.subs.sink = this.movePieceGQL
        .mutate({
          gameId: this.gameId,
          from: { file: fromSqr.file, rank: fromSqr.rank },
          to: { file: toSqr.file, rank: toSqr.rank }
        })
        .subscribe(); // no need to change anything, already subscribed
    }
  }

  testGetMove() {
    console.time('test get moves');
    for (let i = 0; i < 100; i++) {
      this.subs.sink = this.testGetMoves
        .fetch({ id: i }, { fetchPolicy: 'network-only' })
        .subscribe(() => {});
    }

    console.timeEnd('test get moves');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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
