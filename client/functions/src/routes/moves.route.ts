import { Router, Request, Response } from 'express';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const router: Router = Router();

const db = admin.database();
const movesRef = db.ref('/moves');
const gamesRef = db.ref('/games');
const boardsRef = db.ref('/boards');

router.get('/', (req, res) => {
  const { gameId } = req.body;
  const gameState = gamesRef.ref.child(`/${gameId}`);
  boardsRef.child('/');
});

// router.get('/:');

export default router;
