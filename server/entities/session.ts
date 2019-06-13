import { prop, Typegoose, Ref, arrayProp, pre } from 'typegoose';
import {
  ObjectType,
  Field,
  InterfaceType,
  ID,
  registerEnumType,
  Int
} from 'type-graphql';
import { User } from './user';
import { Board } from './board';
import { Color } from './enums/color';

@ObjectType()
class CheckedMap extends Map {
  @Field()
  white: boolean;

  @Field()
  black: boolean;
}

@ObjectType()
export class GameState extends Typegoose {
  @Field()
  @prop({ default: false })
  gameStarted: boolean;

  @Field()
  @prop({ default: false })
  gameOver: boolean;

  @Field(type => Color)
  @prop({ enum: Color, default: Color.White })
  currentTurn: Color;

  @Field(type => CheckedMap)
  @prop({
    default: new Map<Color, boolean>([
      [Color.White, false],
      [Color.Black, false]
    ])
  })
  checked: Map<Color, boolean>;
}

@ObjectType()
@pre<Session>('remove', function(next) {
  // BoardModel.findByIdAndRemove(this.board);
  next();
})
export class Session extends Typegoose {
  @Field(type => ID)
  readonly _id: string;

  @Field(type => [User], { nullable: true })
  @arrayProp({ itemsRef: User })
  players?: Ref<User>[];

  @Field()
  @prop({ default: Date.now })
  readonly createdAt: Date;

  @Field({ nullable: true })
  @prop({ default: Date.now })
  lastUpdated?: Date;

  @Field(type => User, { nullable: true })
  @prop({ ref: User })
  whiteTeam?: Ref<User>;

  @Field(type => User, { nullable: true })
  @prop({ ref: User })
  blackTeam?: Ref<User>;

  @Field(type => GameState, { nullable: true })
  @prop({ default: new GameState() })
  gameState?: GameState;

  @Field(type => Board, { nullable: true })
  @prop({ ref: Board })
  board?: Ref<Board>;

  @Field(type => Int, { nullable: true })
  @prop()
  get elapsedTime(): number {
    // should be in millseconds
    return Date.now() - this.createdAt.getTime();
  }
}

export const SessionModel = new Session().getModelForClass(Session);
