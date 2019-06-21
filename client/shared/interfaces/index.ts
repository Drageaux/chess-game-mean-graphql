import { Color, File, PieceType } from '../enums';
import { DocumentReference } from '@angular/fire/firestore';
import { Timestamp } from '@firebase/firestore-types';

export interface User {
  userName?: string;
  email?: string; // validate: /\S+@\S+\.\S+/
}

export interface GameState {
  gameStarted: boolean;
  gameOver: boolean;
  currentTurn: Color;
  checked: {
    black: boolean;
    white: boolean;
  };
}

export interface Game {
  readonly id: string;
  createdAt: Timestamp;
  whiteTeam?: DocumentReference;
  blackTeam?: DocumentReference;
  gameState: GameState;
  board?: DocumentReference | string;
}

export interface Piece {
  type: PieceType;
  color: Color;
  captured?: boolean;
}

export interface Square {
  file: File;
  rank: number;
  piece?: Piece;
}

export interface Board {
  readonly id?: string;
  squares: Square[];

  // get whiteKingLocation() {
  //   return this.squares.find((square: Square) => {
  //     return (
  //       square.piece &&
  //       square.piece.type === PieceType.King &&
  //       square.piece.color === Color.White
  //     );
  //   });
  // }

  // get blackKingLocation() {
  //   return this.squares.find((square: Square) => {
  //     return (
  //       square.piece &&
  //       square.piece.type === PieceType.King &&
  //       square.piece.color === Color.Black
  //     );
  //   });
  // }
}
