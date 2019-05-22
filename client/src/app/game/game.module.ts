import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { TwoDArrPipe } from './two-d-arr.pipe';

@NgModule({
  declarations: [GameComponent, TwoDArrPipe],
  imports: [
    CommonModule
  ]
})
export class GameModule { }
