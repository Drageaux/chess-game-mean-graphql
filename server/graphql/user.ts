import User from '../models/user';
import { PubSub, gql } from 'apollo-server-express';
const pubsub: PubSub = new PubSub();

export const typeDefs = gql`
  interface User {
    id: ID
    userName: String
    email: String
  }

  type BasicUser implements User {
    id: ID
    userName: String
    email: String
  }

  type Player implements User {
    id: ID
    userName: String
    email: String
    color: String
    # TODO: personal profile here
  }

  extend type Query {
    findUser(id: ID!): BasicUser
    getUsers: [BasicUser]
  }

  extend type Mutation {
    addUser(userName: String!, email: String!): BasicUser
  }

  extend type Subscription {
    userAdded: BasicUser
  }
`;

// a map of functions which return data for the schema.
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
      // additional event labels can be passed to asyncIterator creation
      subscribe: async () => pubsub.asyncIterator(['USER_ADDED'])
    }
  }
};
