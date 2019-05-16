import { gql } from 'apollo-server-express';
import Session from '../models/session';
import { PubSub } from 'apollo-server';
const pubsub: PubSub = new PubSub();

export const typeDefs = gql`
  type GameState {
    gameOver: Boolean
    currentTurn: String
  }

  type Session {
    id: ID
    players: [User]
    createdAt: Int
    lastUpdated: Int
    whiteTeam: ID
    blackTeam: ID
    gameState: GameState
  }
`;
// A map of functions which return data for the schema.
export const resolvers = {
  Query: {
    findSessions: async () => await Session.find({}).exec()
  },
  Mutation: {
    joinSession: async (root: any, args: any, context: any) => {
      let session = await Session.findOne({
        blackTeam: null,
        gameState: { gameOver: false }
      }).exec();
      if (session) return session;
      else {
        try {
          const response = await Session.create({
            whiteTeam: args.userId
          });
          pubsub.publish('SESSION_ADDED', { sessionAdded: args });
          return response;
        } catch (e) {
          return e.message;
        }
      }
      // TODO: alternate black and white team for player
      // TODO: prioritize players that came first
    },
    addSession: async (root: any, args: any, context: any) => {
      try {
        const response = await Session.create(args);
        pubsub.publish('SESSION_ADDED', { sessionAdded: args });
        return response;
      } catch (e) {
        return e.message;
      }
    }
  },
  Subscription: {
    sessionAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: async () => pubsub.asyncIterator(['SESSION_ADDED'])
    }
  }
};
