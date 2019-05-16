import { gql, makeExecutableSchema } from 'apollo-server-express';
import User from '../models/user';
import { PubSub } from 'apollo-server';
const pubsub: PubSub = new PubSub();

// The GraphQL schema
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  type User {
    id: ID!
    userName: String
    email: String
  }

  type Query {
    findUser(id: ID!): User
    getUsers: [User]
  }

  type Mutation {
    addUser(userName: String!, email: String!): User
  }

  type Subscription {
    userAdded: User
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    findUser: async (root: any, args: { id: any }, context: any) =>
      await User.find({ _id: args.id }).exec(),
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

const userSchema = makeExecutableSchema({ typeDefs, resolvers });
export default userSchema;
