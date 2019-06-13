import { Component, OnInit, OnDestroy } from '@angular/core';
import { Session, PlayGameGQL } from '@app/types';
import { Router, ActivatedRoute } from '@angular/router';
import { map, retry, catchError } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  gameSession: Session;

  constructor(
    private route: ActivatedRoute,
    private playGameGQL: PlayGameGQL
  ) {}

  ngOnInit() {
    this.subs.sink = this.playGameGQL
      .fetch({
        gameId: this.route.snapshot.params.gameId
      })
      .pipe(map(({ data }) => data.playGame))
      .subscribe(result => {
        this.gameSession = result;
      });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
