import Session from '../models/session';
import Gameboard, { FILE } from '../models/gameboard';
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
    name: String
  }
  input SquareXYInput {
    file: String!
    rank: Int!
  }

  type Gameboard {
    squares: [Square!]!
    whiteKingLocation: Square!
    blackKingLocation: Square!
  }

  type GameState {
    gameStarted: Boolean!
    gameOver: Boolean!
    currentTurn: String
  }

  # return the time waiting in queue
  type WaitingForGame {
    elapsedTime: String!
  }
  type Session {
    id: ID!
    players: [Player!]
    createdAt: String!
    lastUpdated: String!
    elapsedTime: String
    gameState: GameState!
    gameboard: Gameboard!
  }

  extend type Query {
    playGame(gameId: ID!, userId: ID!, filterBy: String): Session
  }

  extend type Mutation {
    findGame(userId: ID!): WaitingForGame
    movePiece(gameId: ID!, from: SquareXYInput!, to: SquareXYInput!): Gameboard
  }

  extend type Subscription {
    matchFound(userId: ID!): Session
    boardChanged(userId: ID!): Gameboard
  }
`;
// a map of functions which return data for the schema.
export const resolvers = {
  Query: {
    playGame: async (root: any, args: any, context: any) => {
      return await Session.findById(args.gameId)
        .populate('gameboard')
        .exec();
    }
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
        // add final player start game
        // TODO: add more players/viewers
        const newGameboard = await Gameboard.create({
          squares: DEFAULT_BOARD
        });
        session.gameState.gameStarted = true;
        session.gameboard = newGameboard._id;
        await session.save();
        // await session.updateOne({
        //   blackTeam: args.userId,
        //   'gameState.gameStarted': true,
        //   gameboard: newGameboard._id
        // });
        // console.log(`inited session `, session);
        session.save(function(err: any, data: any) {
          if (data) {
            // TODO: # of players in queue, etc.
            pubsub.publish('MATCH_FOUND', { matchFound: session });
            return session;
          } else if (err) {
            return err.message;
          }
        });
      } else {
        // create new session instead if no match
        try {
          const newSession = await Session.create({
            whiteTeam: args.userId
          });
          return newSession;
        } catch (e) {
          return e.message;
        }
      }
    },
    movePiece: async (root: any, args: any, context: any) => {
      let session: any = await Session.findById(args.gameId)
        .populate('board')
        .exec();
      let squares: any[] = session.gameboard.squares;
      let fromSqr = squares.find(s => args.from.name === s.name);
      let toSqr = squares.find(s => args.to.name === s.name);
      console.log(toSqr);
      toSqr.piece = fromSqr.piece;
      await session.save();
      return session;
      // args.from.piece
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
    },
    boardChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['BOARD_CHANGED']),
        (payload: any, variables: any) => {
          // payload is the result returned
          // variables are the args passed in when starting subscription
          return true;
        }
      )
    }
  }
};

const BOARD_SIZE = 8;
const DEFAULT_BOARD = initBoard(); // prevent remaking board every time

function initBoard(): any[] {
  let newBoard: any[] = [];

  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const newSquare: any = {
        file: FILE[x + 1],
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

  // sort descending in rank and ascending in file
  // returned order shouldn't be further modified
  newBoard = newBoard.sort((a, b) => {
    if (a.rank - b.rank === 0) {
      if (a.file > b.file) {
        return 1;
      } else if (a.file < b.file) {
        return -1;
      } else return 0;
    } else return b.rank - a.rank;
  });

  return newBoard;
}
