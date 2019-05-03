import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const compression = require('compression');
const cors = require('cors');
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionServer } from 'subscriptions-transport-ws';

const env = process.env.NODE_ENV || 'development';
const pubsub = new PubSub();
const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('*', cors());
app.use(compression());
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// setup MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/chess-game-mean-graphql', {
  useNewUrlParser: true
});
var db = mongoose.connection
  .on('error', err => {
    console.log(
      'Error: Could not connect to MongoDB. Did you forget to run `mongod`?'
    );
  })
  .on('open', function() {
    console.log('Connection extablised with MongoDB');
  });

// setup GraphQL
const userSchema = require('./graphql/index').userSchema;
app.use(
  '/graphql',
  cors(),
  graphqlHTTP({
    schema: userSchema,
    rootValue: global,
    graphiql: true
  })
);

// Up and Running at Port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('A GraphQL API running at port 3000');
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
});
