import {} from './../types';
import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  DoCheck
} from '@angular/core';
import {
  Session,
  Square,
  PlayGameGQL,
  PlayGameQuery,
  MovePieceGQL,
  SquareXyInput,
  PlayGameQueryVariables,
  BoardChangedDocument,
  BoardChangedGQL
} from '@app/types';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { ApolloQueryResult } from 'apollo-client';
import { from } from 'zen-observable';
import { QueryRef } from 'apollo-angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  playGameQuery: QueryRef<PlayGameQuery, PlayGameQueryVariables>;
  gameSession: Session;

  constructor(
    private route: ActivatedRoute,
    private playGameGQL: PlayGameGQL,
    private movePieceGQL: MovePieceGQL,
    private boardChangedGQL: BoardChangedGQL
  ) {
    // this.playGameQuery = this.playGameGQL.watch(
    //   {
    //     userId: '5cdda44272985718046cba86',
    //     gameId: this.route.snapshot.params.gameId
    //   },
    //   {
    //     fetchPolicy: 'network-only'
    //   }
    // );
  }

  ngOnInit() {
    this.subs.sink = this.playGameGQL
      .fetch({
        userId: '5cdda44272985718046cba86',
        gameId: this.route.snapshot.params.gameId
      })
      .pipe(map(({ data }) => data.playGame))
      .subscribe(result => (this.gameSession = result));
  }

  subscribeToUpdatedBoard() {
    // TODO: update board
    this.playGameQuery.subscribeToMore(this.boardChangedGQL);
  }

  move() {
    const squares = this.gameSession.gameboard.squares;
    if (!squares || squares.length === 0) {
      // .pipe(map(({ data }) => data.playGame))
      // .subscribe(result => console.log(result));
    }
    console.log(squares);
    // map((result: Session) => {
    //   const squares = result.gameboard.squares;
    //   if (!squares || squares.length === 0) {
    //     return throwError('Board has no squares');
    //   }
    //   console.log(result);
    //   const fromSqr: Square = result.gameboard.squares.find(
    //     x => x.name === 'e2'
    //   );
    //   const toSqr: Square = result.gameboard.squares.find(
    //     x => x.name === 'e4'
    //   );
    //   return this.movePieceGQL.mutate({
    //     gameId: result.id,
    //     from: { file: fromSqr.file, rank: fromSqr.rank },
    //     to: { file: toSqr.file, rank: toSqr.rank }
    //   });
    // })
    // catchError((err: any, caught: any) => {
    //   console.error(err);
    //   return caught;
    // }),
    // retry(2)
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
