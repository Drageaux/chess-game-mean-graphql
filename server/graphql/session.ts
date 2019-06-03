import { InstanceType } from 'typegoose';
import { SessionModel, Session } from '../models/session';
import { BoardModel, Board } from '../models/board';
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

  type Board {
    id: ID!
    squares: [Square]
    whiteKingLocation: Square
    blackKingLocation: Square
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
    createdAt: String
    lastUpdated: String
    elapsedTime: Int
    gameState: GameState
    board: Board
  }

  extend type Query {
    playGame(gameId: ID!, userId: ID!, filterBy: String): Session
  }

  extend type Mutation {
    findGame(userId: ID!): WaitingForGame
    movePiece(gameId: ID!, from: SquareXYInput!, to: SquareXYInput!): Board
  }

  extend type Subscription {
    matchFound(userId: ID!): Session
    boardChanged(userId: ID!): Board
  }
`;
// a map of functions which return data for the schema.
export const resolvers = {
  Query: {
    playGame: async (root: any, args: any, context: any) => {
      return await SessionModel.findById(args.gameId)
        .populate('board')
        .exec();
    }
  },
  Mutation: {
    findGame: async (root: any, args: any, context: any) => {
      // TODO: alternate black and white team for player
      // TODO: prioritize players that came first
      let session: InstanceType<Session> = await SessionModel.findOne({
        whiteTeam: { $ne: args.userId }, // if is first player, prevent joining as second player
        blackTeam: null,
        'gameState.gameStarted': false
      }).exec();

      if (session) {
        // add final player start game
        try {
          // TODO: add more players/viewers
          const newBoard: InstanceType<Board> = await new BoardModel().save(); // the devs on GitHub issues manually save
          session.gameState.gameStarted = true;
          session.board = newBoard._id; // by this time the board does not return an "id" prop yet
          session.blackTeam = args.userId;

          // TODO: # of players in queue, etc.
          const saveSession = await session.save();

          pubsub.publish('MATCH_FOUND', {
            matchFound: saveSession.populate('board')
          });
          return saveSession;
        } catch (e) {
          return e.message;
        }
      } else {
        // create new session instead if no match
        try {
          const newSession = await new SessionModel({
            whiteTeam: args.userId
          }).save();
          return newSession;
        } catch (e) {
          return e.message;
        }
      }
    },
    movePiece: async (root: any, args: any, context: any) => {
      try {
        let session: InstanceType<Session> = await SessionModel.findById(
          args.gameId
        )
          .populate('board')
          .exec();
        let board = session.board as InstanceType<Board>;
        let squares = board.squares;
        let fromSqr = squares.find(
          s => `${args.from.file}${args.from.rank}` === `${s.file}${s.rank}`
        );
        let toSqr = squares.find(
          s => `${args.to.file}${args.to.rank}` === `${s.file}${s.rank}`
        );
        // start modifying
        toSqr.piece = fromSqr.piece;
        fromSqr.piece = null;
        // console.log(`AFTER\nfrom ${fromSqr}\n`, `to ${toSqr}`);
        // end modifying

        board.markModified('squares');
        const saveBoard = await board.save();
        // console.log(saveBoard);
        pubsub.publish('BOARD_CHANGED', { boardChanged: saveBoard });
        return saveBoard;
      } catch (e) {
        // FIXME: not returning error as accepted somehow
        return e.message;
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
