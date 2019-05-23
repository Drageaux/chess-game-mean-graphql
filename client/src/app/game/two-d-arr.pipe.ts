import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twoDArr',
  pure: true
})
export class TwoDArrPipe implements PipeTransform {
  // WARNING - do not change the original array
  transform(arr: any[], width: any): any {
    if (arr) {
      const newArr = [];
      while (arr.length) {
        newArr.push(arr.slice(0, width));
        console.log(newArr)
      }
      return newArr;
    }
    return arr;
  }
}
