import Session from '../models/session';
import { PubSub, gql } from 'apollo-server-express';
const pubsub: PubSub = new PubSub();

export const typeDefs = gql`
  type CreateOrJoinResult {
    id: ID!
    players: [Player!]
    createdAt: String!
    lastUpdated: String!
    gameState: GameState
  }

  type GameState {
    gameStarted: Boolean!
    gameOver: Boolean!
    currentTurn: String
  }

  extend type Mutation {
    joinSession(userId: ID!): CreateOrJoinResult
    addSession(sessionName: String!, email: String!): CreateOrJoinResult
  }

  extend type Subscription {
    sessionAdded: CreateOrJoinResult
  }
`;
// A map of functions which return data for the schema.
export const resolvers = {
  Mutation: {
    joinSession: async (root: any, args: any, context: any) => {
      let session: any = await Session.findOne({
        whiteTeam: { $ne: args.userId }, // if is first player, prevent joining as second player 
        blackTeam: null,
        'gameState.gameStarted': false
      }).exec();
      console.log(session);
      if (session) {
        session.blackTeam = args.userId;
        await session.save();
        return session;
      } else {
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
