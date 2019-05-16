import User from '../models/user';
import { PubSub, gql } from 'apollo-server-express';
const pubsub: PubSub = new PubSub();

export const typeDefs = gql`
  type User {
    id: ID!
    userName: String!
    email: String!
  }

  extend type Query {
    findUser(id: ID!): User
    getUsers: [User]
  }

  extend type Mutation {
    addUser(userName: String!, email: String!): User
  }

  extend type Subscription {
    userAdded: User
  }
`;

// A map of functions which return data for the schema.
export const resolvers = {
  Query: {
    findUser: async (root: any, args: { id: any }, context: any) =>
      await User.findById(args.id).exec(),
    getUsers: async () => await User.find({}).exec()
  },
  Mutation: {
    addUser: async (root: any, args: any, context: any) => {
      try {
        const response = await User.create(args);
        pubsub.publish('USER_ADDED', { userAdded: args });
        return response;
      } catch (e) {
        return e.message;
      }
    }
  },
  Subscription: {
    userAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: async () => pubsub.asyncIterator(['USER_ADDED'])
    }
  }
};
