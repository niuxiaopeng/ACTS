import { ErrorHandler, Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule } from '@angular/router';
import {HttpService} from './sample/services/http.service';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker/dist/ngx-my-date-picker.module';

import { AdepModule } from 'adep/adep.module';
import { InjectionUtils } from 'adep/utils/injection.utils';
import { AppComponent } from 'app.component';

import { AppRoutingModule } from 'app-routing.module';
import { SystemErrorHandler } from 'sample/handler/system-error.handler';

/**
 * 最上位のModuleを定義するクラス。基本的に開発者が編集することはない。
 */
@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        AdepModule.forRoot(),
        // CalendarModule,
        // SelectButtonModule,
        BrowserModule,
        // DatePickerModule,
        // BrowserAnimationsModule,
        // BsDatepickerModule.forRoot(),
        NgxMyDatePickerModule,
        FormsModule,
        AppRoutingModule,
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        AppComponent
    ],

    providers: [
        { provide: ErrorHandler, useClass: SystemErrorHandler }
    ]
})
export class AppModule {
    constructor(private injector: Injector) {
        InjectionUtils.injector = this.injector;
    }
}
