import { Component, OnInit, Input } from '@angular/core';
import { Gameboard, Square } from '@app/types';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() board: Gameboard;

  // view-based
  moving = false;
  selectedSqr: Square;

  constructor() {}

  ngOnInit() {}
}

enum FILE {
  a = 1,
  b = 2,
  c = 3,
  d = 4,
  e = 5,
  f = 6,
  g = 7,
  h = 8
}
