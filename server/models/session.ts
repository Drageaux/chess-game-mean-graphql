import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

import User from './user';
import Gameboard from './gameboard';
const UserSchema = User.schema;
const GameboardSchema = Gameboard.schema;

const sessionSchema = new Schema(
  {
    players: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }
    ],
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    whiteTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }, // TODO: multiple people in 1 team
    blackTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    gameState: {
      gameStarted: { type: Boolean, default: false },
      gameOver: { type: Boolean, default: false },
      currentTurn: { type: String, enum: ['white', 'black'], default: 'white' },
      checked: {
        white: {
          type: Boolean,
          default: false
        },
        black: {
          type: Boolean,
          default: false
        }
      }
    },
    gameboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gameboard'
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
sessionSchema.pre('remove', function(next) {
  // work-around for 'this' not recognizing its properties in TS
  Gameboard.findByIdAndRemove((this as any).gameboard);
  next();
});

export default mongoose.model('Session', sessionSchema);
