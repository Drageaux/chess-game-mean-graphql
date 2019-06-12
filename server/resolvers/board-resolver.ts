import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import {
  Resolver,
  Arg,
  Query,
  Mutation,
  Subscription,
  PubSub,
  Publisher,
  PubSubEngine,
  Root
} from 'type-graphql';
import { InstanceType } from 'typegoose';
import { ObjectIdScalar } from '../graphql/object-id-scalar';
import { Session, SessionModel } from '../entities/session';
import { Board, BoardModel } from '../entities/board';
import { Square } from '../entities/square';
import { SquareXYInput } from './inputs/square-xy-input';

@Resolver(of => Board)
export class BoardResolver {
  // @Query()
  // async testGetMoves(): Promise<{
  //   regularMoves: Square[];
  //   eagerMoves: Square[];
  // }> {
  //   return null;
  // }

  @Mutation(returns => Board)
  async movePiece(
    @Arg('gameId', type => ObjectIdScalar) gameId: ObjectId,
    @Arg('from') from: SquareXYInput,
    @Arg('to') to: SquareXYInput
  ): Promise<Board> {
    return await new Board();
  }

  @Subscription({ topics: 'BOARD_CHANGED' })
  boardChanged(
    @Root() payload: Board,
    @Arg('userId', type => ObjectIdScalar) userId: ObjectId
  ): Board {
    return new Board();
  }
}
