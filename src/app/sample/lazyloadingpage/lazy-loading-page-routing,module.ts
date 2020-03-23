import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LazyLoadComponent } from 'sample/lazyloadingpage/view/lazy-load.component';

const routes: Routes = [
    {
        path: '', component: LazyLoadComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    providers: []
})
export class LazyLoadingPageRoutingModule { }
