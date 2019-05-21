import {} from './../types';
import { Component, OnInit } from '@angular/core';
import { Session, PlayGameGQL, PlayGameQuery } from '@app/types';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApolloQueryResult } from 'apollo-client';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  gameSession: Observable<Session>;

  constructor(
    private route: ActivatedRoute,
    private playGameGQL: PlayGameGQL
  ) {}

  ngOnInit() {
    this.gameSession = this.playGameGQL
      .fetch({
        userId: '5cdda44272985718046cba86',
        gameId: this.route.snapshot.params.gameId
      })
      .pipe(
        map((result: ApolloQueryResult<PlayGameQuery>) => {
          console.log(result.data.playGame);
          return result.data.playGame;
        })
      );
    // .subscribe(() => {
    //   this.gameSession;
    // });
  }
}
