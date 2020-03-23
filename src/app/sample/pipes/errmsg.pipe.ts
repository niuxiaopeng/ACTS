import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'errmsg' })
export class ErrMsgPipe implements PipeTransform {

    public transform(fields: any[], fieldkey: string): string {
        let result = '';

        if (!fields) {
            return result;
        }

        const err = fields.filter(
            (item) => item.field === fieldkey
        )[0];

        if (err) {
            result = err.message;
        }
        return result;
    }
}
