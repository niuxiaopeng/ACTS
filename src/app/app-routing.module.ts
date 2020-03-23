import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

/**
 * 画面遷移を定義する
 */
const routes: Routes = [

    // EndpointRoot(例：localだとhttp://localhost:3000/)でアクセスされた場合、/sample/tabpageにリダイレクトする
    // 第一階層の/sampleを探しにいくが、ここでは直下に定義されているpath: 'sample'が該当する
    {
        path: '',
        redirectTo: '/sample/tabpage',
        pathMatch: 'full'
    },
    // ここから、SampleModuleに定義されている画面遷移の定義(SampleRoutingModule)を参照しにいき、/tabpageを探す
    {
        path: 'sample',
        loadChildren: './sample/sample.module#SampleModule',
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
