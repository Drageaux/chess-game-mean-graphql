import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { TwoDArrPipe } from './two-d-arr.pipe';
import { BoardComponent } from './board/board.component';

@NgModule({
  declarations: [GameComponent, TwoDArrPipe, BoardComponent],
  imports: [
    CommonModule
  ]
})
export class GameModule { }
