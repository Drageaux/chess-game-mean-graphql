// tslint:disable

export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type BasicUser = User & {
  id?: Maybe<Scalars["ID"]>;
  userName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};

export type Board = {
  id: Scalars["ID"];
  squares?: Maybe<Array<Maybe<Square>>>;
  whiteKingLocation?: Maybe<Square>;
  blackKingLocation?: Maybe<Square>;
};

export type GameState = {
  gameStarted: Scalars["Boolean"];
  gameOver: Scalars["Boolean"];
  currentTurn?: Maybe<Scalars["String"]>;
};

export type Move = {
  from?: Maybe<Square>;
  to?: Maybe<Square>;
};

export type Moves = {
  eagerMoves?: Maybe<Array<Maybe<Square>>>;
  regularMoves?: Maybe<Array<Maybe<Square>>>;
};

export type Mutation = {
  _empty?: Maybe<Scalars["String"]>;
  addUser?: Maybe<BasicUser>;
  findGame?: Maybe<WaitingForGame>;
  movePiece?: Maybe<Board>;
};

export type MutationAddUserArgs = {
  userName: Scalars["String"];
  email: Scalars["String"];
};

export type MutationFindGameArgs = {
  userId: Scalars["ID"];
};

export type MutationMovePieceArgs = {
  gameId: Scalars["ID"];
  from: SquareXyInput;
  to: SquareXyInput;
};

export type Piece = {
  color?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
};

export type Player = User & {
  id?: Maybe<Scalars["ID"]>;
  userName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  color?: Maybe<Scalars["String"]>;
};

export type Query = {
  _empty?: Maybe<Scalars["String"]>;
  findUser?: Maybe<BasicUser>;
  getUsers?: Maybe<Array<Maybe<BasicUser>>>;
  playGame?: Maybe<Session>;
  testGetMoves?: Maybe<Moves>;
};

export type QueryFindUserArgs = {
  id: Scalars["ID"];
};

export type QueryPlayGameArgs = {
  gameId: Scalars["ID"];
  userId: Scalars["ID"];
  filterBy?: Maybe<Scalars["String"]>;
};

export type QueryTestGetMovesArgs = {
  id?: Maybe<Scalars["Int"]>;
};

export type Session = {
  id: Scalars["ID"];
  players?: Maybe<Array<Player>>;
  createdAt?: Maybe<Scalars["String"]>;
  lastUpdated?: Maybe<Scalars["String"]>;
  elapsedTime?: Maybe<Scalars["Int"]>;
  gameState?: Maybe<GameState>;
  board?: Maybe<Board>;
};

export type Square = {
  file?: Maybe<Scalars["String"]>;
  rank?: Maybe<Scalars["Int"]>;
  piece?: Maybe<Piece>;
  name?: Maybe<Scalars["String"]>;
};

export type SquareXyInput = {
  file: Scalars["String"];
  rank: Scalars["Int"];
};

export type Subscription = {
  _empty?: Maybe<Scalars["String"]>;
  userAdded?: Maybe<BasicUser>;
  matchFound?: Maybe<Session>;
  boardChanged?: Maybe<Board>;
};

export type SubscriptionMatchFoundArgs = {
  userId: Scalars["ID"];
};

export type SubscriptionBoardChangedArgs = {
  userId: Scalars["ID"];
};

export type User = {
  id?: Maybe<Scalars["ID"]>;
  userName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};

export type WaitingForGame = {
  elapsedTime: Scalars["String"];
};
export type BasicSessionFieldsFragment = { __typename?: "Session" } & Pick<
  Session,
  "id" | "createdAt" | "lastUpdated"
>;

export type PieceFieldsFragment = { __typename?: "Piece" } & Pick<
  Piece,
  "color" | "type"
>;

export type SquareXyFieldsFragment = { __typename?: "Square" } & Pick<
  Square,
  "file" | "rank"
>;

export type BoardFieldsFragment = { __typename?: "Board" } & Pick<
  Board,
  "id"
> & {
    squares: Maybe<
      Array<
        Maybe<
          { __typename?: "Square" } & Pick<Square, "name"> & {
              piece: Maybe<{ __typename?: "Piece" } & PieceFieldsFragment>;
            } & SquareXyFieldsFragment
        >
      >
    >;
    whiteKingLocation: Maybe<
      { __typename?: "Square" } & Pick<Square, "name"> & SquareXyFieldsFragment
    >;
    blackKingLocation: Maybe<
      { __typename?: "Square" } & Pick<Square, "name"> & SquareXyFieldsFragment
    >;
  };

export type PlayGameQueryVariables = {
  gameId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type PlayGameQuery = { __typename?: "Query" } & {
  playGame: Maybe<
    { __typename?: "Session" } & {
      players: Maybe<Array<{ __typename?: "Player" } & UserWithIdFragment>>;
      gameState: Maybe<
        { __typename?: "GameState" } & Pick<
          GameState,
          "gameStarted" | "gameOver" | "currentTurn"
        >
      >;
      board: Maybe<{ __typename?: "Board" } & Pick<Board, "id">>;
    } & BasicSessionFieldsFragment
  >;
};

export type GetBoardQueryVariables = {
  gameId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type GetBoardQuery = { __typename?: "Query" } & {
  playGame: Maybe<
    { __typename?: "Session" } & {
      board: Maybe<{ __typename?: "Board" } & BoardFieldsFragment>;
    } & BasicSessionFieldsFragment
  >;
};

export type GetMovesQueryVariables = {
  id?: Maybe<Scalars["Int"]>;
};

export type GetMovesQuery = { __typename?: "Query" } & {
  testGetMoves: Maybe<
    { __typename?: "Moves" } & {
      regularMoves: Maybe<
        Array<Maybe<{ __typename?: "Square" } & Pick<Square, "file">>>
      >;
      eagerMoves: Maybe<
        Array<Maybe<{ __typename?: "Square" } & Pick<Square, "file">>>
      >;
    }
  >;
};

export type FindGameMutationVariables = {
  userId: Scalars["ID"];
};

export type FindGameMutation = { __typename?: "Mutation" } & {
  findGame: Maybe<
    { __typename?: "WaitingForGame" } & Pick<WaitingForGame, "elapsedTime">
  >;
};

export type MovePieceMutationVariables = {
  gameId: Scalars["ID"];
  from: SquareXyInput;
  to: SquareXyInput;
};

export type MovePieceMutation = { __typename?: "Mutation" } & {
  movePiece: Maybe<{ __typename?: "Board" } & BoardFieldsFragment>;
};

export type MatchFoundSubscriptionVariables = {
  userId: Scalars["ID"];
};

export type MatchFoundSubscription = { __typename?: "Subscription" } & {
  matchFound: Maybe<{ __typename?: "Session" } & BasicSessionFieldsFragment>;
};

export type BoardChangedSubscriptionVariables = {
  userId: Scalars["ID"];
};

export type BoardChangedSubscription = { __typename?: "Subscription" } & {
  boardChanged: Maybe<{ __typename?: "Board" } & BoardFieldsFragment>;
};

export type UserWithIdFragment = { __typename?: "BasicUser" | "Player" } & Pick<
  User,
  "id" | "userName" | "email"
>;

export type UserNoIdFragment = { __typename?: "BasicUser" | "Player" } & Pick<
  User,
  "userName" | "email"
>;

export type FindUserByIdQueryVariables = {
  id: Scalars["ID"];
};

export type FindUserByIdQuery = { __typename?: "Query" } & {
  findUser: Maybe<{ __typename?: "BasicUser" } & UserWithIdFragment>;
};

export type GetAllUsersQueryVariables = {};

export type GetAllUsersQuery = { __typename?: "Query" } & {
  getUsers: Maybe<
    Array<Maybe<{ __typename?: "BasicUser" } & UserNoIdFragment>>
  >;
};

export type AddUserMutationVariables = {
  userName: Scalars["String"];
  email: Scalars["String"];
};

export type AddUserMutation = { __typename?: "Mutation" } & {
  addUser: Maybe<{ __typename?: "BasicUser" } & UserNoIdFragment>;
};

export type UserAddedSubscriptionVariables = {};

export type UserAddedSubscription = { __typename?: "Subscription" } & {
  userAdded: Maybe<{ __typename?: "BasicUser" } & UserNoIdFragment>;
};

import gql from "graphql-tag";
import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";
export const basicSessionFieldsFragmentDoc = gql`
  fragment basicSessionFields on Session {
    id
    createdAt
    lastUpdated
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
  }
`;
export const boardFieldsFragmentDoc = gql`
  fragment boardFields on Board {
    id
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
    id
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
  query PlayGame($gameId: ID!, $userId: ID!) {
    playGame(gameId: $gameId, userId: $userId) {
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
        id
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
  query GetBoard($gameId: ID!, $userId: ID!) {
    playGame(gameId: $gameId, userId: $userId) {
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
export const GetMovesDocument = gql`
  query GetMoves($id: Int) {
    testGetMoves(id: $id) {
      regularMoves {
        file
      }
      eagerMoves {
        file
      }
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class GetMovesGQL extends Apollo.Query<
  GetMovesQuery,
  GetMovesQueryVariables
> {
  document = GetMovesDocument;
}
export const FindGameDocument = gql`
  mutation FindGame($userId: ID!) {
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
  mutation MovePiece($gameId: ID!, $from: SquareXYInput!, $to: SquareXYInput!) {
    movePiece(gameId: $gameId, from: $from, to: $to) {
      ...boardFields
    }
  }
  ${boardFieldsFragmentDoc}
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
  subscription MatchFound($userId: ID!) {
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
  subscription BoardChanged($userId: ID!) {
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
  query FindUserById($id: ID!) {
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
    addUser(userName: $userName, email: $email) {
      ...userNoId
    }
  }
  ${userNoIdFragmentDoc}
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
