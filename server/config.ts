import log, { error, system } from './log';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB || 'mongodb://localhost:27017/chess-game-mean-graphql',
  {
    useNewUrlParser: true
  }
);
var db = mongoose.connection
  .on('error', (err: any) => {
    log(
      error(
        '🗃 [MONGO DB] Error: Could not connect to MongoDB. Did you forget to run `mongod`?'
      )
    );
  })
  .on('open', function() {
    log(system('🗃 [MONGO DB] Connection extablised with MongoDB'));
  });
