import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'errexist' })
export class ErrExistPipe implements PipeTransform {

    public transform(fields: any[], fieldkey: string): boolean {

        if (!fields) {
            return false;
        }
        const err = fields.filter(
            (item) => item.field === fieldkey
        )[0];
        if (err) {
            return true;
        }
        return false;
    }
}
