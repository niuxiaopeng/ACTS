import { Inject, Injectable } from '@angular/core';
import { ActionBind, Dispatcher, State, Store } from '../../../adep/flux';
import { UserService } from '../../services/user.service';
import { HomeActionType } from '../action/home.action';
import { HomeEntity } from '../entity/home.entity';

export interface HomeState extends State {
    authToken: string;
    errors: any;
}

/**
 * トップページのログイン画面(タブ)のStore。
 */
@Injectable()
export class HomeStore extends Store<HomeState> {

    /**
     * Storeのコンストラクタでは、主にstateの初期化を行う
     * @param userService 共通サービス(画面間で情報を保持するためのサービス)
     */
    constructor(private userService: UserService) {
        super();
        this.state = {
            authToken: undefined,
            errors: undefined
        };
    }

    /**
     *  ログインAPIのレスポンスを設定する
     * @param {HomeEntity} data 認証トークン
     */
    @ActionBind(HomeActionType.LOGIN)
    private setLoginInfo(data: HomeEntity) {
        console.log('home.store.setLoginInfo');

        // APIが正常終了し、Actionからディスパッチされ、連携されたデータをStateに格納する
        this.state.authToken = data.authToken;
        this.userService.authToken = data.authToken;
        // 予め登録しておいたイベントを発火させる。ここで、HomeComponentの初期処理時に登録したハンドラが紐付き、componentの処理が実行される
        this.sendSignal('LOGIN');
    }

    /**
     *  エラーを設定する
     * @param {any} errors エラー
     */
    @ActionBind(HomeActionType.ERROR)
    private handleError(errors: any) {
        console.log('home.store.handleError');

        // APIがエラーで終了し、Actionからディスパッチされ、連携されたデータをStateに格納する
        // これにより、ログイン画面でエラー内容が表示される(ログイン画面でいうとHTMLでhomeState.errorsとしている箇所が該当する)
        this.state.errors = errors;
    }
}
