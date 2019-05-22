import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twoDArr'
})
export class TwoDArrPipe implements PipeTransform {
  transform(arr: any, width: any): any {
    if (arr) {
      const newArr = [];
      while (arr.length) {
        newArr.push(arr.splice(0, width));
      }
      return newArr;
    }
    return arr;
  }
}
