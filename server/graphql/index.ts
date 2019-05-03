import { gql } from 'apollo-server-express';
import User from '../models/user';

// The GraphQL schema
export const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  type User {
    id: ID!
    userName: String
    email: String
  }

  type Query {
    getUsers: [User]
  }

  type Mutation {
    addUser(userName: String!, email: String!): User
  }
`;
// A map of functions which return data for the schema.
export const resolvers = {
  Query: {
    getUsers: async () => await User.find({}).exec()
  },
  Mutation: {
    addUser: async (_: any, args: any) => {
      try {
        const response = await User.create(args);
        return response;
      } catch (e) {
        return e.message;
      }
    }
  }
};
