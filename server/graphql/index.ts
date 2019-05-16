import { gql } from 'apollo-server-express';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';

import { typeDefs as User, resolvers as userResolvers } from './user';
import { typeDefs as Session, resolvers as sessionResolvers } from './session';

const typeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, User, Session],
  resolvers: [userResolvers, sessionResolvers]
});
export default schema;
