import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { SubSink } from 'subsink';
import { File, Color, PieceType } from '@app/types';
import { Board } from '@app/interfaces';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  // expose inside component so template can access
  public eFile = File;
  public eColor = Color;
  public ePieceType = PieceType;

  @Input() board: Board;
  @Input() currTurn: Color;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
