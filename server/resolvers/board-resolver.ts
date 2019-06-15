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

@Resolver(of => Board)
export class BoardResolver {
  @FieldResolver(returns => Square)
  async whiteKingLocation(@Root() board: Board) {
    return board.squares.find((square: Square) => {
      return (
        square.piece &&
        square.piece.type === PieceType.King &&
        square.piece.color === Color.White
      );
    });
  }
  @FieldResolver(returns => Square)
  async blackKingLocation(@Root() board: Board) {
    return board.squares.find((square: Square) => {
      return (
        square.piece &&
        square.piece.type === PieceType.King &&
        square.piece.color === Color.Black
      );
    });
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
    @Arg('gameId', type => ObjectIdScalar) gameId: ObjectId,
    @Arg('from') from: SquareXYInput,
    @Arg('to') to: SquareXYInput
  ): Promise<boolean> {
    try {
      let session: InstanceType<Session> = await SessionModel.findById(gameId)
        .populate('board')
        .exec();
      let board = session.board as InstanceType<Board>;
      let squares = board.squares as InstanceType<Square[]>;
      let fromSqr = squares.find(
        (sqr: InstanceType<Square>) =>
          `${File[from.file]}${from.rank}` === sqr.get('name')
      );
      let toSqr = squares.find(
        sqr => `${File[to.file]}${to.rank}` === sqr.name
      );
      // start modifying
      if (fromSqr && fromSqr.piece) {
        toSqr.piece = fromSqr.piece;
        fromSqr.piece = null;
      } else {
        throw new Error('Origin Square must have a Piece');
      }
      // console.log(`AFTER\nfrom ${fromSqr}\n`, `to ${toSqr}`);
      // end modifying

      // board.markModified('squares');
      const saveBoard = await board.save();
      // console.log(saveBoard);
      pubSub.publish('BOARD_CHANGED', { data: saveBoard });
      return true;
    } catch (e) {
      return e.message;
    }
  }

  @Subscription({ topics: 'BOARD_CHANGED' })
  boardChanged(
    @Root() payload: { data: Board },
    @Arg('userId', type => ObjectIdScalar) userId: ObjectId
  ): Board {
    return payload.data;
  }
}
