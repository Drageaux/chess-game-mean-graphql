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
    console.log(
      'Error: Could not connect to MongoDB. Did you forget to run `mongod`?'
    );
  })
  .on('open', function() {
    console.log('Connection extablised with MongoDB');
  });
