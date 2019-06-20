import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameboardComponent } from './gameboard.component';
import { BoardComponent } from './board/board.component';

@NgModule({
  declarations: [GameboardComponent, BoardComponent],
  imports: [CommonModule]
})
export class GameboardModule {}
