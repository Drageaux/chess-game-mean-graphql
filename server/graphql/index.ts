import { gql } from 'apollo-server-express';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';

import { typeDefs as User, resolvers as userResolvers } from './user';
import { typeDefs as Session, resolvers as sessionResolvers } from './session';

const typeDefs = gql`
  type Query {
    findUser(id: ID!): User
    getUsers: [User]
    findSessions: [Session]
  }

  type Mutation {
    addUser(userName: String!, email: String!): User
    joinSession(userId: ID!): Session
    addSession(sessionName: String!, email: String!): Session
  }

  type Subscription {
    userAdded: User
    sessionAdded: Session
  }
`;

const linkTypeDefs = `
  extend type Session {
    players: [User]
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, User, Session],
  resolvers: [userResolvers, sessionResolvers]
});
export default schema;
