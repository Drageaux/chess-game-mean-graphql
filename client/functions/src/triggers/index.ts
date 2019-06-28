import * as functions from 'firebase-functions';

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

export const generateMoves = functions.database
  .ref('/games/{gameId}')
  .onUpdate((snapshot, context) => {
    return snapshot;
  });
