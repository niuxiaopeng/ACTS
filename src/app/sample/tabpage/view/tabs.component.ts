import { Component } from '@angular/core';
import { AboutComponent } from './about.component';
import { ContactComponent } from './contact.component';
import { HomeComponent } from './home.component';

/**
 * ログインページの親Component。
 * ここで処理が実装されていないのは、各タブをComponent化していて、タブ間の共通的な処理がないためです。
 */
@Component({
    selector: 'tabs-component',
    templateUrl: 'tabs.component.html'
})
export class TabsComponent {
}
