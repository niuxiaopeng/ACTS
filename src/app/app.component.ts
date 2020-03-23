import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

/**
 * 最上位のComponentクラス。開発者が編集することはない。
 */
@Component({
    selector: 'app-component',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private router: Router) {
    }

    /**
     * 全ての画面が表示された際に実行される初期処理。
     */
    public ngOnInit() {
        console.log('app has initialized.');

        // 画面遷移がされた場合に、画面のスクロールをトップに移動する
        // SPAでは厳密には画面遷移はしておらず、一つの画面で表示内容を切り替えているため、スクロールをトップにすることで、画面遷移したように見せている
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }

}
