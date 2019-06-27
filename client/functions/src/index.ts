import { Square } from '../../shared/interfaces';
import { File } from '../../shared/enums';

// Express
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';
// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';

// TODO: Replace the following with your app's Firebase project configuration
import * as serviceAccount from './serviceAccount.json';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://chess-game-873f6.firebaseio.com'
});

/* Express */
const app = express();
// https://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');
// support parsing of application/json type post data
app.use(bodyParser.json());
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true }));

/* Router Setup */
import routes from './routes';
app.use('/', routes);

// Again, lets be nice and help the poor wandering servers, any requests to /api
// that are not /api/users will result in 404.
app.get('/*', async (req: express.Request, res: express.Response) => {
  console.log(req.originalUrl);
  res.status(404).send('This route does not exist.');
});
export const api = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}`; // prepend '/' to keep query params if any
  }
  return app(request, response);
});

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const helloWorld = functions.https.onRequest((req, res) => {
  res.send('Hello from Firebase!');
});

export * from './triggers';
