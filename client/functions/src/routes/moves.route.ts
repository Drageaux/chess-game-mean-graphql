import { Square } from '../../../shared/interfaces';
import { Router, Request, Response } from 'express';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { movesFactory } from '../../../shared/controllers/moves-factory';

const router: Router = Router();

const db = admin.database();
const movesRef = db.ref('/moves');
const gamesRef = db.ref('/games');
const boardsRef = db.ref('/boards');

router.get('/:gameId', async (req, res) => {
  const { gameId, from } = req.params;
  const gameState = await gamesRef.ref.child(`${gameId}`);
  const boardId = await gamesRef.ref.child(`${gameId}/board`);
  boardsRef
    .child(`${boardId}`)
    .once('value')
    .then(snapshot => {
      res.json(movesFactory(from as Square, snapshot.val()));
    })
    .catch(console.error);
});

// router.get('/:');

export default router;
