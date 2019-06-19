import { Observable } from 'rxjs';
import { MatchFoundSubscription } from './../types';
import { FindUserByIdGQL, MatchFoundGQL, FindGameGQL } from '@app/types';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionResult } from 'apollo-angular';
import {
  AngularFirestoreDocument,
  AngularFirestore,
  QuerySnapshot,
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import { Game } from '@app/interfaces';
import { map, take } from 'rxjs/operators';
import { Color } from '@app/enums';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private gameDoc: AngularFirestoreDocument<Game>;
  game: Observable<Game>;

  constructor(
    private router: Router,
    private db: AngularFirestore,
    private matchFoundGQL: MatchFoundGQL,
    private findGameGQL: FindGameGQL
  ) {}

  ngOnInit() {}

  findGame(userId: string) {
    const userDocRef = this.db.doc(`users/${userId}`).ref;

    const findGame = this.db
      .collection<Game>('games', ref => {
        return ref.where('whiteTeam', '==', userDocRef);
        // .where('whiteTeam', '<', userId); // TODO: chain with null blackTeam query
        // .where('gameState.gameStarted', '==', false);
      })
      .get()
      .pipe(
        take(1),
        map(querySnapShot => {
          console.log(querySnapShot);
          // new game if this user isn't white team
          if (querySnapShot.empty) {
            this.createNewGame(userId);
          } else {
            console.log('already finding game');
          }
        })
      )
      .subscribe();
  }

  createNewGame(userId: string) {
    this.db.collection('games').add({
      whiteTeam: this.db.doc(`/users/${userId}`).ref,
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
