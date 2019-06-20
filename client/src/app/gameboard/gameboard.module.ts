import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameboardComponent } from './gameboard.component';
import { BoardComponent } from './board/board.component';
import { TwoDArrPipe } from './two-d-arr.pipe';

@NgModule({
  declarations: [GameboardComponent, TwoDArrPipe, BoardComponent],
  imports: [CommonModule]
})
export class GameboardModule {}
