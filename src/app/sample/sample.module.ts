import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { SystemErrorComponent } from 'sample/error/view/system-error.component';
import { HeaderModule } from 'sample/header/header.module';
import { SampleRoutingModule } from 'sample/sample-routing.module';
import { SampleComponent } from 'sample/sample.component';
import { TabPageModule } from 'sample/tabpage/tabpage.module';
import { SystemErrorHandler } from './handler';
import { HttpService } from './services/http.service';
import { UserService } from './services/user.service';

/**
 * サンプルアプリとしてのModule定義クラス。
 * 今回のサンプルでは、更に一階層下にTabPageModuleを定義しており、FrontのModuleはほぼTabPageModuleに集約されている。
 */
@NgModule({
    imports: [HttpModule, SampleRoutingModule, TabPageModule, HeaderModule],
    declarations: [SampleComponent, SystemErrorComponent],
    exports: [],
    entryComponents: [SampleComponent, SystemErrorComponent],
    providers: [
        { provide: Http, useClass: HttpService },
        { provide: ErrorHandler, useClass: SystemErrorHandler },
        UserService
    ]
})
export class SampleModule {
}
