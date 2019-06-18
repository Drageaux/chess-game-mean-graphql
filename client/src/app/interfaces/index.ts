import { Color } from '@app/enums';

export interface Game {
  gameStarted: boolean;
  gameOver: boolean;
  currentTurn: Color;
  checked: Map<Color, boolean>;
}
