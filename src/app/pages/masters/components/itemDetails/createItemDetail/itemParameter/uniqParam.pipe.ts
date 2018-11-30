import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'uniqParam',
    pure: false
})
export class UniqParamPipe implements PipeTransform {
    transform(items: any[], selectedIds: string[], currentValue): any {
        if (!items || !selectedIds) {
            return items;
        }
        return items.filter(item => {
            if (selectedIds.indexOf(item['paramId'] + '') === -1 || currentValue == item['paramId']) {
                return item;
            }
            return false;
        });
    }
}
