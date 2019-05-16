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

export type Mutation = {
  addUser?: Maybe<User>;
};

export type MutationAddUserArgs = {
  userName: Scalars["String"];
  email: Scalars["String"];
};

export type Query = {
  findUser?: Maybe<User>;
  getUsers?: Maybe<Array<Maybe<User>>>;
};

export type QueryFindUserArgs = {
  id: Scalars["ID"];
};

export type Subscription = {
  userAdded?: Maybe<User>;
};

export type User = {
  id: Scalars["ID"];
  userName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};
export type UserWithIdFragment = { __typename?: "User" } & Pick<
  User,
  "id" | "userName" | "email"
>;

export type UserNoIdFragment = { __typename?: "User" } & Pick<
  User,
  "userName" | "email"
>;

export type FindUserByIdQueryVariables = {
  id: Scalars["ID"];
};

export type FindUserByIdQuery = { __typename?: "Query" } & {
  findUser: Maybe<{ __typename?: "User" } & UserWithIdFragment>;
};

export type GetAllUsersQueryVariables = {};

export type GetAllUsersQuery = { __typename?: "Query" } & {
  getUsers: Maybe<Array<Maybe<{ __typename?: "User" } & UserNoIdFragment>>>;
};

export type AddUserMutationVariables = {
  userName: Scalars["String"];
  email: Scalars["String"];
};

export type AddUserMutation = { __typename?: "Mutation" } & {
  addUser: Maybe<{ __typename?: "User" } & UserNoIdFragment>;
};

export type UserAddedSubscriptionVariables = {};

export type UserAddedSubscription = { __typename?: "Subscription" } & {
  userAdded: Maybe<{ __typename?: "User" } & UserNoIdFragment>;
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
