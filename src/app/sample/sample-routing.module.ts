import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemErrorComponent } from 'sample/error/view/system-error.component';
import { SampleComponent } from 'sample/sample.component';
import { TabPageModule } from 'sample/tabpage/tabpage.module';
import { CustomerSearchComponent } from 'sample/tabpage/view/customer-search.component';
import { TabsComponent } from 'sample/tabpage/view/tabs.component';
import { CustomerDetailComponent } from './tabpage/view/customer-detail.component';

/**
 * サンプルアプリの画面遷移定義。
 * /sample/xxxで遷移された場合に、該当するComponentを参照します。(＝画面遷移します)
 */
const routes: Routes = [

    // path: ''となっているが、app-routing.module.tsにあるように、このRoutingModuleは/sample/xxxで遷移された場合に適用されます。
    {
        path: '',
        component: SampleComponent,
        children: [
            // /sample/tabpageで遷移された場合に、適用されるComponent
            {
                path: 'tabpage',
                component: TabsComponent
            },
            // /sample/customer-searchで遷移された場合に、適用されるComponent
            {
                path: 'customer-search',
                component: CustomerSearchComponent
            },
            // /sample/customer-detailで遷移された場合に、適用されるComponent
            {
                path: 'customer-detail',
                component: CustomerDetailComponent
            },
            // /sample/lazyloadingpageで遷移された場合に、適用されるComponent
            {
                path: 'lazyloadingpage',
                loadChildren: './lazyloadingpage/lazy-loading-page.module#LazyLoadingPageModule'
            },
            // /sample/system-errorで遷移された場合に、適用されるComponent
            {
                path: 'system-error',
                component: SystemErrorComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    providers: []
})
export class SampleRoutingModule { }
