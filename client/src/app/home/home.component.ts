import { Observable, combineLatest } from 'rxjs';
import { MatchFoundSubscription } from './../types';
import { FindUserByIdGQL, MatchFoundGQL, FindGameGQL } from '@app/types';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { collection } from 'rxfire/firestore';
import { map, take } from 'rxjs/operators';
import { SubscriptionResult } from 'apollo-angular';
import {
  AngularFirestoreDocument,
  AngularFirestore,
  QuerySnapshot,
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Game } from '@app/interfaces';
import { Color } from '@app/enums';
import { SubSink } from 'subsink';

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
    private matchFoundGQL: MatchFoundGQL,
    private findGameGQL: FindGameGQL
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  findGame(userId: string) {
    // can only find reference by getting this DocumentReference
    const userDocRef = this.db.doc(`users/${userId}`).ref;

    const gamesWithEmptySpot = this.db
      .collection<Game>('games', ref => ref.where('blackTeam', '==', null))
      .get()
      .pipe(
        map(snapShot => {
          // if no game with spot for second player, create game
          if (snapShot.empty) {
            this.createNewGame(userId);
          } else {
            snapShot.forEach(doc => {
              console.log(doc.data());
            });
          }
        })
      );

    this.subs.sink = gamesWithEmptySpot.subscribe();
    // .onSnapshot(snapshot => {

    // });
  }

  createNewGame(userId: string) {
    this.db.collection('games').add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      whiteTeam: this.db.doc(`/users/${userId}`).ref,
      blackTeam: null,
      gameState: {
        gameStarted: false,
        gameOver: false,
        currentTurn: Color.White,
        checked: {
          white: false,
          black: false
        }
      }
    } as Game);
  }

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
