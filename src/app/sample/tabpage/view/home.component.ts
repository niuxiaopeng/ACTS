import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'adep/components';
import { HomeAction } from '../action/home.action';
import { HomeState, HomeStore } from '../store/home.store';

/**
 * トップページのログイン画面(タブ)のComponent。
 * home.component.htmlからボタンアクションなどのイベントを受け取ります。
 */
@Component({
    selector: 'home-component',
    templateUrl: 'home.component.html'
})
export class HomeComponent  extends BaseComponent implements OnInit, OnDestroy {
    /** 画面表示情報 */
    public homeState: HomeState;
    /** 画面入力内容(ID/PW) */
    public loginForm = {
        email: '',
        loginPassword: ''
    };

    /**
     * コンストラクタ
     * @param action Actionクラス
     * @param homeStore Storeクラス
     * @param router 画面遷移
     */
    constructor(private action: HomeAction, private homeStore: HomeStore, private router: Router) {
        super();
        // ここでStateを取得し、クラス内のインスタンスに保持することで、画面にデータを表示します。
        this.homeState = this.homeStore.getState();
    }

    /**
     * 初期処理(Angularのライフサイクルイベント)
     */
    public ngOnInit(): void {
        // Store処理が完了したタイミングで、Component側の処理を実行するために、Storeに対して、イベントハンドラを登録している
        this.homeStore.registerSignalHandler('LOGIN', () => this.confirmLoginResult());
    }

    /**
     * Componentが破棄されたタイミングで実行される処理(Angularのライフサイクルイベント)
     */
    public ngOnDestroy() {
        // イベントハンドラーの登録解除(これをしないと、初期処理のハンドラ登録処理で不整合がおきて画面がバグる)
        this.homeStore.unregisterSignalHandler('LOGIN');
    }

   /**
    * ログイン結果を確認する。
    * ログインボタンに定義されている(click)イベントに紐付いている。
    */
    public login() {
        console.log('home.component.login()');
        // ログインのActionの処理を呼び出す。
        this.action.login(this.loginForm.email, this.loginForm.loginPassword);
    }

   /**
    * ログイン結果を確認する
    * (ログイン成功時に呼び出されている)
    */
    private confirmLoginResult() {
        console.log('home.component.confirmLoginResult()');
        if (this.homeState.authToken) {
            // ログインが正常終了した場合(StoreでauthTokenが取得でき、Stateにセットされた場合)、検索画面に遷移する
            // ここで、sample-routing.module.tsの遷移定義を参照し、次のComponentに切り替えることになる
            this.router.navigate(['/sample/customer-search'], {});
        } else {
            // ログイン失敗した場合、何もしない
        }
    }
}
