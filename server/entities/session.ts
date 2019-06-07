import { prop, Typegoose, Ref, arrayProp, pre } from 'typegoose';
import {
  ObjectType,
  Field,
  InterfaceType,
  ID,
  registerEnumType
} from 'type-graphql';
import { User } from './user';

enum Color {
  White = 'white',
  Black = 'black'
}
registerEnumType(Color, {
  name: 'Color',
  description: 'The basic team colors'
});

@ObjectType()
export class GameState extends Typegoose {
  @Field()
  @prop({ default: false, required: true })
  gameStarted: boolean;

  @Field()
  @prop({ default: false, required: true })
  gameOver: boolean;

  @Field(type => Color)
  @prop({ enum: Color, required: true, default: Color.White })
  currentTurn: Color;

  @Field()
  @prop({
    default: new Map<Color, boolean>([
      [Color.White, false],
      [Color.Black, false]
    ]),
    required: true
  })
  checked: Map<Color, boolean>;

  // TODO: @Field()
  // @prop({ ref: Board })
  // board: Ref<Board>;
}

@pre<Session>('remove', function(next) {
  // BoardModel.findByIdAndRemove(this.board);
  next();
})
@ObjectType()
export class Session extends Typegoose {
  @Field(type => ID)
  readonly id: string;

  @Field(type => [User], { nullable: true })
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
  get elapsedTime(): number {
    // should be in millseconds
    return Date.now() - this.createdAt.getTime();
  }
}
