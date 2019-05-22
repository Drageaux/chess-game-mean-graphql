import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// Apollo
import { GraphQLModule } from './graphql.module';
// Custom
import { HomeModule } from './home/home.module';
import { UsersModule } from './user/users.module';
import { GameModule } from './game/game.module';
import { GameboardModule } from './gameboard/gameboard.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule, // provides HttpClient for HttpLink
    GraphQLModule, // import GraphQLModule
    AppRoutingModule,
    FormsModule,
    HomeModule,
    UsersModule,
    GameModule,
    GameboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
