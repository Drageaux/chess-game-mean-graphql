import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { of, from, Observable, throwError } from 'rxjs';
import { switchMap, map, take, filter, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { doc } from 'rxfire/firestore';
import {
  AngularFirestore,
  DocumentReference,
  Query
} from '@angular/fire/firestore';
import { File, Color, PieceType } from '@shared/enums';
import { Game, Square, Piece, Board } from '@shared/interfaces';
import { QueryDocumentSnapshot } from '@firebase/firestore-types';
import { list, QueryChange, object } from 'rxfire/database';
import { Router } from '@angular/router';

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

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private db: AngularFireDatabase
  ) {
    const newBoard: Board = { squares: this.initBoard() };
    this.DEFAULT_BOARD = newBoard;
  }

  playGame(userId: string) {
    // can only find reference by getting this DocumentReference
    const userDocRef = this.afs.doc(`users/${userId}`).ref;
    // RTDB can only filter by 1 field
    const gamesRef = this.db.database.ref('games');
    const gameList: Observable<QueryChange[]> = list(
      gamesRef.orderByChild('blackTeam').equalTo(null)
    );
    const foundGame = gameList.pipe(
      take(1),
      map(
        games =>
          // filter unstarted games and pick 1
          games.filter(x => {
            const g = x.snapshot.val() as Game;
            return !g.gameState.started && userId !== g.whiteTeam;
          })[0]
      )
    );

    return foundGame
      .pipe(
        // decides what action to take
        map(game => {
          // create new game instead if no match
          if (!game) {
            return { game, status: FindGameStatus.create };
          } else {
            const val: Game = game.snapshot.val();
            console.log(val);
            // get game where someone is white team but not this user
            if (`/users/${userId}` !== val.whiteTeam) {
              return { game, status: FindGameStatus.join };
            }
          }
        }),
        // switchMap also subscribes to inner Observable
        switchMap(
          (val: {
            game: QueryChange;
            status: FindGameStatus;
          }): Observable<string> => {
            switch (val.status) {
              case FindGameStatus.wait:
                throwError('Already joined game queue. Waiting for match...');
                break;

              case FindGameStatus.create:
                console.log('Joining game queue...');
                // create new game
                return this.createNewGame(gamesRef, userId).pipe(
                  map(this.waitForGameReady(game))
                );

              case FindGameStatus.join:
                console.log('Found game. Initializing...');
                // create new board
                const boards = this.db.list<Board>('boards');
                const newBoardObj = JSON.parse(
                  JSON.stringify({ ...this.DEFAULT_BOARD })
                );
                const newBoardId = boards.push(newBoardObj).key; // NOTE: async/detached from this flow, to speed up the process

                // add this user as final player
                return from(
                  this.db
                    .object<Game>(`/games/${val.game.snapshot.key}`)
                    .update({
                      blackTeam: userId,
                      gameState: { started: true },
                      board: newBoardId
                    } as Game)
                ).pipe(map(() => val.game.snapshot.key));

              default:
                throwError('Invalid find game action');
                break;
            }
          }
        )
      )
      .subscribe((gameId: string) => {
        this.router.navigate(['/gameboard', gameId]);
      });
  }

  private createNewGame(gamesRef: firebase.database.Reference, userId: string) {
    // TODO: add more players/viewers
    // TODO: # of players in queue, etc.
    // adding a plain JS object so it's not getting error
    const newGameObj = JSON.parse(
      JSON.stringify({
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        whiteTeam: userId,
        blackTeam: null,
        gameState: {
          started: false,
          over: false,
          currTurn: Color.White,
          checked: {
            white: false,
            black: false
          }
        },
        board: null
      } as Game)
    );
    // games.push(newGameObj).then(() => {}, console.error);
    return from(gamesRef.push(newGameObj).key);
  }

  private waitForGameReady() {
    return '';
  }

  private initBoard(): Square[] {
    let newBoard: Square[] = [];
    for (let x = 1; x <= BOARD_SIZE; x++) {
      for (let y = 1; y <= BOARD_SIZE; y++) {
        const newSquare = {} as Square;
        newSquare.file = x as File;
        newSquare.rank = y;

        const newPiece = {} as Piece;

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
