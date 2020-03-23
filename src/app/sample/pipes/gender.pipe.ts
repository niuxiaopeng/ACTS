import { Pipe, PipeTransform } from '@angular/core';
import { LabelService } from 'adep/services';
/*
 * Convert code value of gender to actual word.
 * The word represents gender depends on LabelService.
 * Usage:
 *   value | gender
 * Example:
 *   {{ 2 |  gender}}
 *   formats to: label of "common.gender.female"
*/
@Pipe({ name: 'gender' })
export class GenderPipe implements PipeTransform {
    constructor(private labelService: LabelService) {

    }
    public transform(value: string): string {
        let result = '';
        console.log('before transform:' + result);
        if (value === '1') {
            result = this.labelService.labels.common.gender.male;
        } else if (value === '2') {
            result = this.labelService.labels.common.gender.female;
        }
        console.log('after transform:' + result);
        return result;
    }
}
