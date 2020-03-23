import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ErrExistPipe } from 'sample/pipes/errexist.pipe';
import { ErrMsgPipe } from 'sample/pipes/errmsg.pipe';
import { GenderPipe } from 'sample/pipes/gender.pipe';

@NgModule({
    imports: [],
    declarations: [
        GenderPipe,
        ErrExistPipe,
        ErrMsgPipe
    ],
    exports: [
        GenderPipe,
        ErrExistPipe,
        ErrMsgPipe
    ]
})
export class PipeModule { }
