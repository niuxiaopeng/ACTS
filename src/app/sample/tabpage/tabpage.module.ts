import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap';
import { PipeModule } from 'sample/pipes/pipes.module';
import { AboutAction } from './action/about.action';
import { ContactAction } from './action/contact.action';
import { CustomerDetailAction } from './action/customer-detail.action';
import {CustomerSearchAction } from './action/customer-search.action';
import { HomeAction } from './action/home.action';
import { AboutStore } from './store/about.store';
import { ContactStore } from './store/contact.store';
import { CustomerDetailStore } from './store/customer-detail.store';
import { CustomerSearchStore } from './store/customer-search.store';
import { HomeStore } from './store/home.store';
import { AboutComponent } from './view/about.component';
import { ContactComponent } from './view/contact.component';
import { CustomerDetailComponent } from './view/customer-detail.component';
import { CustomerSearchComponent } from './view/customer-search.component';
import { HomeComponent } from './view/home.component';
import { TabsComponent } from './view/tabs.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

/**
 * サンプルアプリの各Front機能のModuleを定義するクラス。
 * 主に、Fluxで定義するComponent,Action,Storeを定義します。
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        PipeModule,
        TabsModule.forRoot(),
        NgxMyDatePickerModule.forRoot(),
    ],
    declarations: [
        AboutComponent,
        ContactComponent,
        HomeComponent,
        TabsComponent,
        CustomerSearchComponent,
        CustomerDetailComponent
    ],
    exports: [TabsComponent],
    entryComponents: [
        AboutComponent,
        ContactComponent,
        HomeComponent,
        TabsComponent
    ],
    providers: [
        AboutAction, AboutStore,
        ContactAction, ContactStore,
        HomeAction, HomeStore,
        CustomerSearchAction, CustomerSearchStore,
        CustomerDetailAction, CustomerDetailStore]
})
export class TabPageModule {
}
