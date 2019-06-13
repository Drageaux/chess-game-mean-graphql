// tslint:disable

export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Mongo object id scalar type */
  ObjectId: any;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Board = {
  _id: Scalars["ID"];
  squares: Array<Square>;
  capturedPieces?: Maybe<Array<Piece>>;
  whiteKingLocation?: Maybe<Square>;
  blackKingLocation?: Maybe<Square>;
};

export type CheckedMap = {
  white: Scalars["Boolean"];
  black: Scalars["Boolean"];
};

/** The basic team colors */
export enum Color {
  White = "White",
  Black = "Black"
}

/** The column notation of a Square on a Board */
export enum File {
  A = "a",
  B = "b",
  C = "c",
  D = "d",
  E = "e",
  F = "f",
  G = "g",
  H = "h"
}

export type GameState = {
  gameStarted: Scalars["Boolean"];
  gameOver: Scalars["Boolean"];
  currentTurn: Color;
  checked: CheckedMap;
};

export type Mutation = {
  addUser: Scalars["Boolean"];
  findGame: Session;
  movePiece: Scalars["Boolean"];
};

export type MutationAddUserArgs = {
  user: UserInput;
};

export type MutationFindGameArgs = {
  userId: Scalars["ObjectId"];
};

export type MutationMovePieceArgs = {
  to: SquareXyInput;
  from: SquareXyInput;
  gameId: Scalars["ObjectId"];
};

export type Piece = {
  type: PieceType;
  color: Color;
  captured?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
};

/** The basic Piece Type */
export enum PieceType {
  Pawn = "Pawn",
  Knight = "Knight",
  Bishop = "Bishop",
  Rook = "Rook",
  Queen = "Queen",
  King = "King"
}

export type Player = {
  _id: Scalars["ID"];
  userName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  color: Color;
};

export type Query = {
  findUser?: Maybe<User>;
  getUsers: Array<User>;
  playGame?: Maybe<Session>;
};

export type QueryFindUserArgs = {
  id: Scalars["ObjectId"];
};

export type QueryPlayGameArgs = {
  gameId: Scalars["ObjectId"];
};

export type Session = {
  _id: Scalars["ID"];
  players?: Maybe<Array<User>>;
  createdAt: Scalars["DateTime"];
  lastUpdated?: Maybe<Scalars["DateTime"]>;
  whiteTeam?: Maybe<User>;
  blackTeam?: Maybe<User>;
  gameState?: Maybe<GameState>;
  board?: Maybe<Board>;
  elapsedTime?: Maybe<Scalars["Int"]>;
};

export type Square = {
  file: File;
  rank: Scalars["Int"];
  piece?: Maybe<Piece>;
  name: Scalars["String"];
};

export type SquareXyInput = {
  file: File;
  rank: Scalars["Int"];
};

export type Subscription = {
  userAdded: User;
  matchFound: Session;
  boardChanged: Board;
};

export type SubscriptionMatchFoundArgs = {
  userId: Scalars["ObjectId"];
};

export type SubscriptionBoardChangedArgs = {
  userId: Scalars["ObjectId"];
};

export type User = {
  _id: Scalars["ID"];
  userName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};

export type UserInput = {
  userName: Scalars["String"];
  email: Scalars["String"];
};
export type BasicSessionFieldsFragment = { __typename?: "Session" } & Pick<
  Session,
  "_id" | "createdAt" | "lastUpdated"
>;

export type PieceFieldsFragment = { __typename?: "Piece" } & Pick<
  Piece,
  "color" | "type" | "captured" | "name"
>;

export type SquareXyFieldsFragment = { __typename?: "Square" } & Pick<
  Square,
  "file" | "rank"
>;

export type SquareFieldsFragment = { __typename?: "Square" } & Pick<
  Square,
  "file" | "rank"
>;

export type BoardFieldsFragment = { __typename?: "Board" } & Pick<
  Board,
  "_id"
> & {
    squares: Array<
      { __typename?: "Square" } & Pick<Square, "name"> & {
          piece: Maybe<{ __typename?: "Piece" } & PieceFieldsFragment>;
        } & SquareXyFieldsFragment
    >;
    whiteKingLocation: Maybe<
      { __typename?: "Square" } & Pick<Square, "name"> & SquareXyFieldsFragment
    >;
    blackKingLocation: Maybe<
      { __typename?: "Square" } & Pick<Square, "name"> & SquareXyFieldsFragment
    >;
  };

export type PlayGameQueryVariables = {
  gameId: Scalars["ObjectId"];
};

export type PlayGameQuery = { __typename?: "Query" } & {
  playGame: Maybe<
    { __typename?: "Session" } & {
      players: Maybe<Array<{ __typename?: "User" } & UserWithIdFragment>>;
      gameState: Maybe<
        { __typename?: "GameState" } & Pick<
          GameState,
          "gameStarted" | "gameOver" | "currentTurn"
        >
      >;
      board: Maybe<{ __typename?: "Board" } & Pick<Board, "_id">>;
    } & BasicSessionFieldsFragment
  >;
};

export type GetBoardQueryVariables = {
  gameId: Scalars["ObjectId"];
};

export type GetBoardQuery = { __typename?: "Query" } & {
  playGame: Maybe<
    { __typename?: "Session" } & {
      board: Maybe<{ __typename?: "Board" } & BoardFieldsFragment>;
    } & BasicSessionFieldsFragment
  >;
};

export type FindGameMutationVariables = {
  userId: Scalars["ObjectId"];
};

export type FindGameMutation = { __typename?: "Mutation" } & {
  findGame: { __typename?: "Session" } & Pick<Session, "elapsedTime">;
};

export type MovePieceMutationVariables = {
  gameId: Scalars["ObjectId"];
  from: SquareXyInput;
  to: SquareXyInput;
};

export type MovePieceMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "movePiece"
>;

export type MatchFoundSubscriptionVariables = {
  userId: Scalars["ObjectId"];
};

export type MatchFoundSubscription = { __typename?: "Subscription" } & {
  matchFound: { __typename?: "Session" } & BasicSessionFieldsFragment;
};

export type BoardChangedSubscriptionVariables = {
  userId: Scalars["ObjectId"];
};

export type BoardChangedSubscription = { __typename?: "Subscription" } & {
  boardChanged: { __typename?: "Board" } & BoardFieldsFragment;
};

export type UserWithIdFragment = { __typename?: "User" } & Pick<
  User,
  "_id" | "userName" | "email"
>;

export type UserNoIdFragment = { __typename?: "User" } & Pick<
  User,
  "userName" | "email"
>;

export type FindUserByIdQueryVariables = {
  id: Scalars["ObjectId"];
};

export type FindUserByIdQuery = { __typename?: "Query" } & {
  findUser: Maybe<{ __typename?: "User" } & UserWithIdFragment>;
};

export type GetAllUsersQueryVariables = {};

export type GetAllUsersQuery = { __typename?: "Query" } & {
  getUsers: Array<{ __typename?: "User" } & UserNoIdFragment>;
};

export type AddUserMutationVariables = {
  userName: Scalars["String"];
  email: Scalars["String"];
};

export type AddUserMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "addUser"
>;

export type UserAddedSubscriptionVariables = {};

export type UserAddedSubscription = { __typename?: "Subscription" } & {
  userAdded: { __typename?: "User" } & UserNoIdFragment;
};

import gql from "graphql-tag";
import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";
export const basicSessionFieldsFragmentDoc = gql`
  fragment basicSessionFields on Session {
    _id
    createdAt
    lastUpdated
  }
`;
export const squareFieldsFragmentDoc = gql`
  fragment squareFields on Square {
    file
    rank
  }
`;
export const squareXYFieldsFragmentDoc = gql`
  fragment squareXYFields on Square {
    file
    rank
  }
`;
export const pieceFieldsFragmentDoc = gql`
  fragment pieceFields on Piece {
    color
    type
    captured
    name
  }
`;
export const boardFieldsFragmentDoc = gql`
  fragment boardFields on Board {
    _id
    squares {
      ...squareXYFields
      name
      piece {
        ...pieceFields
      }
    }
    whiteKingLocation {
      ...squareXYFields
      name
    }
    blackKingLocation {
      ...squareXYFields
      name
    }
  }
  ${squareXYFieldsFragmentDoc}
  ${pieceFieldsFragmentDoc}
`;
export const userWithIdFragmentDoc = gql`
  fragment userWithId on User {
    _id
    userName
    email
  }
`;
export const userNoIdFragmentDoc = gql`
  fragment userNoId on User {
    userName
    email
  }
`;
export const PlayGameDocument = gql`
  query PlayGame($gameId: ObjectId!) {
    playGame(gameId: $gameId) {
      ...basicSessionFields
      players {
        ...userWithId
      }
      gameState {
        gameStarted
        gameOver
        currentTurn
      }
      board {
        _id
      }
    }
  }
  ${basicSessionFieldsFragmentDoc}
  ${userWithIdFragmentDoc}
`;

@Injectable({
  providedIn: "root"
})
export class PlayGameGQL extends Apollo.Query<
  PlayGameQuery,
  PlayGameQueryVariables
> {
  document = PlayGameDocument;
}
export const GetBoardDocument = gql`
  query GetBoard($gameId: ObjectId!) {
    playGame(gameId: $gameId) {
      ...basicSessionFields
      board {
        ...boardFields
      }
    }
  }
  ${basicSessionFieldsFragmentDoc}
  ${boardFieldsFragmentDoc}
`;

@Injectable({
  providedIn: "root"
})
export class GetBoardGQL extends Apollo.Query<
  GetBoardQuery,
  GetBoardQueryVariables
> {
  document = GetBoardDocument;
}
export const FindGameDocument = gql`
  mutation FindGame($userId: ObjectId!) {
    findGame(userId: $userId) {
      elapsedTime
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class FindGameGQL extends Apollo.Mutation<
  FindGameMutation,
  FindGameMutationVariables
> {
  document = FindGameDocument;
}
export const MovePieceDocument = gql`
  mutation MovePiece(
    $gameId: ObjectId!
    $from: SquareXYInput!
    $to: SquareXYInput!
  ) {
    movePiece(gameId: $gameId, from: $from, to: $to)
  }
`;

@Injectable({
  providedIn: "root"
})
export class MovePieceGQL extends Apollo.Mutation<
  MovePieceMutation,
  MovePieceMutationVariables
> {
  document = MovePieceDocument;
}
export const MatchFoundDocument = gql`
  subscription MatchFound($userId: ObjectId!) {
    matchFound(userId: $userId) {
      ...basicSessionFields
    }
  }
  ${basicSessionFieldsFragmentDoc}
`;

@Injectable({
  providedIn: "root"
})
export class MatchFoundGQL extends Apollo.Subscription<
  MatchFoundSubscription,
  MatchFoundSubscriptionVariables
> {
  document = MatchFoundDocument;
}
export const BoardChangedDocument = gql`
  subscription BoardChanged($userId: ObjectId!) {
    boardChanged(userId: $userId) {
      ...boardFields
    }
  }
  ${boardFieldsFragmentDoc}
`;

@Injectable({
  providedIn: "root"
})
export class BoardChangedGQL extends Apollo.Subscription<
  BoardChangedSubscription,
  BoardChangedSubscriptionVariables
> {
  document = BoardChangedDocument;
}
export const FindUserByIdDocument = gql`
  query FindUserById($id: ObjectId!) {
    findUser(id: $id) {
      ...userWithId
    }
  }
  ${userWithIdFragmentDoc}
`;

@Injectable({
  providedIn: "root"
})
export class FindUserByIdGQL extends Apollo.Query<
  FindUserByIdQuery,
  FindUserByIdQueryVariables
> {
  document = FindUserByIdDocument;
}
export const GetAllUsersDocument = gql`
  query GetAllUsers {
    getUsers {
      ...userNoId
    }
  }
  ${userNoIdFragmentDoc}
`;

@Injectable({
  providedIn: "root"
})
export class GetAllUsersGQL extends Apollo.Query<
  GetAllUsersQuery,
  GetAllUsersQueryVariables
> {
  document = GetAllUsersDocument;
}
export const AddUserDocument = gql`
  mutation AddUser($userName: String!, $email: String!) {
    addUser(user: { userName: $userName, email: $email })
  }
`;

@Injectable({
  providedIn: "root"
})
export class AddUserGQL extends Apollo.Mutation<
  AddUserMutation,
  AddUserMutationVariables
> {
  document = AddUserDocument;
}
export const UserAddedDocument = gql`
  subscription UserAdded {
    userAdded {
      ...userNoId
    }
  }
  ${userNoIdFragmentDoc}
`;

@Injectable({
  providedIn: "root"
})
export class UserAddedGQL extends Apollo.Subscription<
  UserAddedSubscription,
  UserAddedSubscriptionVariables
> {
  document = UserAddedDocument;
}
