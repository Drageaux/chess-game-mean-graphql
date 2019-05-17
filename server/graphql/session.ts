import Session from '../models/session';
import { PubSub, gql, withFilter } from 'apollo-server-express';
const pubsub: PubSub = new PubSub();

export const typeDefs = gql`
  # return the time waiting in queue
  type WaitingInQueue {
    elapsedTime: String!
  }

  type GameState {
    gameStarted: Boolean!
    gameOver: Boolean!
    currentTurn: String
  }

  type GameSession {
    id: ID!
    players: [Player!]
    createdAt: String!
    lastUpdated: String!
    gameState: GameState
  }

  extend type Mutation {
    joinSession(userId: ID!): WaitingInQueue
  }

  extend type Subscription {
    matchFound(userId: ID!): GameSession
  }
`;
// A map of functions which return data for the schema.
export const resolvers = {
  Mutation: {
    joinSession: async (root: any, args: any, context: any) => {
      // TODO: alternate black and white team for player
      // TODO: prioritize players that came first
      let session: any = await Session.findOne({
        whiteTeam: { $ne: args.userId }, // if is first player, prevent joining as second player
        blackTeam: null,
        'gameState.gameStarted': false
      }).exec();
      if (session) {
        // start game
        session.blackTeam = args.userId;
        await session.save();
        // TODO: players in queue, etc.
        pubsub.publish('MATCH_FOUND', { matchFound: session });
        return { elapsedTime: session.elapsedTime };
      } else {
        // create new session instead if no match
        try {
          const newSession: any = await Session.create({
            whiteTeam: args.userId
          });
          return { elapsedTime: newSession.elapsedTime };
        } catch (e) {
          return e.message;
        }
      }
    }
  },
  Subscription: {
    matchFound: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: withFilter(
        () => pubsub.asyncIterator(['MATCH_FOUND']),
        (payload: any, variables: any) => {
          console.log(`payload: ${JSON.stringify(payload)}`);
          console.log(`variables: ${JSON.stringify(variables)}`);
          return true;
        }
      )
    }
  }
};
