import { Typegoose, prop, arrayProp, Ref, pre } from 'typegoose';

import { User } from './user';
import { Board, BoardModel } from './board';

type Color = 'white' | 'black';
const Colors = {
  WHITE: 'white' as Color,
  BLACK: 'black' as Color
};

class GameState extends Typegoose {
  @prop({ default: false, required: true })
  gameStarted: boolean;

  @prop({ default: false })
  gameOver: boolean;

  @prop({ enum: Object.values(Colors), required: true, default: 'white' })
  currentTurn: Color;

  @prop({ default: { white: false, black: false }, required: true })
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
  createdAt: Date;

  @prop({ default: Date.now })
  lastUpdated?: Date;

  @prop({ ref: User })
  whiteTeam?: Ref<User>;

  @prop({ ref: User })
  blackTeam?: Ref<User>;

  @prop({ default: new GameState() })
  gameState?: GameState;

  @prop({ ref: Board })
  board?: Board;

  @prop()
  get elapsedTime(): Date {
    // TODO: find out the time unit (s or ms)
    return new Date(Date.now().valueOf() - this.createdAt.getTime());
  }
}

export const SessionModel = new Session().getModelForClass(Session);
