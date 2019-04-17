const express = require("express");
const graphqlHTTP = require("express-graphql");
const app = express();

const userSchema = require('./graphql/index').userSchema;
app.use('/graphql', graphqlHTTP({
  schema: userSchema,
  rootValue: global,
  graphiql: true
}));

// Up and Running at Port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('A GraphQL API running at port 3000');
});