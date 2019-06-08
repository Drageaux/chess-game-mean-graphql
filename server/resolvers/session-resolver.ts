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
import { Session, SessionModel } from '../entities/session';

@Resolver(of => Session)
export class UserResolver {
  @Query(returns => Session, { nullable: true })
  async playGame(@Arg('gameId') gameId: string): Promise<Session> {
    return await SessionModel.findById(gameId)
      .populate('board')
      .exec();
  }

  @Mutation(returns => Session)
  async findGame(
    @PubSub() pubSub: PubSubEngine,
    @Arg('userId') userId: string
  ): Promise<Session> {
    // TODO: alternate black and white team for player
    // TODO: prioritize players that came first
    let session: InstanceType<Session> = await SessionModel.findOne({
      whiteTeam: { $ne: userId }, // if is first player, prevent joining as second player
      blackTeam: null,
      'gameState.gameStarted': false
    }).exec();
    if (session) {
      // add final player start game
      try {
        // TODO: add more players/viewers
        // const newBoard: InstanceType<Board> = await new BoardModel().save(); // the devs on GitHub issues manually save
        session.gameState.gameStarted = true;
        // session.board = newBoard._id; // by this time the board does not return an "id" prop yet
        session.blackTeam = mongoose.Types.ObjectId(userId);

        // TODO: # of players in queue, etc.
        const saveSession = await session.save();

        pubSub.publish('MATCH_FOUND', {
          matchFound: saveSession.populate('board')
        });
        return { elapsedTime: saveSession.elapsedTime } as Session;
      } catch (e) {
        return e.message;
      }
    } else {
      // create new session instead if no match
      try {
        const newSession = await new SessionModel({
          whiteTeam: userId
        }).save();
        return newSession;
      } catch (e) {
        return e.message;
      }
    }
  }

  @Subscription({ topics: 'MATCH_FOUND' })
  matchFound(@Root() payload: Session): Session {
    return payload;
  }
}
