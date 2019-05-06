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
  getUsers?: Maybe<Array<Maybe<User>>>;
};

export type Subscription = {
  userAdded?: Maybe<User>;
};

export type User = {
  id: Scalars["ID"];
  userName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};
export type GetUsersQueryVariables = {};

export type GetUsersQuery = { __typename?: "Query" } & {
  getUsers: Maybe<
    Array<Maybe<{ __typename?: "User" } & Pick<User, "id" | "userName">>>
  >;
};

export type AddUserMutationVariables = {
  userName: Scalars["String"];
  email: Scalars["String"];
};

export type AddUserMutation = { __typename?: "Mutation" } & {
  addUser: Maybe<
    { __typename?: "User" } & Pick<User, "id" | "userName" | "email">
  >;
};

export type UserAddedSubscriptionVariables = {};

export type UserAddedSubscription = { __typename?: "Subscription" } & {
  userAdded: Maybe<{ __typename?: "User" } & Pick<User, "userName" | "email">>;
};

import gql from "graphql-tag";
import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";

export const GetUsersDocument = gql`
  query getUsers {
    getUsers {
      id
      userName
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class GetUsersGQL extends Apollo.Query<
  GetUsersQuery,
  GetUsersQueryVariables
> {
  document = GetUsersDocument;
}
export const AddUserDocument = gql`
  mutation addUser($userName: String!, $email: String!) {
    addUser(userName: $userName, email: $email) {
      id
      userName
      email
    }
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
  subscription userAdded {
    userAdded {
      userName
      email
    }
  }
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
