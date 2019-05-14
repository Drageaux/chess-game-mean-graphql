import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

import User from './user';

const sessionSchema = new Schema(
  {
    players: [User],
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    whiteTeam: User, // TODO: multiple people in 1 team
    blackTeam: User,
    gameState: {
      gameOver: { type: Boolean, default: false },
      currentTurn: String,
      checked: {
        white: Boolean,
        black: Boolean
      }
    }
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);
sessionSchema.virtual('elapsedTime').get(function() {
  // TODO: find out the time unit
  return Date.now() - this.createdAt;
});

export default mongoose.model('Session', sessionSchema);
