import { Injectable } from '@angular/core';
import { of, from, Observable, throwError } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { doc } from 'rxfire/firestore';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { File, Color, PieceType } from '@app/enums';
import { Game, Square, Piece, Board } from '@app/interfaces';
import { QueryDocumentSnapshot } from '@firebase/firestore-types';

enum FindGameStatus {
  create,
  join,
  wait
}

const BOARD_SIZE = 8;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private DEFAULT_BOARD: Board;

  constructor(private db: AngularFirestore) {
    const newBoard = new Board();
    newBoard.squares = this.initBoard();
    this.DEFAULT_BOARD = newBoard;
  }

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
            // create new board
            const newId = this.db.createId();
            const newBoardObj = JSON.parse(
              JSON.stringify({ ...this.DEFAULT_BOARD })
            );
            const newBoardRef = this.db.collection<Board>('boards').doc(newId) // saves the new ID here, no need to set as field
              .ref;
            newBoardRef.set(newBoardObj); // NOTE: async/detached from this flow, to speed up the process

            // add this user as final player
            return from(
              foundGame.ref.update({
                blackTeam: userDocRef,
                'gameState.gameStarted': true,
                board: newBoardRef
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
    // adding a plain JS object so it's not getting error
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

  private initBoard(): Square[] {
    let newBoard: Square[] = [];
    for (let x = 1; x <= BOARD_SIZE; x++) {
      for (let y = 1; y <= BOARD_SIZE; y++) {
        const newSquare: Square = new Square();
        newSquare.file = x as File;
        newSquare.rank = y;

        const newPiece: Piece = new Piece();

        // set color
        switch (y) {
          case 1:
            switch (x) {
              case File.a:
              case File.h:
                newPiece.type = PieceType.Rook;
                break;
              case File.b:
              case File.g:
                newPiece.type = PieceType.Knight;
                break;
              case File.c:
              case File.f:
                newPiece.type = PieceType.Bishop;
                break;
              case File.d:
                newPiece.type = PieceType.Queen;
                break;
              case File.e:
                newPiece.type = PieceType.King;
            }
            newPiece.color = Color.White;
            newSquare.piece = newPiece;
            break;
          case 2:
            newPiece.type = PieceType.Pawn;
            newPiece.color = Color.White;
            newSquare.piece = newPiece;
            break;
          case 7:
            newPiece.type = PieceType.Pawn;
            newPiece.color = Color.Black;
            newSquare.piece = newPiece;
            break;
          case 8:
            switch (x) {
              case File.a:
              case File.h:
                newPiece.type = PieceType.Rook;
                break;
              case File.b:
              case File.g:
                newPiece.type = PieceType.Knight;
                break;
              case File.c:
              case File.f:
                newPiece.type = PieceType.Bishop;
                break;
              case File.d:
                newPiece.type = PieceType.Queen;
                break;
              case File.e:
                newPiece.type = PieceType.King;
            }
            newPiece.color = Color.Black;
            newSquare.piece = newPiece;
            break;
          default:
            break;
        }

        newBoard.push(newSquare);
      }
    }

    // sort descending in rank and ascending in file
    // returned order shouldn't be further modified
    newBoard = newBoard.sort((a, b) => {
      if (a.rank - b.rank === 0) {
        if (a.file > b.file) {
          return 1;
        } else if (a.file < b.file) {
          return -1;
        } else {
          return 0;
        }
      } else {
        return b.rank - a.rank;
      }
    });

    return newBoard;
  }
}
