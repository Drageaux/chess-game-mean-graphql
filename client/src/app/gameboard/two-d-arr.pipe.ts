import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twoDArr',
  pure: true
})
export class TwoDArrPipe implements PipeTransform {
  // WARNING - do not change the original array
  transform(arr: any[], width: any): any {
    if (arr) {
      console.time('2D array transform');
      const newArr = [];
      for (let i = 0; i < arr.length; i = i + width) {
        newArr.push(arr.slice(i, i + width));
      }
      console.timeEnd('2D array transform');
      return newArr;
    }
    return arr;
  }
}
