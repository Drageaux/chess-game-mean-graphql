import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

const compression = require('compression');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
import { PubSub } from 'graphql-subscriptions';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

const env = process.env.NODE_ENV || 'development';
const pubsub = new PubSub();
const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('*', cors());
app.use(compression());

// setup MongoDB
require('./config');

// setup GraphQL
// const userSchema = require('./graphql/index').userSchema;
import { typeDefs, resolvers } from './graphql';
const server = new ApolloServer({
  typeDefs,
  resolvers
});
server.applyMiddleware({ app }); // app is from an existing express app

// point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
// catch all other routes and return the index file (put at the end before running)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// up and running at port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT || 3000}${
      server.graphqlPath
    }`
  );
  /*
  new SubscriptionServer(
    {
      execute,
      subscribe,
      userSchema
    },
    {
      server: app,
      path: '/subscriptions'
    }
  );
  */
});
