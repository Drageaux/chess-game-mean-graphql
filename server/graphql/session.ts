import Session from '../models/session';
import Gameboard from '../models/gameboard';
import { PubSub, gql, withFilter } from 'apollo-server-express';
const pubsub: PubSub = new PubSub();

export const typeDefs = gql`
  # nested structures
  type Piece {
    color: String
    type: String
  }
  type Square {
    # TODO: transfer front-end square and piece classes
    file: String
    rank: Int
    piece: Piece
  }

  type Gameboard {
    squares: [Square]
  }

  type GameState {
    gameStarted: Boolean!
    gameOver: Boolean!
    currentTurn: String
  }

  # return the time waiting in queue
  type Session {
    id: ID!
    players: [Player!]
    createdAt: String!
    lastUpdated: String!
    elapsedTime: String!
    gameState: GameState
    gameboard: Gameboard
  }

  extend type Query {
    playGame(gameId: ID!, userId: ID!): Session
  }

  extend type Mutation {
    findGame(userId: ID!): Session
  }

  extend type Subscription {
    matchFound(userId: ID!): Session
  }
`;
// a map of functions which return data for the schema.
export const resolvers = {
  Query: {
    playGame: async (root: any, args: any, context: any) =>
      await Session.findById(args.gameId).exec()
  },
  Mutation: {
    findGame: async (root: any, args: any, context: any) => {
      // TODO: alternate black and white team for player
      // TODO: prioritize players that came first
      let session: any = await Session.findOne({
        whiteTeam: { $ne: args.userId }, // if is first player, prevent joining as second player
        blackTeam: null,
        'gameState.gameStarted': false
      }).exec();
      if (session) {
        // add final player
        session.blackTeam = args.userId;
        // start game
        initGame(session);
        await session.save();
        // TODO: # of players in queue, etc.
        pubsub.publish('MATCH_FOUND', { matchFound: session });
        return { elapsedTime: session };
      } else {
        // create new session instead if no match
        try {
          const newSession: any = await Session.create({
            whiteTeam: args.userId
          });
          return { elapsedTime: newSession };
        } catch (e) {
          return e.message;
        }
      }
    }
  },
  Subscription: {
    matchFound: {
      // additional event labels can be passed to asyncIterator creation
      subscribe: withFilter(
        () => pubsub.asyncIterator(['MATCH_FOUND']),
        (payload: any, variables: any) => {
          // payload is the result returned
          // variables are the args passed in when starting subscription
          return true;
        }
      )
    }
  }
};

const initGame = (session: any) => {
  session.gameStarted = true;
  session.gameboard = new Gameboard({
    squares: DEFAULT_BOARD
  });
};

const BOARD_SIZE = 8;
const DEFAULT_BOARD = initBoard(); // prevent remaking board every time

function initBoard(): any[] {
  let newBoard: any[] = [];

  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const newSquare: any = {
        file: x + 1,
        rank: y + 1
      };

      const newPiece: any = {};

      // set color
      switch (y + 1) {
        case 1:
          switch (x + 1) {
            case 1:
            case 8:
              newPiece.type = 'rook';
              break;
            case 2:
            case 7:
              newPiece.type = 'knight';
              break;
            case 3:
            case 6:
              newPiece.type = 'bishop';
              break;
            case 4:
              newPiece.type = 'queen';
              break;
            case 5:
              newPiece.type = 'king';
          }
          newPiece.color = 'white';
          newSquare.piece = newPiece;
          break;
        case 2:
          newPiece.type = 'pawn';
          newPiece.color = 'white';
          newSquare.piece = newPiece;
          break;
        case 7:
          newPiece.type = 'pawn';
          newPiece.color = 'black';
          newSquare.piece = newPiece;
          break;
        case 8:
          switch (x + 1) {
            case 1:
            case 8:
              newPiece.type = 'rook';
              break;
            case 2:
            case 7:
              newPiece.type = 'knight';
              break;
            case 3:
            case 6:
              newPiece.type = 'bishop';
              break;
            case 4:
              newPiece.type = 'queen';
              break;
            case 5:
              newPiece.type = 'king';
          }
          newPiece.color = 'black';
          newSquare.piece = newPiece;
          break;
        default:
          break;
      }

      newBoard.push(newSquare);
    }
  }

  newBoard = newBoard.sort(function(a, b) {
    return b.rank - a.rank || a.file - b.file;
  });

  return newBoard;
}
