import { gql } from 'apollo-server-express';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';

import { User } from '../entities/user';
import { UserResolver } from '../resolvers/user-resolver';
import { resolvers as userResolvers } from './user';
import { SessionResolver } from '../resolvers/session-resolver';
import { typeDefs as Move, resolvers as moveResolvers } from './move';
import { buildTypeDefsAndResolvers, buildSchema } from 'type-graphql';

// const typeDefs = gql`
//   type Query {
//     _empty: String
//   }

//   type Mutation {
//     _empty: String
//   }

//   type Subscription {
//     _empty: String
//   }
// `;

async function createSchema() {
  // const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
  //   resolvers: [UserResolver]
  // });
  // const schema = makeExecutableSchema({
  //   typeDefs,
  //   resolvers
  // });
  const schema = buildSchema({
    resolvers: [UserResolver, SessionResolver],
    validate: false // disable automatic validation or pass the default config object
  });
  return schema;
}

export default createSchema;
