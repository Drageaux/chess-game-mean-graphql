import { Typegoose, prop, arrayProp, Ref, pre } from 'typegoose';

import { User } from './user';
import { Board, BoardModel } from './board';

type Color = 'white' | 'black';
const Colors = {
  WHITE: 'white' as Color,
  BLACK: 'black' as Color
};

class GameState extends Typegoose {
  @prop({ default: false })
  gameStarted: boolean;

  @prop({ default: false })
  gameOver: boolean;

  @prop({ enum: Object.values(Colors), required: true, default: 'white' })
  currentTurn: Color;

  @prop({ default: { white: false, black: false } })
  checked: Map<Color, boolean>;

  @prop({ ref: Board })
  board: Ref<Board>;
}

@pre<Session>('remove', function(next) {
  BoardModel.findByIdAndRemove(this.board);
  next();
})
export class Session extends Typegoose {
  @arrayProp({ itemsRef: User })
  players?: Ref<User>[];

  @prop({ default: Date.now, required: true })
  createdAt: string | number;

  @prop({ default: Date.now })
  lastUpdated?: string | number;

  @prop({ ref: User })
  whiteTeam?: Ref<User>;

  @prop({ ref: User })
  blackTeam?: Ref<User>;

  @prop()
  gameState?: GameState;

  @prop({ ref: Board })
  board?: Board;

  @prop()
  get elapsedTime(): string | number {
    // TODO: find out the time unit (s or ms)
    return Date.now() - Date.parse(this.createdAt.toString());
  }
}

export const SessionModel = new Session().getModelForClass(Session);
