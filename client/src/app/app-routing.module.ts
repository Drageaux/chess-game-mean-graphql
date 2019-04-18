import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './user/users.component';
import { GameboardComponent } from './gameboard/gameboard.component';

const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    component: GameboardComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
