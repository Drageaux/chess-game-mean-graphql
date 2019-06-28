/* example API */
// Import only what we need from express
import { Router, Request, Response } from 'express';
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';
// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';

// Assign router to the express.Router() instance
const router: Router = Router();

const db = admin.database();
const ref = db.ref('/messages');

router.get('/', (req, res) => {
  ref.once('value', (snapshot: any) => {
    res.send(snapshot.val());
  });
});

router.post('/', async (req: Request, res: Response) => {
  // Grab the text parameter.
  const text = req.body.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await ref.push(
    JSON.parse(JSON.stringify({ original: text }))
  );
  res.json({ data: snapshot.ref.toString() });
});

export default router;
