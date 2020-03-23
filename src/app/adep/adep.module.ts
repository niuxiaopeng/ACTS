import { NgModule } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { ClickEventPlugin } from './dom/click-event.plugin';
import { Dispatcher } from './flux';
import { LabelService } from './services';

@NgModule({
    imports: [],
    declarations: [],
    exports: [],
    entryComponents: []
})
export class AdepModule {
    public static forRoot() {
        return {
            ngModule: AdepModule,
            providers: [
                Dispatcher,
                LabelService,
                { provide: EVENT_MANAGER_PLUGINS, useClass: ClickEventPlugin, multi: true }
            ]
        };
    }
}
