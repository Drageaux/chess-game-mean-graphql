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

export type Gameboard = {
  squares?: Maybe<Array<Maybe<Square>>>;
};

export type GameSession = {
  id: Scalars["ID"];
  players?: Maybe<Array<Player>>;
  createdAt: Scalars["String"];
  lastUpdated: Scalars["String"];
  gameState?: Maybe<GameState>;
  gameboard?: Maybe<Gameboard>;
};

export type GameState = {
  gameStarted: Scalars["Boolean"];
  gameOver: Scalars["Boolean"];
  currentTurn?: Maybe<Scalars["String"]>;
};

export type Mutation = {
  _empty?: Maybe<Scalars["String"]>;
  addUser?: Maybe<BasicUser>;
  joinSession?: Maybe<WaitingInQueue>;
};

export type MutationAddUserArgs = {
  userName: Scalars["String"];
  email: Scalars["String"];
};

export type MutationJoinSessionArgs = {
  userId: Scalars["ID"];
};

export type Player = User & {
  id?: Maybe<Scalars["ID"]>;
  userName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  color?: Maybe<TeamColor>;
};

export type Query = {
  _empty?: Maybe<Scalars["String"]>;
  findUser?: Maybe<BasicUser>;
  getUsers?: Maybe<Array<Maybe<BasicUser>>>;
};

export type QueryFindUserArgs = {
  id: Scalars["ID"];
};

export type Square = {
  file?: Maybe<Scalars["String"]>;
  rank?: Maybe<Scalars["Int"]>;
};

export type Subscription = {
  _empty?: Maybe<Scalars["String"]>;
  userAdded?: Maybe<BasicUser>;
  matchFound?: Maybe<GameSession>;
};

export type SubscriptionMatchFoundArgs = {
  userId: Scalars["ID"];
};

export enum TeamColor {
  White = "WHITE",
  Black = "BLACK"
}

export type User = {
  id?: Maybe<Scalars["ID"]>;
  userName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};

export type WaitingInQueue = {
  elapsedTime: Scalars["String"];
};
export type JoinGameMutationVariables = {
  userId: Scalars["ID"];
};

export type JoinGameMutation = { __typename?: "Mutation" } & {
  joinSession: Maybe<
    { __typename?: "WaitingInQueue" } & Pick<WaitingInQueue, "elapsedTime">
  >;
};

export type MatchFoundSubscriptionVariables = {
  userId: Scalars["ID"];
};

export type MatchFoundSubscription = { __typename?: "Subscription" } & {
  matchFound: Maybe<
    { __typename?: "GameSession" } & Pick<
      GameSession,
      "id" | "createdAt" | "lastUpdated"
    > & {
        gameboard: Maybe<
          { __typename?: "Gameboard" } & {
            squares: Maybe<
              Array<
                Maybe<{ __typename?: "Square" } & Pick<Square, "file" | "rank">>
              >
            >;
          }
        >;
      }
  >;
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
export const JoinGameDocument = gql`
  mutation JoinGame($userId: ID!) {
    joinSession(userId: $userId) {
      elapsedTime
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class JoinGameGQL extends Apollo.Mutation<
  JoinGameMutation,
  JoinGameMutationVariables
> {
  document = JoinGameDocument;
}
export const MatchFoundDocument = gql`
  subscription MatchFound($userId: ID!) {
    matchFound(userId: $userId) {
      id
      createdAt
      lastUpdated
      gameboard {
        squares {
          file
          rank
        }
      }
    }
  }
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
