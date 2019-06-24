import { Square } from '../../shared/interfaces';
import { File } from '../../shared/enums';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';
// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';
admin.initializeApp();

/* Express */
const app = express();
// https://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');
const router = express.Router();
// support parsing of application/json type post data
app.use(bodyParser.json());
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true }));

/* Router Setup */
import * as messagesApi from './messages.controller';
router.use('/messages', messagesApi.router);
app.use('/', router);
console.log('test');

// Again, lets be nice and help the poor wandering servers, any requests to /api
// that are not /api/users will result in 404.
app.get('/*', async (req: express.Request, res: express.Response) => {
  console.log(req.originalUrl);
  res.status(404).send('This route does not exist.');
});
export const api = functions.https.onRequest((request, response) => {
  console.log(JSON.stringify(request.path));
  if (!request.path) {
    request.url = `/${request.url}`; // prepend '/' to keep query params if any
  }
  return app(request, response);
});

const square: Square = { file: File.a, rank: 1 };
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((req, res) => {
  res.send('Hello from Firebase!');
});

// // Take the text parameter passed to this HTTP endpoint and insert it into the
// // Realtime Database under the path /messages/:pushId/original
// export const addMessage = functions.https.onRequest(async (req, res) => {
//   console.log(JSON.stringify(req.params));
//   // Grab the text parameter.
//   const original = req.params.text;
//   // Push the new message into the Realtime Database using the Firebase Admin SDK.
//   const snapshot = await admin
//     .database()
//     .ref('/messages')
//     .push({ original: original });
//   // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//   res.redirect(303, snapshot.ref.toString());
// });

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
export const makeUppercase = functions.database
  .ref('/messages/{pushId}/original')
  .onCreate((snapshot, context) => {
    console.log('snapshot =>', snapshot);
    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.val();
    console.log('Uppercasing', context.params.pushId, original);
    const uppercase = original.toUpperCase();
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    if (snapshot.ref.parent) {
      return snapshot.ref.parent.child('uppercase').set(uppercase);
    }
  });
