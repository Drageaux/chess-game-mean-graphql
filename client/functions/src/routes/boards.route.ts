import { Router, Request, Response } from 'express';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const router: Router = Router();

const db = admin.database();
const ref = db.ref('/boards');

router.get('/', (req, res) => {
  ref.once('value', (snapshot: any) => {
    res.send(snapshot.val());
  });
});

export default router;
