import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'propValNotInArray',
    pure: false
})
export class PropValNotInArrayPipe implements PipeTransform {
    transform(items: any[], prop: string, arr: any[], excludedId?: number): any {
        if (!items || !prop || !arr) {
          return items;
        }
        return items.filter(item => {
          return (arr.indexOf(item[prop]) == -1 || item[prop] == excludedId);
        });
    }
}
