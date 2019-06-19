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
    const gamesQuery = this.db.collection<Game>('games', ref =>
      ref
        .where('blackTeam', '==', null)
        .where('gameState.gameStarted', '==', false)
    );

    const joinOrCreateGame = gamesQuery.get().pipe(
      // switchMap also subscribes to inner Observable
      switchMap(snapShot => {
        console.log('snapshot =>', snapShot);
        // create new game instead if no match
        if (snapShot.empty) {
          console.log('Joining game queue...');
          return this.createNewGame(userId); // returns new game obs
        } else {
          for (const d of snapShot.docs) {
            const game = d.data() as Game;
            // get game where someone is white team but not this user
            if (userId === game.whiteTeam.id) {
              console.log('Already joined game queue. Waiting for match...');
              return of(null);
            } else {
              // add this user as final player
              return from(
                d.ref.update({
                  blackTeam: userDocRef,
                  'gameState.gameStarted': true
                } as Partial<Game>)
              ).pipe(map(() => d.ref)); // returns updated game obs
            }
          }
        }
      }),
      // format the doc into human readable interface
      switchMap((gameRef: DocumentReference) => {
        if (gameRef) {
          // receive gameId
          return doc(gameRef).pipe(
            map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as Game))
          );
        } else {
          return null;
        }
      })
    );

    this.subs.sink = joinOrCreateGame
      // navigate to game page
      .subscribe((foundGame: Game) => {
        console.log(foundGame);

        if (
          foundGame.id &&
          foundGame.whiteTeam &&
          foundGame.blackTeam &&
          foundGame.gameState.gameStarted
        ) {
          this.router.navigate(['/gameboard', foundGame.id]);
        }
      });
  }

  createNewGame(userId: string): Observable<DocumentReference> {
    // TODO: add more players/viewers
    // TODO: # of players in queue, etc.
    return from(
      this.db.collection<Game>('games').add({
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
      } as Game)
    );
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
