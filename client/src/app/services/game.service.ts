import { Injectable } from '@angular/core';
import { of, from, Observable, throwError } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { doc } from 'rxfire/firestore';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Color } from '@app/enums';
import { Game, Square } from '@app/interfaces';
import { QueryDocumentSnapshot } from '@firebase/firestore-types';

enum FindGameStatus {
  create,
  join,
  wait
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private db: AngularFirestore) {}

  playGame(userId: string): Observable<Game> {
    // can only find reference by getting this DocumentReference
    const userDocRef = this.db.doc(`users/${userId}`).ref;
    const gameCollection = this.db.collection<Game>('games', ref =>
      ref
        .where('blackTeam', '==', null)
        .where('gameState.gameStarted', '==', false)
    );
    let foundGame: QueryDocumentSnapshot;

    return gameCollection.get().pipe(
      // decides what action to take
      map(snapShot => {
        console.log('snapshot =>', snapShot);
        // create new game instead if no match
        if (snapShot.empty) {
          return FindGameStatus.create;
        } else {
          for (const d of snapShot.docs) {
            const game = d.data() as Game;
            // get game where someone is white team but not this user
            if (userId === game.whiteTeam.id) {
              return FindGameStatus.wait;
            } else {
              foundGame = d;
              return FindGameStatus.join;
            }
          }
          return null;
        }
      }),
      // switchMap also subscribes to inner Observable
      switchMap((status: FindGameStatus) => {
        switch (status) {
          case FindGameStatus.wait:
            return throwError(
              'Already joined game queue. Waiting for match...'
            );
          case FindGameStatus.create:
            console.log('Joining game queue...');
            // create new game and watch for change
            return this.createNewGame(userId).pipe(
              switchMap(docRef => doc(docRef)), // rxfire's doc() listen for changes
              map(snapshot => snapshot.ref) // return new game's ref
            );
          case FindGameStatus.join:
            console.log('Found game. Initializing...');
            // add this user as final player
            return from(
              foundGame.ref.update({
                blackTeam: userDocRef,
                'gameState.gameStarted': true
              } as Partial<Game>)
            ).pipe(map(() => foundGame.ref)); // returns updated game's ref
          default:
            return throwError('Invalid find game action');
        }
      }),
      // format the doc into human readable interface
      switchMap((gameRef: DocumentReference) =>
        from(gameRef.get()).pipe(
          map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as Game))
        )
      )
    );
  }

  private createNewGame(userId: string): Observable<DocumentReference> {
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
        },
        board: null
      } as Game)
    );
  }

  private createInitialBoard(): Square[] {
    return [];
  }
}
