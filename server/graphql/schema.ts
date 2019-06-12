import { gql } from 'apollo-server-express';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';

import { UserResolver } from '../resolvers/user-resolver';
import { SessionResolver } from '../resolvers/session-resolver';
import { BoardResolver } from '../resolvers/board-resolver';

import { typeDefs as Move, resolvers as moveResolvers } from './move';
import { buildTypeDefsAndResolvers, buildSchema } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from './object-id-scalar';

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
    resolvers: [UserResolver, SessionResolver, BoardResolver],
    validate: false, // disable automatic validation or pass the default config object
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }]
  });
  return schema;
}

export default createSchema;
