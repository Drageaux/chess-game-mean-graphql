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
  @prop({ default: false })
  gameStarted: boolean;

  @Field()
  @prop({ default: false })
  gameOver: boolean;

  @Field(type => Color)
  @prop({ enum: Color, default: Color.White })
  currentTurn: Color;

  @Field()
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
  readonly id: string;

  @Field(type => [User], { nullable: true })
  @arrayProp({ itemsRef: User })
  players?: Ref<User>[];

  @Field()
  @prop({ default: Date.now })
  readonly createdAt: Date;

  @Field()
  @prop({ default: Date.now })
  lastUpdated: Date;

  @Field(type => User, { nullable: true })
  @prop({ ref: User })
  whiteTeam?: Ref<User>;

  @Field(type => User, { nullable: true })
  @prop({ ref: User })
  blackTeam?: Ref<User>;

  @Field(type => GameState, { nullable: true })
  @prop({ default: new GameState() })
  gameState?: GameState;

  // @prop({ ref: Board })
  // board?: Board;

  @Field(type => Int, { nullable: true })
  @prop()
  get elapsedTime(): number {
    // should be in millseconds
    return Date.now() - this.createdAt.getTime();
  }
}
