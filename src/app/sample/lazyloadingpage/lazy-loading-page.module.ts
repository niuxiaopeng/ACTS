import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LazyLoadingPageRoutingModule } from 'sample/lazyloadingpage/lazy-loading-page-routing,module';
import { LazyLoadComponent } from 'sample/lazyloadingpage/view/lazy-load.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LazyLoadingPageRoutingModule
    ],
    declarations: [
        LazyLoadComponent
    ],
    exports: [],
    entryComponents: [
        LazyLoadComponent
    ]
})
export class LazyLoadingPageModule {
}
