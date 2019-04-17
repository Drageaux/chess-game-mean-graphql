const express = require('express');
const bodyParser = require('body-parser');
const env = process.env.NODE_ENV || 'development';
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('*', cors());

// setup MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/chess-game-mean-graphql', {
  useNewUrlParser: true
});
var db = mongoose.connection
  .on('error', function(err) {
    console.log(
      'Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red
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
});
