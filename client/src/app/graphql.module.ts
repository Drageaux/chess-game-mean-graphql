import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// Apollo
import { ApolloModule, Apollo } from 'apollo-angular';
import { split } from 'apollo-link';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';

// reference: https://blog.cloudboost.io/a-crud-app-with-apollo-graphql-nodejs-express-mongodb-angular5-2874111cd6a5
const uri = '/graphql'; // Development
@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule]
})
export class GraphQLModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    // // Create an http link:
    // const http = httpLink.create({
    //   uri: 'http://localhost:3000/graphql'
    // });
    // // Create a WebSocket link:
    // const ws = new WebSocketLink({
    //   uri: `ws://localhost:3000/graphql`,
    //   options: {
    //     reconnect: true
    //   }
    // });
    // // using the ability to split links, you can send data to each link
    // // depending on what kind of operation is being sent
    // const link = split(
    //   // split based on operation type
    //   ({ query }) => {
    //     const { kind, operation } = getMainDefinition(query);
    //     return kind === 'OperationDefinition' && operation === 'subscription';
    //   },
    //   ws,
    //   http
    // );
    // // create Apollo
    // apollo.create({
    //   link,
    //   cache: new InMemoryCache()
    // });
  }
}
