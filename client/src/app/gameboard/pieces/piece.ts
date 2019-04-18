export class Piece {
  name: string;
  color: 'white' | 'black';
  constructor(name: string, color: 'white' | 'black') {
    this.name = name;
    this.color = color;
  }

  toString() {
    return this.color + ' ' + this.name;
  }
}
