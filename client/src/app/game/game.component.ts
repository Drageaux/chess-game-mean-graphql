import {} from './../types';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  gameSession: Observable<Session>;

  constructor(
    private route: ActivatedRoute,
    private playGameGQL: PlayGameGQL,
    private movePieceGQL: MovePieceGQL,
    private boardChangedGQL: BoardChangedGQL
  ) {}

  ngOnInit() {
    this.playGameQuery = this.playGameGQL.watch({
      userId: '5cdda44272985718046cba86',
      gameId: this.route.snapshot.params.gameId
    });

    this.gameSession = this.playGameQuery.valueChanges.pipe(
      map(result => result.data.playGame)
    );
  }

  subscribeToUpdatedBoard() {
    // TODO: update board
    this.playGameQuery.subscribeToMore(this.boardChangedGQL);
  }

  move() {
    // console.log(this.gameSession.gameboard.squares);
    this.subs.sink = this.gameSession
      .pipe(
        map((result: Session) => {
          const fromSqr: Square = result.gameboard.squares.find(
            x => x.name === 'e2'
          );
          const toSqr: Square = result.gameboard.squares.find(
            x => x.name === 'e4'
          );

          return this.movePieceGQL.mutate({
            gameId: result.id,
            from: { file: fromSqr.file, rank: fromSqr.rank },
            to: { file: toSqr.file, rank: toSqr.rank }
          });
        })
      )
      .subscribe(result => console.log(result));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
