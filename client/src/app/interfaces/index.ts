import { Color } from '@app/enums';
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
  createdAt: Timestamp;
  whiteTeam?: DocumentReference;
  blackTeam?: User;
  gameState: GameState;
  board?: any[];
}
