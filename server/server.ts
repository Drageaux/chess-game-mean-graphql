import 'reflect-metadata';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import log, { error, system, success, warning } from './log';

const compression = require('compression');
const cors = require('cors');
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import createSchema from './graphql/schema';

const env = process.env.NODE_ENV || 'development';
const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('*', cors());
app.use(compression());

async function bootstrap() {
  try {
    // setup MongoDB
    require('./config');

    // setup GraphQL
    const validateToken = (authToken: any) => {
      // ... validate token and return a Promise, rejects in case of an error
    };

    const findUser = (authToken: any) => {
      return (tokenValidationResult: any) => {
        // ... finds user by auth token and return a Promise, rejects in case of an error
      };
    };

    const schema = await createSchema();
    const apollo: ApolloServer = new ApolloServer({
      schema,
      subscriptions: {
        onConnect: (connectionParams: any, webSocket) => {
          log(system('[APOLLO] Web socket connected'));
          /*
        if (connectionParams.authToken) {
          return validateToken(connectionParams.authToken)
            .then(findUser(connectionParams.authToken))
            .then(user => {
              return {
                currentUser: user
              };
            });
        }
  
        throw new Error('Missing auth token!');
        */
        }
      },
      formatError: (err: any) => {
        log(error('[APOLLO] Error:', err));
        return err;
      },
      formatResponse: (response: any) => {
        log(success(`[APOLLO] Response:`, response));
        return response;
      } /*
  context: async (context: { connection: any; req: any }) => {
    if (context.connection) {
      // check connection for metadata
      return context.connection;
    } else {
      // check from req
      const token = context.req.headers.authorization || '';

      return { token };
    }
  }*/
    });
    apollo.applyMiddleware({ app }); // set up /graphql to use Apollo

    const ws = createServer(app);
    apollo.installSubscriptionHandlers(ws); // add subscription support

    // point static path to dist
    app.use(express.static(path.join(__dirname, 'dist')));
    // catch all other routes and return the index file (put at the end before running)
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });

    // up and running at port 3000
    ws.listen({ port: process.env.PORT || 3000 }, () => {
      log(
        system(
          `🚀 Server ready at http://localhost:${process.env.PORT || 3000}${
            apollo.graphqlPath
          }`
        )
      );
      log(
        system(
          `👀 Subscriptions ready at ws://localhost:${process.env.PORT ||
            3000}${apollo.subscriptionsPath}`
        )
      );
    });
  } catch (e) {
    log(error(e));
  }
}

bootstrap();
