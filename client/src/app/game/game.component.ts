import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import {
  Session,
  Square,
  PlayGameGQL,
  PlayGameQuery,
  GetBoardGQL,
  GetBoardQuery,
  GetBoardQueryVariables,
  MovePieceGQL,
  BoardChangedGQL,
  Gameboard
} from '@app/types';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { ApolloQueryResult } from 'apollo-client';
import { from } from 'zen-observable';
import { QueryRef } from 'apollo-angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewChecked, OnDestroy {
  private subs = new SubSink();

  // playGameQuery: QueryRef<PlayGameQuery, PlayGameQueryVariables>;

  gameSession: Session;

  constructor(
    private route: ActivatedRoute,
    private playGameGQL: PlayGameGQL
  ) {}

  ngOnInit() {
    this.subs.sink = this.playGameGQL
      .fetch({
        userId: '5cdda44272985718046cba86',
        gameId: this.route.snapshot.params.gameId
      })
      .pipe(map(({ data }) => data.playGame))
      .subscribe(result => {
        this.gameSession = result;
      });
  }

  ngAfterViewChecked(): void {
    // this.gameSession.subscribe(session => console.log(session));
  }

  subscribeToUpdatedBoard() {
    // TODO: update board
    // this.g.subscribeToMore(this.boardChangedGQL);
  }

  move() {
    // console.log(this.gameSession.gameboard.squares);
    // this.subs.sink = this.gameSession
    //   .pipe(
    //     map((result: Session) => {
    //       console.log(result);
    //       const squares = result.gameboard.squares;
    //       if (!squares || squares.length === 0) {
    //         return throwError('Board has no squares');
    //       }
    //       const fromSqr: Square = result.gameboard.squares.find(
    //         x => x.name === 'e2'
    //       );
    //       const toSqr: Square = result.gameboard.squares.find(
    //         x => x.name === 'e4'
    //       );
    //       return this.movePieceGQL.mutate({
    //         gameId: result.id,
    //         from: { file: fromSqr.file, rank: fromSqr.rank },
    //         to: { file: toSqr.file, rank: toSqr.rank }
    //       });
    //     }),
    //     retry(2),
    //     catchError((err, caught) => {
    //       return caught;
    //     })
    //   )
    //   .subscribe(result => console.log(result), err => console.error(err));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
