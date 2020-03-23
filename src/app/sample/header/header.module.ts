import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from 'sample/header/view/header.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    declarations: [
        HeaderComponent
    ],
    exports: [HeaderComponent],
    entryComponents: [
        HeaderComponent
    ]
})
export class HeaderModule {
}
