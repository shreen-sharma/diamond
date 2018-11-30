import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterData',
    pure: false
})
export class FilterDataPipe implements PipeTransform {
    transform(items: any[], filter: FilterDataParam): any {
        if (!items || !filter) {
            return items;
        }
        return items.filter(item => item[filter.property] == filter.value);
    }
}

export class FilterDataParam {
    property: string;
    value: string;
}