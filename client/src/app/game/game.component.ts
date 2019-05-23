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
  gameSession: Session;

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

    this.subs.sink = this.playGameQuery.valueChanges
      .pipe(map(result => result.data.playGame))
      .subscribe(result => {
        this.gameSession = result;
        console.log(result);
      });
  }

  subscribeToUpdatedBoard() {
    // TODO: update board
    this.playGameQuery.subscribeToMore(this.boardChangedGQL);
  }

  move() {
    console.log(this.gameSession.gameboard.squares);
    const fromSqr: Square = this.gameSession.gameboard.squares.find(
      x => x.name === 'e2'
    );
    const toSqr: Square = this.gameSession.gameboard.squares.find(
      x => x.name === 'e4'
    );

    this.subs.sink = this.movePieceGQL
      .mutate({
        gameId: this.gameSession.id,
        from: { file: fromSqr.file, rank: fromSqr.rank },
        to: { file: toSqr.file, rank: toSqr.rank }
      })
      .subscribe();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
