import { File, Square } from './board';
import { prop } from 'typegoose';
import { Piece } from './piece';

export class Move {
  file: File;
  rank: number;
  piece?: Piece;
  onAlly: boolean;

  name?(): string {
    return `${this.file}${this.rank}`;
  }
}
