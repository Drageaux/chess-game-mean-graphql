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
  Root,
  FieldResolver
} from 'type-graphql';
import { InstanceType } from 'typegoose';
import { ObjectIdScalar } from '../graphql/object-id-scalar';
import { Session, SessionModel } from '../entities/session';
import { Board, BoardModel } from '../entities/board';
import { Square } from '../entities/square';
import { SquareXYInput } from './inputs/square-xy-input';
import { File, PieceType, Color } from '../entities/enums';
import { GraphQLError } from 'graphql';

@Resolver(of => Board)
export class BoardResolver {
  @FieldResolver(returns => Square, { nullable: true })
  async whiteKingLocation(@Root() board: Board) {
    return board._whiteKingLocation;
  }

  @FieldResolver(returns => Square, { nullable: true })
  async blackKingLocation(@Root() board: Board) {
    return board._blackKingLocation;
  }

  @Query(returns => Board)
  async getBoard(
    @Arg('boardId', type => ObjectIdScalar) boardId: ObjectId
  ): Promise<Board> {
    return await BoardModel.findById(boardId).exec();
  }
  // @Query()
  // async testGetMoves(): Promise<{
  //   regularMoves: Square[];
  //   eagerMoves: Square[];
  // }> {
  //   return null;
  // }

  @Mutation(returns => Boolean)
  async movePiece(
    @PubSub() pubSub: PubSubEngine,
    @Arg('boardId', type => ObjectIdScalar) boardId: ObjectId,
    @Arg('from') from: SquareXYInput,
    @Arg('to') to: SquareXYInput
  ): Promise<boolean> {
    let board: any = await BoardModel.findById(boardId).exec();
    board = board.toObject();

    let squares = board.squares as Square[];
    let fromSqr = squares.find(
      (sqr: InstanceType<Square>) =>
        `${File[from.file]}${from.rank}` === sqr.name
    );
    let toSqr = squares.find(sqr => `${File[to.file]}${to.rank}` === sqr.name);
    // start modifying
    if (fromSqr && fromSqr.piece) {
      toSqr.piece = fromSqr.piece;
      fromSqr.piece = null;
    } else {
      console.trace('fromSqr needs a valid Piece');
      throw new GraphQLError('Origin Square must have a Piece');
    }
    // console.log(`AFTER\nfrom ${fromSqr}\n`, `to ${toSqr}`);
    // end modifying

    // board.markModified('squares');
    const saveBoard = await board.save();
    // console.log(saveBoard);
    pubSub.publish('BOARD_CHANGED', { data: saveBoard });
    return true;
  }

  @Subscription({ topics: 'BOARD_CHANGED' })
  boardChanged(
    @Root() payload: { data: Board },
    @Arg('userId', type => ObjectIdScalar) userId: ObjectId
  ): Board {
    return payload.data;
  }
}
