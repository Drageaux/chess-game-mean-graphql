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

export type GameState = {
  gameStarted: Scalars["Boolean"];
  gameOver: Scalars["Boolean"];
  currentTurn?: Maybe<Scalars["String"]>;
};

export type Mutation = {
  _empty?: Maybe<Scalars["String"]>;
  addUser?: Maybe<BasicUser>;
  findGame?: Maybe<Session>;
};

export type MutationAddUserArgs = {
  userName: Scalars["String"];
  email: Scalars["String"];
};

export type MutationFindGameArgs = {
  userId: Scalars["ID"];
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
};

export type QueryFindUserArgs = {
  id: Scalars["ID"];
};

export type QueryPlayGameArgs = {
  gameId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type Session = {
  id: Scalars["ID"];
  players?: Maybe<Array<Player>>;
  createdAt: Scalars["String"];
  lastUpdated: Scalars["String"];
  elapsedTime: Scalars["String"];
  gameState?: Maybe<GameState>;
  gameboard?: Maybe<Gameboard>;
};

export type Square = {
  file?: Maybe<Scalars["String"]>;
  rank?: Maybe<Scalars["Int"]>;
  piece?: Maybe<Piece>;
};

export type Subscription = {
  _empty?: Maybe<Scalars["String"]>;
  userAdded?: Maybe<BasicUser>;
  matchFound?: Maybe<Session>;
};

export type SubscriptionMatchFoundArgs = {
  userId: Scalars["ID"];
};

export type User = {
  id?: Maybe<Scalars["ID"]>;
  userName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};
export type BasicSessionFieldsFragment = { __typename?: "Session" } & Pick<
  Session,
  "id" | "createdAt" | "lastUpdated"
>;

export type PlayGameQueryVariables = {
  gameId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type PlayGameQuery = { __typename?: "Query" } & {
  playGame: Maybe<
    { __typename?: "Session" } & {
      players: Maybe<Array<{ __typename?: "Player" } & UserWithIdFragment>>;
      gameboard: Maybe<
        { __typename?: "Gameboard" } & {
          squares: Maybe<
            Array<
              Maybe<
                { __typename?: "Square" } & Pick<Square, "file" | "rank"> & {
                    piece: Maybe<
                      { __typename?: "Piece" } & Pick<Piece, "color" | "type">
                    >;
                  }
              >
            >
          >;
        }
      >;
    } & BasicSessionFieldsFragment
  >;
};

export type FindGameMutationVariables = {
  userId: Scalars["ID"];
};

export type FindGameMutation = { __typename?: "Mutation" } & {
  findGame: Maybe<{ __typename?: "Session" } & Pick<Session, "elapsedTime">>;
};

export type MatchFoundSubscriptionVariables = {
  userId: Scalars["ID"];
};

export type MatchFoundSubscription = { __typename?: "Subscription" } & {
  matchFound: Maybe<{ __typename?: "Session" } & BasicSessionFieldsFragment>;
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
      gameboard {
        squares {
          file
          rank
          piece {
            color
            type
          }
        }
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
