import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import {
  AngularFireFunctionsModule,
  FUNCTIONS_ORIGIN
} from '@angular/fire/functions';
import { environment } from '../environments/environment';
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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireDatabaseModule,
    AngularFireFunctionsModule,
    GraphQLModule, // import GraphQLModule
    AppRoutingModule,
    FormsModule,
    HomeModule,
    UsersModule,
    GameModule,
    GameboardModule
  ],
  providers: [
    {
      provide: FUNCTIONS_ORIGIN,
      useValue: environment.production
        ? `https://${environment.firebase.projectId}.web.app`
        : 'http://localhost:5001'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
