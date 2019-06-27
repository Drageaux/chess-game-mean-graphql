import { Observable, combineLatest, from, of } from 'rxjs';
import { MatchFoundSubscription } from './../types';
import { FindUserByIdGQL, MatchFoundGQL, FindGameGQL } from '@app/types';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { collection, doc } from 'rxfire/firestore';
import { map, take, switchMap } from 'rxjs/operators';
import { SubscriptionResult } from 'apollo-angular';
import {
  AngularFirestoreDocument,
  AngularFirestore,
  QuerySnapshot,
  QueryDocumentSnapshot,
  DocumentReference
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Game, Board } from '@shared/interfaces';
import { Color } from '@shared/enums';
import { SubSink } from 'subsink';
import { GameService } from '@app/services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private gameDoc: AngularFirestoreDocument<Game>;
  game: Observable<Game>;

  constructor(
    private router: Router,
    private db: AngularFirestore,
    private gameService: GameService,
    private matchFoundGQL: MatchFoundGQL,
    private findGameGQL: FindGameGQL
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  findGame(userId: string) {
    this.gameService.playGame(userId);
  }

  // deprecated
  queue(userId: string) {
    const matchFound = this.matchFoundGQL
      .subscribe({ userId }) // when variables match args, return values
      .subscribe((result: SubscriptionResult<MatchFoundSubscription>) => {
        console.log(result);
        matchFound.unsubscribe();
        this.router.navigate(['/game', result.data.matchFound._id]);
      });

    // just getting the state of the queue,
    // so it's slightly insignificant to track its results
    this.findGameGQL
      .mutate({
        userId
      })
      .subscribe(res => console.log(res));
  }
}
